import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { RoomClosure, ROOM_COUNT } from "../../lib/booking";
import { isAdminAuthorized } from "../../lib/admin-auth";

const redis = Redis.fromEnv();
const SETTINGS_KEY = "booking-settings";
export async function GET() {
  const settings = (await redis.get<{ bookingOpen?: boolean; openRooms?: number[]; closures?: RoomClosure[] }>(SETTINGS_KEY)) || {};
  return NextResponse.json({ bookingOpen: settings.bookingOpen !== false, openRooms: settings.openRooms || Array.from({ length: ROOM_COUNT }, (_, index) => index + 1), closures: settings.closures || [] });
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthorized(request)) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  if (typeof body.bookingOpen !== "boolean" || !Array.isArray(body.openRooms) || !Array.isArray(body.closures)) return NextResponse.json({ success: false, message: "Invalid booking settings" }, { status: 400 });
  const openRooms = body.openRooms.filter((room: unknown): room is number => typeof room === "number" && Number.isInteger(room) && room >= 1 && room <= ROOM_COUNT);
  const closures = body.closures.filter((closure: RoomClosure) => closure && Number.isInteger(closure.roomNumber) && closure.roomNumber >= 1 && closure.roomNumber <= ROOM_COUNT && /^\d{4}-\d{2}-\d{2}$/.test(closure.checkIn) && /^\d{4}-\d{2}-\d{2}$/.test(closure.checkOut) && closure.checkIn < closure.checkOut).slice(-1000);
  await redis.set(SETTINGS_KEY, { bookingOpen: body.bookingOpen, openRooms, closures, updatedAt: new Date().toISOString() });
  return NextResponse.json({ success: true, bookingOpen: body.bookingOpen, openRooms, closures });
}
