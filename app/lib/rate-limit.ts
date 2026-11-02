import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export function getClientIp(request: Request) {
  return request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim()
    || request.headers.get("x-real-ip")
    || request.headers.get("x-forwarded-for")?.split(",")[0].trim()
    || "unknown";
}

export async function consumeRateLimit(key: string, limit: number, windowSeconds: number) {
  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, windowSeconds);
    return { allowed: count <= limit, count, retryAfter: windowSeconds };
  } catch (error) {
    // Keep the public booking flow available if the limiter itself is unavailable.
    console.error("Rate limiter unavailable:", error);
    return { allowed: true, count: 0, retryAfter: windowSeconds };
  }
}
