import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, clearLoginFailures, createAdminSession, getLoginFailureCount, getRequestIp, isValidAdminSession, LOGIN_FAILURE_LIMIT, LOGIN_FAILURE_WINDOW, registerLoginFailure, SESSION_MAX_AGE, verifyAdminPassword } from "../../../lib/admin-auth";

export async function GET(request: NextRequest) {
  return NextResponse.json({ authenticated: isValidAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value) });
}

export async function POST(request: NextRequest) {
  const { action, password } = await request.json().catch(() => ({}));
  if (action === "logout") {
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 0, path: "/" });
    return response;
  }
  const ip = getRequestIp(request);
  const failures = await getLoginFailureCount(ip);
  if (failures >= LOGIN_FAILURE_LIMIT) {
    return NextResponse.json({ success: false, message: "Too many failed attempts. Try again in 15 minutes." }, {
      status: 429,
      headers: { "Retry-After": String(LOGIN_FAILURE_WINDOW) },
    });
  }
  if (!(await verifyAdminPassword(String(password || "")))) {
    const count = await registerLoginFailure(ip);
    return NextResponse.json({
      success: false,
      message: count >= LOGIN_FAILURE_LIMIT
        ? "Too many failed attempts. Try again in 15 minutes."
        : "Unauthorized",
    }, { status: count >= LOGIN_FAILURE_LIMIT ? 429 : 401 });
  }
  await clearLoginFailures(ip);
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: SESSION_MAX_AGE, path: "/" });
  return response;
}
