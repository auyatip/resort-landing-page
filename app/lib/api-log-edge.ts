import { Redis } from "@upstash/redis/cloudflare";

const redis = Redis.fromEnv({
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || "",
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});
const API_LOG_KEY = "booking-api-request-logs";
const API_LOG_LIMIT = 2000;

type ApiLogInput = {
  method: string;
  path: string;
  status: number;
  durationMs: number;
  ip?: string;
  userAgent?: string;
};

export async function writeApiLog(input: ApiLogInput) {
  try {
    const log = { ...input, id: crypto.randomUUID(), timestamp: new Date().toISOString() };
    await redis.rpush(API_LOG_KEY, log);
    await redis.ltrim(API_LOG_KEY, -API_LOG_LIMIT, -1);
  } catch (error) {
    console.error("API log write failed:", { input, error });
  }
}
