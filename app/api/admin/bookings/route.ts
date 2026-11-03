import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Booking } from "../../../lib/booking";
import { isAdminAuthorized } from "../../../lib/admin-auth";
import { writeBookingLog } from "../../../lib/booking-log";

const redis = Redis.fromEnv();
async function refundPayment(paymentIntent: string, bookingId: string) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("Stripe is not configured");
  const params = new URLSearchParams({ payment_intent: paymentIntent });
  const response = await fetch("https://api.stripe.com/v1/refunds", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Idempotency-Key": `booking-refund-${bookingId}`,
    },
    body: params,
  });
  if (!response.ok) throw new Error("Stripe refund failed");
  return response.json();
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthorized(request)) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  try {
    const { bookingId, action } = await request.json();
    if (!bookingId || !["cancel", "refund"].includes(action)) return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    const bookings: Booking[] = (await redis.get("bookings")) || [];
    const booking = bookings.find((item) => item.id === bookingId);
    if (!booking) return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    if (booking.bookingStatus === "cancelled" && (action === "cancel" || booking.paymentStatus === "refunded" || booking.refundStatus === "succeeded")) {
      return NextResponse.json({ success: true, booking });
    }

    let paymentStatus = booking.paymentStatus;
    if (action === "refund") {
      if (booking.paymentStatus !== "paid" || !booking.paymentReference) return NextResponse.json({ success: false, message: "This booking has no refundable payment" }, { status: 400 });
      await writeBookingLog({ bookingId, event: "admin.booking_refund_requested", actor: "admin", status: "success", metadata: { paymentReference: booking.paymentReference } });
      const refund = await refundPayment(booking.paymentReference, booking.id);
      if (refund.status !== "succeeded" && refund.status !== "pending") throw new Error("Refund was not accepted");
      paymentStatus = "refunded";
      await writeBookingLog({ bookingId, event: "admin.booking_refunded", actor: "admin", status: "success", metadata: { refundStatus: refund.status } });
    }
    const updatedBooking = { ...booking, bookingStatus: "cancelled" as const, paymentStatus, ...(action === "refund" ? { refundStatus: "succeeded" as const } : {}) };
    await redis.set("bookings", bookings.map((item) => item.id === bookingId ? updatedBooking : item));
    await writeBookingLog({ bookingId, event: "admin.booking_cancelled", actor: "admin", status: "success", metadata: { action, paymentStatus } });
    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error("Admin booking action failed:", error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to update booking" }, { status: 500 });
  }
}
