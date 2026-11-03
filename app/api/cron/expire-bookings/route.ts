import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Booking, expireUnpaidBookings } from "../../../lib/booking";
import { expireStripeCheckoutSession } from "../../../lib/stripe-booking";
import { writeBookingLog } from "../../../lib/booking-log";

const redis = Redis.fromEnv();

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  if (!secret) {
    console.error("CRON_SECRET is not configured.");
    return NextResponse.json({ success: false, message: "Cron is not configured" }, { status: 503 });
  }
  if (authorization !== "Bearer " + secret) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  try {
    const bookings: Booking[] = (await redis.get("bookings")) || [];
    const expired = bookings.filter((booking) => booking.bookingStatus === "pending" && booking.paymentStatus === "pending" && new Date(booking.holdUntil) <= new Date());
    let stripeSessionsExpired = 0;
    for (const booking of expired) {
      try {
        if (await expireStripeCheckoutSession(booking.paymentReference, booking.id)) stripeSessionsExpired += 1;
      } catch (error) {
        console.error("Cron could not expire Stripe Checkout session:", { bookingId: booking.id, error });
      }
    }
    const result = expireUnpaidBookings(bookings);
    if (result.changed) {
      await redis.set("bookings", result.bookings);
      await Promise.all(expired.map((booking) => writeBookingLog({ bookingId: booking.id, event: "booking.expired", actor: "system", status: "success", metadata: { holdUntil: booking.holdUntil } })));
    }
    return NextResponse.json({ success: true, expired: result.bookings.filter((booking, index) => result.changed && bookings[index]?.bookingStatus === "pending" && booking.bookingStatus === "cancelled").length, stripeSessionsExpired });
  } catch (error) {
    console.error("Expire bookings cron failed:", error);
    return NextResponse.json({ success: false, message: "Unable to expire bookings" }, { status: 500 });
  }
}
