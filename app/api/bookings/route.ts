import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { Redis } from "@upstash/redis";
import { BOOKING_HOLD_MINUTES, Booking, expireUnpaidBookings, getAvailableRoomNumbers, getNights, getStayPricing, isBookingEnabled, RoomClosure, ROOM_COUNT } from "../../lib/booking";

const redis = Redis.fromEnv();
const BOOKINGS_KEY = "bookings";
const BOOKING_SETTINGS_KEY = "booking-settings";
const BOOKING_LOCK_KEY = "booking-create-lock";

async function getBookings() {
  const stored: Booking[] = (await redis.get(BOOKINGS_KEY)) || [];
  const result = expireUnpaidBookings(stored);
  if (result.changed) await redis.set(BOOKINGS_KEY, result.bookings);
  return result.bookings;
}

async function getBookingSettings() {
  const settings = (await redis.get<{ bookingOpen?: boolean; openRooms?: number[]; closures?: RoomClosure[] }>(BOOKING_SETTINGS_KEY)) || {};
  return { bookingOpen: isBookingEnabled() && settings.bookingOpen !== false, openRooms: settings.openRooms || Array.from({ length: ROOM_COUNT }, (_, index) => index + 1), closures: settings.closures || [] };
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
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

async function createStripeCheckout(booking: Booking) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return null;

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/booking/success?booking=${booking.id}`);
  params.set("cancel_url", `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/booking?cancelled=${booking.id}`);
  params.set("line_items[0][price_data][currency]", "thb");
  params.set("line_items[0][price_data][product_data][name]", "A-Thip House stay - " + (booking.rooms || 1) + " room" + ((booking.rooms || 1) > 1 ? "s" : "") + ", " + booking.nights + " night" + (booking.nights > 1 ? "s" : ""));
  params.set("line_items[0][price_data][unit_amount]", String(booking.amount * 100));
  params.set("line_items[0][quantity]", "1");
  if (booking.email) params.set("customer_email", booking.email);
  params.set("metadata[booking_id]", booking.id);

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  if (!response.ok) throw new Error("Stripe checkout could not be created");
  const session = await response.json();
  return { url: session.url as string, id: session.id as string };
}

export async function POST(request: NextRequest) {
  try {
    const settings = await getBookingSettings();
    if (!settings.bookingOpen) return jsonError("Bookings are currently closed.", 423);
    const body = await request.json();
    const guestName = String(body.guestName || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const requestedRoomsValue = Number(body.rooms) || 1;
    if (!Number.isInteger(requestedRoomsValue) || requestedRoomsValue < 1 || requestedRoomsValue > ROOM_COUNT) {
      return jsonError("Please choose a valid number of rooms.");
    }
    const requestedRooms = requestedRoomsValue;
    const checkIn = String(body.checkIn || "");
    const checkOut = String(body.checkOut || "");
    const nights = getNights(checkIn, checkOut);

    if (!guestName) return jsonError("Please enter your name.");
    if (!phone) return jsonError("Please enter your phone number or WhatsApp.");
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return jsonError("Please enter a valid email address.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut) || nights < 1 || nights > 90) return jsonError("Please choose valid check-in and check-out dates.");
    if (new Date(`${checkIn}T00:00:00Z`) < new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z")) return jsonError("Check-in cannot be in the past.");

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
    const booking: Booking = {
      id: `ATH-${now.getTime().toString(36).toUpperCase()}`,
      roomNumber: roomNumbers[0],
      roomNumbers,
      rooms: requestedRooms,
      guestName, email, phone, checkIn, checkOut, nights,
      amount: getStayPricing(checkIn, checkOut).total * requestedRooms,
      bookingStatus: "pending", paymentStatus: "pending",
      createdAt: now.toISOString(),
      holdUntil: new Date(now.getTime() + BOOKING_HOLD_MINUTES * 60000).toISOString(),
    };
    const checkout = await createStripeCheckout(booking);
    if (checkout) booking.paymentReference = checkout.id;
    await redis.set(BOOKINGS_KEY, [...bookings.slice(-4999), booking]);

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
    const settings = await getBookingSettings();
    const checkIn = request.nextUrl.searchParams.get("checkIn") || "";
    const checkOut = request.nextUrl.searchParams.get("checkOut") || "";
    const nights = getNights(checkIn, checkOut);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut) || nights < 1) {
      return NextResponse.json({ success: true, availableRooms: settings.bookingOpen ? settings.openRooms.length : 0, roomCount: ROOM_COUNT, bookingOpen: settings.bookingOpen, openRooms: settings.openRooms });
    }
    const storedBookings = await getBookings();
    const bookings = storedBookings.map((booking, index) => ({ ...booking, roomNumber: booking.roomNumber || (index % ROOM_COUNT) + 1 }));
    const occupied = new Set(bookings.filter((booking) => booking.bookingStatus !== "cancelled" && booking.checkIn < checkOut && booking.checkOut > checkIn && (booking.paymentStatus === "paid" || new Date(booking.holdUntil) > new Date())).flatMap((booking) => booking.roomNumbers?.length ? booking.roomNumbers : [booking.roomNumber]));
    settings.closures.filter((closure) => closure.checkIn < checkOut && closure.checkOut > checkIn).forEach((closure) => occupied.add(closure.roomNumber));
    const availableRooms = settings.openRooms.filter((room) => !occupied.has(room)).length;
    return NextResponse.json({ success: true, availableRooms: settings.bookingOpen ? availableRooms : 0, roomCount: ROOM_COUNT, available: settings.bookingOpen && availableRooms > 0, bookingOpen: settings.bookingOpen, openRooms: settings.openRooms });
  } catch {
    return jsonError("Availability is temporarily unavailable.", 500);
  }
}
