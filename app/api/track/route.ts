import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "visitors.json");

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

function readData(): Visitor[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return parsed.visitors || [];
  } catch {
    return [];
  }
}

function writeData(visitors: Visitor[]) {
  // Keep last 5000 records to prevent file from growing too large
  const trimmed = visitors.slice(-5000);
  fs.writeFileSync(DATA_FILE, JSON.stringify({ visitors: trimmed }, null, 2), "utf-8");
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

    const visitors = readData();
    const ip = getClientIP(request);
    const now = new Date();

    if (type === "enter") {
      // New visitor entry
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
      visitors.push(visitor);
      writeData(visitors);

      return NextResponse.json({ success: true, message: "Visit recorded" });
    }

    if (type === "heartbeat") {
      // Update duration for existing visitor
      const visitor = visitors.find((v) => v.id === visitorId);
      if (visitor) {
        visitor.lastActive = now.toISOString();
        visitor.durationMinutes = durationMinutes || visitor.durationMinutes;
        writeData(visitors);
      }

      return NextResponse.json({ success: true, message: "Heartbeat updated" });
    }

    if (type === "leave") {
      // Final update when user leaves
      const visitor = visitors.find((v) => v.id === visitorId);
      if (visitor) {
        visitor.lastActive = now.toISOString();
        visitor.durationMinutes = durationMinutes || visitor.durationMinutes;
        writeData(visitors);
      }

      return NextResponse.json({ success: true, message: "Leave recorded" });
    }

    return NextResponse.json({ success: false, message: "Unknown type" }, { status: 400 });
  } catch (error) {
    console.error("Track error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}