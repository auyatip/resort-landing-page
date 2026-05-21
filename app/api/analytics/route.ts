import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "athip2024";

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

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (token !== ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const visitors: Visitor[] = (await redis.get("visitors")) || [];
    const now = new Date();
    const todayStr = now.toLocaleDateString("th-TH", { timeZone: "Asia/Bangkok" });

    // Calculate statistics
    const totalVisits = visitors.length;
    const todayVisits = visitors.filter((v) => v.date === todayStr).length;

    // Unique visitors by IP
    const uniqueIPs = new Set(visitors.map((v) => v.ip));
    const uniqueVisitors = uniqueIPs.size;

    const todayUniqueIPs = new Set(
      visitors.filter((v) => v.date === todayStr).map((v) => v.ip)
    );
    const todayUniqueVisitors = todayUniqueIPs.size;

    // Average duration
    const withDuration = visitors.filter((v) => v.durationMinutes > 0);
    const avgDuration =
      withDuration.length > 0
        ? withDuration.reduce((sum, v) => sum + v.durationMinutes, 0) / withDuration.length
        : 0;

    const todayWithDuration = visitors.filter(
      (v) => v.date === todayStr && v.durationMinutes > 0
    );
    const todayAvgDuration =
      todayWithDuration.length > 0
        ? todayWithDuration.reduce((sum, v) => sum + v.durationMinutes, 0) /
          todayWithDuration.length
        : 0;

    // Visits by date
    const visitsByDate: Record<string, number> = {};
    visitors.forEach((v) => {
      visitsByDate[v.date] = (visitsByDate[v.date] || 0) + 1;
    });

    // Top referrers
    const referrerCount: Record<string, number> = {};
    visitors.forEach((v) => {
      const ref = v.referrer === "direct" ? "Direct" : v.referrer;
      referrerCount[ref] = (referrerCount[ref] || 0) + 1;
    });
    const topReferrers = Object.entries(referrerCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([referrer, count]) => ({ referrer, count }));

    // Top pages
    const pageCount: Record<string, number> = {};
    visitors.forEach((v) => {
      pageCount[v.page] = (pageCount[v.page] || 0) + 1;
    });
    const topPages = Object.entries(pageCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }));

    // Device breakdown
    const deviceCount = { mobile: 0, desktop: 0, tablet: 0 };
    visitors.forEach((v) => {
      const ua = v.userAgent.toLowerCase();
      if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
        deviceCount.mobile++;
      } else if (ua.includes("tablet") || ua.includes("ipad")) {
        deviceCount.tablet++;
      } else {
        deviceCount.desktop++;
      }
    });

    // Recent visitors (last 100)
    const recentVisitors = visitors
      .slice(-100)
      .reverse()
      .map((v) => ({
        id: v.id,
        date: v.date,
        time: v.time,
        page: v.page,
        referrer: v.referrer,
        ip: v.ip.replace(/(\d+\.\d+)\.\d+\.\d+/, "$1.***.***"),
        durationMinutes: Math.round(v.durationMinutes * 10) / 10,
        device:
          v.userAgent.toLowerCase().includes("mobile") ||
          v.userAgent.toLowerCase().includes("android") ||
          v.userAgent.toLowerCase().includes("iphone")
            ? "📱 Mobile"
            : v.userAgent.toLowerCase().includes("tablet") || v.userAgent.toLowerCase().includes("ipad")
            ? "📱 Tablet"
            : "💻 Desktop",
      }));

    return NextResponse.json({
      success: true,
      data: {
        totalVisits,
        todayVisits,
        uniqueVisitors,
        todayUniqueVisitors,
        avgDuration: Math.round(avgDuration * 10) / 10,
        todayAvgDuration: Math.round(todayAvgDuration * 10) / 10,
        visitsByDate,
        topReferrers,
        topPages,
        deviceCount,
        recentVisitors,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}