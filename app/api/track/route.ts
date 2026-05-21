import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

interface Visitor {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  timezone: string;
  page: string;
  referrer: string;
  userAgent: string;
  ip: string;
  durationMinutes: number;
  lastActive: string;
}

function getClientIP(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    return xff.split(",")[0].trim();
  }
  return "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, visitorId, page, referrer, userAgent, durationMinutes } = body;

    const ip = getClientIP(request);
    const now = new Date();

    if (type === "enter") {
      const visitor: Visitor = {
        id: visitorId,
        timestamp: now.toISOString(),
        date: now.toLocaleDateString("th-TH", { timeZone: "Asia/Bangkok" }),
        time: now.toLocaleTimeString("th-TH", {
          timeZone: "Asia/Bangkok",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        page: page || "/",
        referrer: referrer || "direct",
        userAgent: userAgent || "",
        ip: ip,
        durationMinutes: 0,
        lastActive: now.toISOString(),
      };

      // Get current list, append new visitor, keep last 5000
      const current: Visitor[] = (await redis.get("visitors")) || [];
      current.push(visitor);
      const trimmed = current.slice(-5000);
      await redis.set("visitors", trimmed);

      return NextResponse.json({ success: true, message: "Visit recorded" });
    }

    if (type === "heartbeat" || type === "leave") {
      const visitors: Visitor[] = (await redis.get("visitors")) || [];
      const visitor = visitors.find((v) => v.id === visitorId);
      if (visitor) {
        visitor.lastActive = now.toISOString();
        visitor.durationMinutes = durationMinutes || visitor.durationMinutes;
        await redis.set("visitors", visitors);
      }

      return NextResponse.json({
        success: true,
        message: type === "heartbeat" ? "Heartbeat updated" : "Leave recorded",
      });
    }

    return NextResponse.json({ success: false, message: "Unknown type" }, { status: 400 });
  } catch (error) {
    console.error("Track error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}