import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { Redis } from "@upstash/redis";
import { BOOKING_HOLD_MINUTES, Booking, compactBookings, expireUnpaidBookings, getAvailableRoomNumbers, getNights, getStayDiscount, getStayPricing, isBookingEnabled, retryAsync, RoomClosure, ROOM_COUNT } from "../../lib/booking";
import { getPricingConfig, getStayPricingFromConfig } from "../../lib/pricing-server";
import { consumeRateLimit, getClientIp } from "../../lib/rate-limit";
import { expireStripeCheckoutSession } from "../../lib/stripe-booking";
import { writeBookingLog } from "../../lib/booking-log";

const redis = Redis.fromEnv();
const BOOKINGS_KEY = "bookings";
const BOOKING_SETTINGS_KEY = "booking-settings";
const BOOKING_LOCK_KEY = "booking-create-lock";

async function getBookings() {
  const stored: Booking[] = (await redis.get(BOOKINGS_KEY)) || [];
  const result = expireUnpaidBookings(stored);
  const expired = stored.filter((booking) => booking.bookingStatus === "pending" && booking.paymentStatus === "pending" && new Date(booking.holdUntil) <= new Date());
  await Promise.all(expired.map(async (booking) => {
      try { await expireStripeCheckoutSession(booking.paymentReference, booking.id); }
    catch (error) { console.error("Unable to expire Stripe Checkout session:", { bookingId: booking.id, error }); }
  }));
  const compacted = compactBookings(result.bookings);
  if (result.changed || compacted.length !== result.bookings.length) await redis.set(BOOKINGS_KEY, compacted);
  return compacted;
}

