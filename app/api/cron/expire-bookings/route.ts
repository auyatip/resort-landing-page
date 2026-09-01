import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Booking, expireUnpaidBookings } from "../../../lib/booking";

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
    const result = expireUnpaidBookings(bookings);
    if (result.changed) await redis.set("bookings", result.bookings);
    return NextResponse.json({ success: true, expired: result.bookings.filter((booking, index) => result.changed && bookings[index]?.bookingStatus === "pending" && booking.bookingStatus === "cancelled").length });
  } catch (error) {
    console.error("Expire bookings cron failed:", error);
    return NextResponse.json({ success: false, message: "Unable to expire bookings" }, { status: 500 });
  }
}
