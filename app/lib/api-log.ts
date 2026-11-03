import { Redis } from "@upstash/redis";

export type ApiLog = {
  id: string;
  method: string;
  path: string;
  status: number;
  durationMs: number;
  timestamp: string;
  ip?: string;
  userAgent?: string;
};

const redis = Redis.fromEnv();
const API_LOG_KEY = "booking-api-request-logs";
const API_LOG_LIMIT = 2000;

export async function writeApiLog(input: Omit<ApiLog, "id" | "timestamp">) {
  try {
    const log: ApiLog = { ...input, id: crypto.randomUUID(), timestamp: new Date().toISOString() };
    await redis.rpush(API_LOG_KEY, log);
    await redis.ltrim(API_LOG_KEY, -API_LOG_LIMIT, -1);
  } catch (error) {
    console.error("API log write failed:", { input, error });
  }
}

export async function getApiLogs(limit = 200) {
  const safeLimit = Math.min(Math.max(limit, 1), API_LOG_LIMIT);
  return (await redis.lrange<ApiLog>(API_LOG_KEY, -safeLimit, -1)).reverse();
}