async function getBookingSettings() {
  const settings = (await redis.get<{ bookingOpen?: boolean; openRooms?: number[]; closures?: RoomClosure[] }>(BOOKING_SETTINGS_KEY)) || {};
  return { bookingOpen: isBookingEnabled() && settings.bookingOpen !== false, openRooms: settings.openRooms || Array.from({ length: ROOM_COUNT }, (_, index) => index + 1), closures: settings.closures || [] };
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

function withAvailabilityCache(response: NextResponse) {
  response.headers.set("Cache-Control", "public, s-maxage=15, stale-while-revalidate=30");
  return response;
}

async function checkAvailabilityAbuse(request: NextRequest, checkIn: string, checkOut: string) {
  const ip = getClientIp(request);
  const requestRate = await consumeRateLimit(`availability-check:${ip}`, 30, 60);
  if (!requestRate.allowed) return requestRate;

  const scanKey = `availability-scan:${ip}`;
  const dateSignature = `${checkIn}:${checkOut}`;
  const uniqueDates = await redis.sadd(scanKey, dateSignature);
  if (uniqueDates === 1) await redis.expire(scanKey, 5 * 60);
  return { allowed: uniqueDates <= 12, count: uniqueDates, retryAfter: 5 * 60 };
}

function availabilityRateLimitError(retryAfter: number) {
  const response = jsonError("Availability checks are temporarily limited. Please try again later.", 429);
  response.headers.set("Retry-After", String(retryAfter));
  return response;
}

async function acquireBookingLock(token: string) {
  return Boolean(await redis.set(BOOKING_LOCK_KEY, token, { nx: true, ex: 20 }));
}

async function releaseBookingLock(token: string) {
  try {
    await redis.eval("if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end", [BOOKING_LOCK_KEY], [token]);
  } catch {
    await redis.del(BOOKING_LOCK_KEY);
  }
}

async function createStripeCheckout(booking: Booking, requestOrigin: string) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return null;

  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configuredSiteUrl && process.env.NODE_ENV === "production") throw new Error("NEXT_PUBLIC_SITE_URL must be configured in production");
  const siteUrl = process.env.NODE_ENV === "production"
    ? configuredSiteUrl || requestOrigin || "http://localhost:3000"
    : requestOrigin || configuredSiteUrl || "http://localhost:3000";
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${siteUrl}/booking/success?booking=${booking.receiptToken}`);
  params.set("cancel_url", `${siteUrl}/booking?cancelled=${booking.id}`);
  params.set("line_items[0][price_data][currency]", "thb");
  params.set("line_items[0][price_data][product_data][name]", "A-Thip House stay - " + (booking.rooms || 1) + " room" + ((booking.rooms || 1) > 1 ? "s" : "") + ", " + booking.nights + " night" + (booking.nights > 1 ? "s" : ""));
  params.set("line_items[0][price_data][unit_amount]", String(booking.amount * 100));
  params.set("line_items[0][quantity]", "1");
  if (booking.email) params.set("customer_email", booking.email);
  params.set("metadata[booking_id]", booking.id);

  const response = await retryAsync(async () => {
    const result = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    if (result.status >= 500) throw new Error(`Stripe temporary error: ${result.status}`);
    return result;
  });
  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Stripe checkout creation failed:", { status: response.status, body: errorBody });
    throw new Error("Stripe checkout could not be created");
  }
  const session = await response.json();
  return { url: session.url as string, id: session.id as string };
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) return jsonError("Payment is temporarily unavailable. Please try again later.", 503);
    const settings = await getBookingSettings();
    if (!settings.bookingOpen) return jsonError("Bookings are currently closed.", 423);
    const body = await request.json();
    const firstName = String(body.firstName || "").trim();
    const lastName = String(body.lastName || "").trim();
    const guestName = `${firstName} ${lastName}`.trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const policyAccepted = body.policyAccepted === true;
    const requestedRoomsValue = Number(body.rooms) || 1;
    if (!Number.isInteger(requestedRoomsValue) || requestedRoomsValue < 1 || requestedRoomsValue > ROOM_COUNT) {
      return jsonError("Please choose a valid number of rooms.");
    }
    const requestedRooms = requestedRoomsValue;
    const checkIn = String(body.checkIn || "");
    const checkOut = String(body.checkOut || "");
    const nights = getNights(checkIn, checkOut);

    if (!firstName || !lastName) return jsonError("Please enter your first and last name.");
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return jsonError("Please enter a valid email address.");
    if (!phone) return jsonError("Please enter your phone number or WhatsApp.");
    if (!policyAccepted) return jsonError("Please agree to the Booking & Cancellation Policy.");
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return jsonError("Please enter a valid email address.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut) || nights < 1 || nights > 90) return jsonError("Please choose valid check-in and check-out dates.");
    if (new Date(`${checkIn}T00:00:00Z`) < new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z")) return jsonError("Check-in cannot be in the past.");

    const rate = await consumeRateLimit(`booking-create:${getClientIp(request)}`, 10, 10 * 60);
    if (!rate.allowed) {
      const response = jsonError("Too many booking attempts. Please try again later.", 429);
      response.headers.set("Retry-After", String(rate.retryAfter));
      return response;
    }

    const lockToken = randomUUID();
    if (!await acquireBookingLock(lockToken)) return jsonError("Another booking is being processed. Please try again.", 409);
    try {
      const storedBookings = await getBookings();
    // Give older bookings a deterministic room number after inventory was added.
    const bookings: Booking[] = storedBookings.map((booking, index) => ({
      ...booking,
      roomNumber: booking.roomNumber || (index % 5) + 1,
    }));
    const availableRoomNumbers = getAvailableRoomNumbers(bookings, checkIn, checkOut, settings.openRooms, settings.closures);
    if (availableRoomNumbers.length < requestedRooms) return jsonError("Not enough rooms are available for these dates.", 409);
    const roomNumbers = availableRoomNumbers.slice(0, requestedRooms);

    const now = new Date();
    const stayPricing = getStayPricingFromConfig(checkIn, checkOut, await getPricingConfig());
    const stayDiscount = getStayDiscount(stayPricing.total, stayPricing.nights);
    const booking: Booking = {
      id: `ATH-${now.getTime().toString(36).toUpperCase()}`,
      roomNumber: roomNumbers[0],
      roomNumbers,
      rooms: requestedRooms,
      guestName, firstName, lastName, email, phone, policyAcceptedAt: new Date().toISOString(), checkIn, checkOut, nights,
      amount: stayDiscount.total * requestedRooms,
      subtotal: stayPricing.total * requestedRooms,
      discount: stayDiscount.discount * requestedRooms,
      discountRate: stayDiscount.rate,
      bookingStatus: "pending", paymentStatus: "pending",
      createdAt: now.toISOString(),
      holdUntil: new Date(now.getTime() + BOOKING_HOLD_MINUTES * 60000).toISOString(),
      receiptToken: randomUUID(),
    };
    await redis.set(BOOKINGS_KEY, compactBookings([...bookings, booking]));
      await writeBookingLog({
        bookingId: booking.id,
        event: "booking.created",
        actor: "guest",
        status: "success",
        metadata: { checkIn, checkOut, nights, rooms: requestedRooms, amount: booking.amount, roomNumbers },
        ip: getClientIp(request),
        userAgent: request.headers.get("user-agent") || undefined,
      });

    let checkout: { url: string; id: string } | null = null;
    try {
      checkout = await createStripeCheckout(booking, request.nextUrl.origin);
        if (!checkout) throw new Error("Stripe checkout was not created");
        await writeBookingLog({ bookingId: booking.id, event: "stripe.checkout.created", actor: "stripe", status: "success", metadata: { sessionId: checkout.id, amount: booking.amount } });
    } catch (error) {
        await writeBookingLog({ bookingId: booking.id, event: "stripe.checkout.create_failed", actor: "stripe", status: "failed", metadata: { error: error instanceof Error ? error.message : String(error) } });
      await redis.set(BOOKINGS_KEY, compactBookings([...bookings, { ...booking, bookingStatus: "cancelled", paymentStatus: "failed" }]));
        await writeBookingLog({ bookingId: booking.id, event: "booking.cancelled", actor: "system", status: "success", metadata: { reason: "stripe_checkout_creation_failed" } });
      throw error;
    }
    if (checkout) {
      booking.paymentReference = checkout.id;
      await redis.set(BOOKINGS_KEY, compactBookings([...bookings, booking]));
    }

      return NextResponse.json({ success: true, booking, checkoutUrl: checkout?.url || null, paymentConfigured: Boolean(checkout) });
    } finally {
      await releaseBookingLock(lockToken);
    }
  } catch (error) {
    console.error("Booking error:", error);
    return jsonError("Booking service is temporarily unavailable.", 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const checkIn = request.nextUrl.searchParams.get("checkIn") || "";
    const checkOut = request.nextUrl.searchParams.get("checkOut") || "";
    const abuseCheck = await checkAvailabilityAbuse(request, checkIn, checkOut);
    if (!abuseCheck.allowed) return availabilityRateLimitError(abuseCheck.retryAfter);

    const settings = await getBookingSettings();
    const nights = getNights(checkIn, checkOut);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut) || nights < 1) {
      return withAvailabilityCache(NextResponse.json({ success: true, availableRooms: settings.bookingOpen ? settings.openRooms.length : 0, roomCount: ROOM_COUNT, bookingOpen: settings.bookingOpen, openRooms: settings.openRooms }));
    }
    const storedBookings = await getBookings();
    const bookings = storedBookings.map((booking, index) => ({ ...booking, roomNumber: booking.roomNumber || (index % ROOM_COUNT) + 1 }));
    const occupied = new Set(bookings.filter((booking) => booking.bookingStatus !== "cancelled" && booking.checkIn < checkOut && booking.checkOut > checkIn && (booking.paymentStatus === "paid" || new Date(booking.holdUntil) > new Date())).flatMap((booking) => booking.roomNumbers?.length ? booking.roomNumbers : [booking.roomNumber]));
    settings.closures.filter((closure) => closure.checkIn < checkOut && closure.checkOut > checkIn).forEach((closure) => occupied.add(closure.roomNumber));
    const availableRooms = settings.openRooms.filter((room) => !occupied.has(room)).length;
    return withAvailabilityCache(NextResponse.json({ success: true, availableRooms: settings.bookingOpen ? availableRooms : 0, roomCount: ROOM_COUNT, available: settings.bookingOpen && availableRooms > 0, bookingOpen: settings.bookingOpen, openRooms: settings.openRooms }));
  } catch {
    return jsonError("Availability is temporarily unavailable.", 500);
  }
}
