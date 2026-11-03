import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { writeApiLog } from "./app/lib/api-log-edge";

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const pathname = request.nextUrl.pathname;
  const isBookingApi = pathname === "/api/bookings"
    || pathname.startsWith("/api/bookings/")
    || pathname === "/api/admin/bookings"
    || pathname.startsWith("/api/admin/bookings/")
    || pathname === "/api/payment/webhook"
    || pathname === "/api/cron/expire-bookings"
    || pathname === "/api/booking-settings";
  const shouldSkip = !isBookingApi || (pathname.startsWith("/api/admin/bookings/") && pathname.endsWith("/logs"));
  if (shouldSkip || request.method === "OPTIONS") return NextResponse.next();

  const startedAt = Date.now();
  event.waitUntil(writeApiLog({
    method: request.method,
    path: pathname,
    // Middleware cannot see the final route handler response status. 0 means
    // that the request reached the middleware and the final status is unknown.
    status: 0,
    durationMs: Date.now() - startedAt,
    ip: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || undefined,
    userAgent: request.headers.get("user-agent") || undefined,
  }));
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
