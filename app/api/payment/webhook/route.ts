import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { Redis } from "@upstash/redis";
import { Booking } from "../../../lib/booking";

const redis = Redis.fromEnv();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "atipthummakul@gmail.com";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character] || character));
}

async function sendAdminBookingEmail(booking: Booking) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not configured; admin booking email was skipped.");
    return false;
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const subject = "New paid booking " + booking.id + " — A-Thip House";
  const text = [
    "A new booking has been paid and confirmed.",
    "",
    "Booking ID: " + booking.id,
    "Guest: " + booking.guestName,
    "Phone: " + (booking.phone || "-"),
    "Rooms: #" + (booking.roomNumbers?.join(", #") || booking.roomNumber),
    "Check-in: " + booking.checkIn,
    "Check-out: " + booking.checkOut,
    "Nights: " + booking.nights,
    "Total paid: THB " + booking.amount.toLocaleString(),
    "",
    "View booking: " + siteUrl + "/admin",
  ].join("\n");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json", "Idempotency-Key": "booking-confirmed-" + booking.id },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "A-Thip House <onboarding@resend.dev>",
      to: [ADMIN_EMAIL],
      subject,
      text,
      html: "<h2>New paid booking</h2><p>Your booking has been paid and confirmed.</p><table>" +
        [["Booking ID", booking.id], ["Guest", booking.guestName], ["Phone", booking.phone || "-"], ["Rooms", "#" + (booking.roomNumbers?.join(", #") || booking.roomNumber)], ["Check-in", booking.checkIn], ["Check-out", booking.checkOut], ["Nights", String(booking.nights)], ["Total paid", "THB " + booking.amount.toLocaleString()]].map(([label, value]) => "<tr><td style=\"padding:6px 16px 6px 0\"><strong>" + label + "</strong></td><td style=\"padding:6px 0\">" + escapeHtml(value) + "</td></tr>").join("") +
        "</table><p><a href=\"" + escapeHtml(siteUrl + "/admin") + "\">Open admin dashboard</a></p>",
    }),
  });
  if (!response.ok) throw new Error("Resend email failed: " + await response.text());
  return true;
}

function verifyStripeSignature(payload: string, signature: string, secret: string) {
  const timestamp = signature.split(",").find((part) => part.startsWith("t="))?.slice(2);
  const v1 = signature.split(",").find((part) => part.startsWith("v1="))?.slice(3);
  if (!timestamp || !v1 || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  return expected.length === v1.length && timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
}

export async function POST(request: NextRequest) {
  console.log("Stripe webhook request received");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) {
    console.error("Stripe webhook rejected: missing secret or stripe-signature header");
    return NextResponse.json({ received: false }, { status: 400 });
  }

  const payload = await request.text();
  if (!verifyStripeSignature(payload, signature, secret)) {
    console.error("Stripe webhook rejected: invalid signature");
    return NextResponse.json({ received: false }, { status: 400 });
  }

  try {
    const event = JSON.parse(payload);
    console.log("Stripe webhook event:", event.type);
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object;
      const bookingId = session.metadata?.booking_id;
      console.log("Stripe checkout booking metadata:", { bookingId: bookingId || null, resendConfigured: Boolean(process.env.RESEND_API_KEY), adminEmail: ADMIN_EMAIL });
      if (bookingId) {
        const bookings: Booking[] = (await redis.get("bookings")) || [];
        const current = bookings.find((booking) => booking.id === bookingId);
        if (!current) return NextResponse.json({ received: true });
        if (session.payment_status !== "paid" || Number(session.amount_total) !== current.amount * 100 || String(session.currency || "").toLowerCase() !== "thb") {
          console.error("Stripe checkout validation failed:", { bookingId, paymentStatus: session.payment_status, amountTotal: session.amount_total, currency: session.currency });
          return NextResponse.json({ received: false }, { status: 400 });
        }
        if (current.bookingStatus === "confirmed" && current.paymentStatus === "paid" && current.adminEmailSentAt) {
          return NextResponse.json({ received: true });
        }
        if (current.bookingStatus === "cancelled") {
          await redis.set("bookings", bookings.map((booking) => booking.id === bookingId
            ? { ...booking, paymentStatus: "paid" as const, paymentReference: session.payment_intent || booking.paymentReference, latePayment: true }
            : booking));
          console.error("Payment received after booking expired or was cancelled:", bookingId);
          return NextResponse.json({ received: true });
        }
        const confirmedBooking: Booking = { ...current, bookingStatus: "confirmed", paymentStatus: "paid", paymentReference: session.payment_intent || current.paymentReference };
        const updated = bookings.map((booking) => booking.id === bookingId ? confirmedBooking : booking);
        await redis.set("bookings", updated);
        const emailSent = await sendAdminBookingEmail(confirmedBooking);
        console.log("Admin booking email result:", { bookingId, sent: emailSent });
        if (emailSent) {
          await redis.set("bookings", updated.map((booking) => booking.id === bookingId ? { ...booking, adminEmailSentAt: new Date().toISOString() } : booking));
        }
      } else {
        console.warn("Stripe checkout completed without metadata.booking_id");
      }
    }
    if (event.type === "checkout.session.expired") {
      const bookingId = event.data.object.metadata?.booking_id;
      if (bookingId) {
        const bookings: Booking[] = (await redis.get("bookings")) || [];
        await redis.set("bookings", bookings.map((booking) => booking.id === bookingId
          ? { ...booking, bookingStatus: "cancelled" as const, paymentStatus: "failed" as const }
          : booking));
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Payment webhook failed:", error);
    return NextResponse.json({ received: false }, { status: 400 });
  }
}
