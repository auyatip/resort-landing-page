import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSession, isValidAdminSession, SESSION_MAX_AGE, verifyAdminPassword } from "../../../lib/admin-auth";

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
  if (!(await verifyAdminPassword(String(password || "")))) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: SESSION_MAX_AGE, path: "/" });
  return response;
}
