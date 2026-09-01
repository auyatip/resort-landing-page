import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export const ADMIN_SESSION_COOKIE = "athip_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createAdminSession() {
  const payload = `${Date.now()}.${Date.now() + SESSION_MAX_AGE * 1000}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidAdminSession(token?: string) {
  if (!token || !secret()) return false;
  const [created, expires, signature] = token.split(".");
  if (!created || !expires || !signature || Number(expires) < Date.now()) return false;
  const payload = `${created}.${expires}`;
  const expected = sign(payload);
  return expected.length === signature.length && timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function isAdminAuthorized(request: NextRequest) {
  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (isValidAdminSession(session)) return true;
  const password = process.env.ADMIN_PASSWORD;
  const bearer = request.headers.get("authorization")?.replace("Bearer ", "");
  return Boolean(password && bearer === password);
}

export async function verifyAdminPassword(password: string) {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash || !password) return false;
  return bcrypt.compare(password, hash);
}

export { SESSION_MAX_AGE };
