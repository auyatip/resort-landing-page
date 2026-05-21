"use client";

import { useEffect, useRef } from "react";

export default function VisitorTracker() {
  const visitorIdRef = useRef<string>("");
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    // Don't track in development or admin page
    if (process.env.NODE_ENV === "development") return;
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) return;

    // Generate unique visitor ID for this session
    const sessionId = sessionStorage.getItem("vid");
    if (sessionId) {
      visitorIdRef.current = sessionId;
    } else {
      const newId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      visitorIdRef.current = newId;
      sessionStorage.setItem("vid", newId);
    }

    startTimeRef.current = Date.now();

    // Track page enter
    const trackEnter = async () => {
      try {
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "enter",
            visitorId: visitorIdRef.current,
            page: window.location.pathname,
            referrer: document.referrer || "direct",
            userAgent: navigator.userAgent,
          }),
        });
      } catch {
        // Silently fail
      }
    };

    trackEnter();

    // Heartbeat every 30 seconds to track duration
    const heartbeatInterval = setInterval(async () => {
      const durationMinutes = (Date.now() - startTimeRef.current) / 60000;
      try {
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "heartbeat",
            visitorId: visitorIdRef.current,
            durationMinutes: Math.round(durationMinutes * 100) / 100,
          }),
        });
      } catch {
        // Silently fail
      }
    }, 30000);

    // Track when user leaves
    const trackLeave = async () => {
      const durationMinutes = (Date.now() - startTimeRef.current) / 60000;
      try {
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "leave",
            visitorId: visitorIdRef.current,
            durationMinutes: Math.round(durationMinutes * 100) / 100,
          }),
        });
      } catch {
        // Silently fail
      }
    };

    // Use both beforeunload and visibilitychange for better tracking
    const handleBeforeUnload = () => {
      // Use sendBeacon for more reliable exit tracking
      const durationMinutes = (Date.now() - startTimeRef.current) / 60000;
      const data = JSON.stringify({
        type: "leave",
        visitorId: visitorIdRef.current,
        durationMinutes: Math.round(durationMinutes * 100) / 100,
      });
      navigator.sendBeacon("/api/track", data);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        trackLeave();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      trackLeave();
    };
  }, []);

  // This component renders nothing
  return null;
}