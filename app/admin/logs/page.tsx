"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "../../components/AdminShell";
import ApiLogsPanel from "./ApiLogsPanel";

type Booking = {
  id: string;
  guestName: string;
  email?: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  bookingStatus: string;
  paymentStatus: string;
  createdAt: string;
};

type BookingLog = {
  id: string;
  event: string;
  actor: string;
  status: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
};

function statusClass(status: string) {
  if (status === "success") return "bg-green-50 text-green-700";
  if (status === "failed") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
}

export default function AdminActivityLogsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [logs, setLogs] = useState<BookingLog[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/analytics")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Unable to load bookings");
        setBookings(result.data.bookings || []);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  const filteredBookings = useMemo(() => bookings.filter((booking) => `${booking.id} ${booking.guestName} ${booking.email || ""}`.toLowerCase().includes(query.toLowerCase())), [bookings, query]);

  const loadLogs = async (bookingId: string) => {
    setSelectedId(bookingId);
    setLogsLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/bookings/${encodeURIComponent(bookingId)}/logs`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to load activity logs");
      setLogs(result.logs || []);
    } catch (reason) {
      setLogs([]);
      setError(reason instanceof Error ? reason.message : "Unable to load activity logs");
    } finally {
      setLogsLoading(false);
    }
  };

  return <AdminShell active="logs"><main className="min-h-screen bg-[#f4f0e7] p-5 text-[#20352b] md:p-10"><header className="mb-6"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#a47d2e]">Operations / Audit trail</p><h1 className="mt-2 font-serif text-4xl font-bold">Activity logs</h1><p className="mt-2 text-sm text-gray-500">ตรวจสอบทุก activity ของการจอง การชำระเงิน และการเรียก API</p></header>{error && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}<div className="grid gap-5 lg:grid-cols-[minmax(280px,360px)_1fr]"><section className="overflow-hidden rounded-3xl border border-[#dfe7e1] bg-white shadow-sm"><div className="border-b border-[#edf1ee] p-5"><h2 className="font-semibold">เลือก booking</h2><input aria-label="ค้นหา booking" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหา ID หรือชื่อลูกค้า" className="mt-4 min-h-11 w-full rounded-xl border border-[#dfe7e1] bg-[#f8faf8] px-4 text-sm outline-none focus:border-[#2d5038]" /></div><div className="max-h-[650px] overflow-y-auto">{loading ? <p className="p-5 text-sm text-gray-500">กำลังโหลด booking…</p> : filteredBookings.map((booking) => <button key={booking.id} type="button" onClick={() => loadLogs(booking.id)} className={`w-full border-b border-[#edf1ee] px-5 py-4 text-left transition hover:bg-[#f8faf8] ${selectedId === booking.id ? "bg-[#eef5ef]" : ""}`}><div className="flex items-start justify-between gap-3"><span className="font-semibold">{booking.guestName}</span><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${booking.paymentStatus === "paid" ? "bg-green-50 text-green-700" : booking.bookingStatus === "cancelled" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{booking.paymentStatus}</span></div><div className="mt-1 font-mono text-[11px] text-[#819087]">{booking.id}</div><div className="mt-2 text-xs text-[#66766c]">{booking.checkIn} → {booking.checkOut} · ฿{booking.amount.toLocaleString()}</div></button>)}{!loading && filteredBookings.length === 0 && <p className="p-5 text-sm text-gray-500">ไม่พบ booking</p>}</div></section><section className="rounded-3xl border border-[#dfe7e1] bg-white shadow-sm"><div className="border-b border-[#edf1ee] p-5"><h2 className="font-semibold">Timeline</h2><p className="mt-1 text-sm text-gray-500">{selectedId || "เลือก booking เพื่อดู log"}</p></div>{logsLoading ? <p className="p-6 text-sm text-gray-500">กำลังโหลด log…</p> : !selectedId ? <p className="p-6 text-sm text-gray-500">เลือก booking จากรายการด้านซ้าย</p> : logs.length === 0 ? <p className="p-6 text-sm text-gray-500">ยังไม่มี log สำหรับ booking นี้</p> : <div className="divide-y divide-[#edf1ee]">{logs.map((log) => <article key={log.id} className="p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-sm font-semibold text-[#20352b]">{log.event}</span><span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${statusClass(log.status)}`}>{log.status}</span><span className="rounded-full bg-[#f4f0e7] px-2 py-1 text-[10px] font-semibold uppercase text-[#66766c]">{log.actor}</span></div><time className="text-xs text-[#819087]">{new Date(log.timestamp).toLocaleString("th-TH")}</time></div>{(log.metadata || log.ip || log.userAgent) && <pre className="mt-3 overflow-x-auto rounded-xl bg-[#f8faf8] p-3 text-xs leading-relaxed text-[#405449]">{JSON.stringify({ ...log.metadata, ...(log.ip ? { ip: log.ip } : {}), ...(log.userAgent ? { userAgent: log.userAgent } : {}) }, null, 2)}</pre>}</article>)}</div>}</section></div><ApiLogsPanel /></main></AdminShell>;
}
