import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "../../../../../lib/admin-auth";
import { getBookingLogs } from "../../../../../lib/booking-log";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthorized(request)) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ success: true, logs: await getBookingLogs(params.id) });
}
