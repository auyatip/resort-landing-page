import { randomUUID } from "crypto";
import { Redis } from "@upstash/redis";

export type BookingLogActor = "guest" | "admin" | "stripe" | "system";
export type BookingLogStatus = "success" | "failed" | "ignored";

export type BookingLog = {
  id: string;
  bookingId?: string;
  event: string;
  actor: BookingLogActor;
  status: BookingLogStatus;
  timestamp: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  stripeEventId?: string;
};

const redis = Redis.fromEnv();
const LOG_LIMIT = 500;

function logKey(bookingId: string) {
  return `booking-logs:${bookingId}`;
}

function dedupeKey(key: string) {
  return `booking-log-dedupe:${key}`;
}

/**
 * Audit logging is deliberately best-effort. A Redis logging failure must not
 * prevent a valid booking or payment from completing.
 */
export async function writeBookingLog(input: Omit<BookingLog, "id" | "timestamp"> & { dedupeKey?: string }) {
  try {
    if (input.dedupeKey) {
      const claimed = await redis.set(dedupeKey(input.dedupeKey), "1", { nx: true, ex: 60 * 60 * 24 * 90 });
      if (!claimed) return false;
    }

    const log: BookingLog = { ...input, id: randomUUID(), timestamp: new Date().toISOString() };
    if (log.bookingId) {
      await redis.rpush(logKey(log.bookingId), log);
      await redis.ltrim(logKey(log.bookingId), -LOG_LIMIT, -1);
    }
    return true;
  } catch (error) {
    console.error("Booking log write failed:", { input, error });
    return false;
  }
}

export async function getBookingLogs(bookingId: string) {
  return (await redis.lrange<BookingLog>(logKey(bookingId), 0, -1)).reverse();
}
