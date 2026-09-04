import { Redis } from "@upstash/redis";
import { NIGHTLY_RATES_THB, getNights } from "./booking";

type MonthlyKey = keyof typeof NIGHTLY_RATES_THB;
export type PricingConfig = { -readonly [Key in MonthlyKey]: number } & { daily: Record<string, number>; weekend: Record<MonthlyKey, number> };
const redis = Redis.fromEnv();
const PRICING_KEY = "room-pricing";

export async function getPricingConfig(): Promise<PricingConfig> {
  const saved = await redis.get<Partial<PricingConfig>>(PRICING_KEY);
  return { ...NIGHTLY_RATES_THB, ...(saved || {}), daily: saved?.daily || {}, weekend: { ...NIGHTLY_RATES_THB, ...(saved?.weekend || {}) } } as PricingConfig;
}

export function getRateFromConfig(dateString: string, pricing: PricingConfig) {
  const date = new Date(dateString + "T00:00:00Z");
  if (Number.isNaN(date.getTime())) return pricing.default;
  if (pricing.daily[dateString]) return pricing.daily[dateString];
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  if (month === 12 && day >= 30 || month === 1 && day <= 2) return pricing.newYear;
  const keys = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"] as const;
  const key = month === 12 && day >= 30 || month === 1 && day <= 2 ? "newYear" : keys[month - 1];
  const isWeekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;
  return isWeekend ? pricing.weekend[key] : pricing[key];
}

export function getStayPricingFromConfig(checkIn: string, checkOut: string, pricing: PricingConfig) {
  const nights = getNights(checkIn, checkOut);
  const rates: number[] = [];
  const start = new Date(checkIn + "T00:00:00Z");
  for (let index = 0; index < nights; index += 1) rates.push(getRateFromConfig(new Date(start.getTime() + index * 86400000).toISOString().slice(0, 10), pricing));
  return { nights, rates, total: rates.reduce((sum, rate) => sum + rate, 0) };
}
