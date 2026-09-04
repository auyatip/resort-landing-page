import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "../../lib/admin-auth";
import { getPricingConfig, PricingConfig } from "../../lib/pricing-server";

export async function GET() { return NextResponse.json({ success: true, pricing: await getPricingConfig() }); }

export async function POST(request: NextRequest) {
  if (!isAdminAuthorized(request)) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const current = await getPricingConfig();
  const monthlyKeys = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december", "newYear"] as const;
  const currentMonthly = current as Record<typeof monthlyKeys[number], number>;
  const values = monthlyKeys.reduce((result, key) => {
    const value = Number(body.pricing?.[key]);
    result[key] = Number.isInteger(value) && value >= 10 && value <= 100000 ? value : currentMonthly[key];
    return result;
  }, {} as Omit<PricingConfig, "daily">);
  const weekend = monthlyKeys.reduce((result, key) => {
    const value = Number(body.pricing?.weekend?.[key]);
    result[key] = Number.isInteger(value) && value >= 10 && value <= 100000 ? value : current.weekend[key];
    return result;
  }, {} as Record<typeof monthlyKeys[number], number>);
  const daily = Object.entries(body.pricing?.daily || {}).reduce((result, [date, rawValue]) => {
    const value = Number(rawValue);
    if (/^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isInteger(value) && value >= 10 && value <= 100000) result[date] = value;
    return result;
  }, {} as Record<string, number>);
  const { Redis } = await import("@upstash/redis");
  const redis = Redis.fromEnv();
  const saved = { ...values, weekend, daily } as PricingConfig;
  await redis.set("room-pricing", saved);
  return NextResponse.json({ success: true, pricing: saved });
}
