import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "../../../lib/admin-auth";
import { getApiLogs } from "../../../lib/api-log";

export async function GET(request: NextRequest) {
  if (!isAdminAuthorized(request)) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  try {
    const requestedLimit = Number(request.nextUrl.searchParams.get("limit") || 200);
    return NextResponse.json({ success: true, logs: await getApiLogs(Number.isFinite(requestedLimit) ? requestedLimit : 200) });
  } catch (error) {
    console.error("Unable to load booking API logs:", error);
    return NextResponse.json({ success: false, message: "Unable to load booking API logs" }, { status: 500 });
  }
}
