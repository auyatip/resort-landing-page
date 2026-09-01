import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Booking } from "../../../lib/booking";

const redis = Redis.fromEnv();

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const bookings: Booking[] = (await redis.get("bookings")) || [];
  const booking = bookings.find((item) => item.id === params.id);
  if (!booking) return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
  return NextResponse.json({
    success: true,
    status: booking.paymentStatus === "paid" && booking.bookingStatus === "confirmed" ? "confirmed" : "processing",
    booking: {
      id: booking.id,
      guestName: booking.guestName,
      roomNumber: booking.roomNumber,
      roomNumbers: booking.roomNumbers || [booking.roomNumber],
      rooms: booking.rooms || (booking.roomNumbers?.length || 1),
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      nights: booking.nights,
      amount: booking.amount,
      bookingStatus: booking.bookingStatus,
      paymentStatus: booking.paymentStatus,
    },
  }, { status: booking.paymentStatus === "paid" && booking.bookingStatus === "confirmed" ? 200 : 202 });
}
