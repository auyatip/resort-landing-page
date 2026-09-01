"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface AnalyticsData {
  totalVisits: number;
  todayVisits: number;
  uniqueVisitors: number;
  todayUniqueVisitors: number;
  avgDuration: number;
  todayAvgDuration: number;
  visitsByDate: Record<string, number>;
  topReferrers: { referrer: string; count: number }[];
  topPages: { page: string; count: number }[];
  deviceCount: { mobile: number; desktop: number; tablet: number };
  recentVisitors: {
    id: string;
    date: string;
    time: string;
    page: string;
    referrer: string;
    ip: string;
    durationMinutes: number;
    device: string;
  }[];
  bookings: {
    id: string;
    roomNumber?: number;
    roomNumbers?: number[];
    rooms?: number;
    guestName: string;
    email?: string;
    phone?: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    amount: number;
    bookingStatus: string;
    paymentStatus: string;
    createdAt: string;
  }[];
  bookingOpen: boolean;
  openRooms: number[];
  closures: { id: string; roomNumber: number; checkIn: string; checkOut: string; note?: string }[];
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [closureForm, setClosureForm] = useState({ roomNumber: 1, checkIn: "", checkOut: "", note: "" });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/analytics");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError("รหัสผ่านไม่ถูกต้อง ❌");
        setIsAuthenticated(false);
      }
    } catch {
      setError("ไม่สามารถโหลดข้อมูลได้");
    }
    setLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/admin/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (!response.ok) { setError("รหัสผ่านไม่ถูกต้อง ❌"); return; }
    setIsAuthenticated(true);
    fetchData();
  };

  const handleRefresh = () => {
    fetchData();
  };

  const saveBookingSettings = async (bookingOpen: boolean, openRooms: number[], closures = data?.closures || []) => {
    if (!data) return;
    const response = await fetch("/api/booking-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingOpen, openRooms, closures }),
    });
    if (response.ok) setData({ ...data, bookingOpen, openRooms, closures });
  };

  const toggleBookings = async () => {
    if (!data) return;
    await saveBookingSettings(!data.bookingOpen, data.openRooms);
  };

  const toggleRoom = async (roomNumber: number) => {
    if (!data) return;
    const openRooms = data.openRooms.includes(roomNumber)
      ? data.openRooms.filter((room) => room !== roomNumber)
      : [...data.openRooms, roomNumber].sort((a, b) => a - b);
    await saveBookingSettings(data.bookingOpen, openRooms);
  };

  const addClosure = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!data || !closureForm.checkIn || !closureForm.checkOut || closureForm.checkIn >= closureForm.checkOut) return;
    const closure = { id: `C-${Date.now().toString(36)}`, ...closureForm };
    await saveBookingSettings(data.bookingOpen, data.openRooms, [...data.closures, closure]);
    setClosureForm({ roomNumber: 1, checkIn: "", checkOut: "", note: "" });
  };

  const removeClosure = async (id: string) => {
    if (!data) return;
    await saveBookingSettings(data.bookingOpen, data.openRooms, data.closures.filter((closure) => closure.id !== id));
  };

  const cancelBooking = async (bookingId: string, refund: boolean) => {
    if (!data || !window.confirm(refund ? "ยืนยันยกเลิกและคืนเงิน booking นี้?" : "ยืนยันยกเลิก booking นี้?")) return;
    const response = await fetch("/api/admin/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, action: refund ? "refund" : "cancel" }),
    });
    const result = await response.json();
    if (response.ok) setData({ ...data, bookings: data.bookings.map((booking) => booking.id === bookingId ? result.booking : booking) });
    else setError(result.message || "ไม่สามารถยกเลิก booking ได้");
  };

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((response) => response.json())
      .then((result) => {
        if (result.authenticated) {
          setIsAuthenticated(true);
          fetchData();
        }
      })
      .catch(() => undefined);
  }, [fetchData]);

  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        fetchData();
      }, 60000); // Auto refresh every minute
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchData]);

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🏡</div>
            <h1 className="text-2xl font-bold text-white">A-Thip House</h1>
            <p className="text-green-200 mt-1">Admin Dashboard</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-green-200 text-sm mb-2">รหัสผ่าน</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="ใส่รหัสผ่าน..."
                autoFocus
              />
            </div>
            {error && (
              <div className="mb-4 text-red-300 text-sm text-center">{error}</div>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-lg transition-colors"
            >
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard
  const maxDateVisits = data
    ? Math.max(...Object.values(data.visitsByDate), 1)
    : 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="bg-black/30 border-b border-white/10 sticky top-0 z-10 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/rooms" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500">จัดการห้องพัก</Link>
            <span className="text-2xl">🏡</span>
            <div>
              <h1 className="font-bold text-lg">A-Thip House Analytics</h1>
              <p className="text-gray-400 text-xs">Private Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleBookings}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${data?.bookingOpen ? "bg-green-600 hover:bg-green-500" : "bg-red-600 hover:bg-red-500"}`}
            >
              {data?.bookingOpen ? "รับจองอยู่ · ปิดรับจอง" : "ปิดรับจองอยู่ · เปิดรับจอง"}
            </button>
            <span className="text-xs text-gray-400">
              อัปเดตล่าสุด: {new Date().toLocaleTimeString("th-TH")}
            </span>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "⏳ กำลังโหลด..." : "🔄 รีเฟรช"}
            </button>
            <button
              onClick={() => {
                fetch("/api/admin/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) });
                setIsAuthenticated(false);
                setPassword("");
                setData(null);
              }}
              className="px-4 py-2 bg-red-600/50 hover:bg-red-600 rounded-lg text-sm transition-colors"
            >
              ออก
            </button>
          </div>
        </div>
      </div>

        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div><h2 className="font-semibold text-white">Room sales</h2><p className="mt-1 text-xs text-gray-400">เปิด/ปิดขายรายห้องได้เอง ห้องที่มี booking เดิมยังไม่ถูกยกเลิก</p></div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((room) => {
                const isOpen = data?.openRooms.includes(room);
                return <button key={room} onClick={() => toggleRoom(room)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${isOpen ? "bg-green-600 hover:bg-green-500" : "bg-gray-700 text-gray-400 hover:bg-gray-600"}`}>ห้อง {room}: {isOpen ? "เปิดขาย" : "ปิดขาย"}</button>;
              })}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-semibold text-white">ปิดขายตามช่วงวันที่</h2>
          <p className="mt-1 text-xs text-gray-400">เลือกห้องและวันที่ที่ต้องการปิดขาย เช่น ซ่อมแซมหรือกันไว้ใช้งานเอง</p>
          <form onSubmit={addClosure} className="mt-4 grid gap-3 md:grid-cols-[120px_1fr_1fr_1fr_auto] md:items-end">
            <label className="text-xs text-gray-300">ห้อง<select value={closureForm.roomNumber} onChange={(event) => setClosureForm({ ...closureForm, roomNumber: Number(event.target.value) })} className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 text-sm text-white"><option value={1}>ห้อง 1</option><option value={2}>ห้อง 2</option><option value={3}>ห้อง 3</option><option value={4}>ห้อง 4</option><option value={5}>ห้อง 5</option></select></label>
            <label className="text-xs text-gray-300">เริ่มปิด<input required type="date" value={closureForm.checkIn} onChange={(event) => setClosureForm({ ...closureForm, checkIn: event.target.value })} className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 text-sm text-white" /></label>
            <label className="text-xs text-gray-300">เปิดกลับ<input required type="date" min={closureForm.checkIn} value={closureForm.checkOut} onChange={(event) => setClosureForm({ ...closureForm, checkOut: event.target.value })} className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 text-sm text-white" /></label>
            <label className="text-xs text-gray-300">หมายเหตุ<input value={closureForm.note} placeholder="เช่น ปรับปรุงห้อง" onChange={(event) => setClosureForm({ ...closureForm, note: event.target.value })} className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 text-sm text-white" /></label>
            <button className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500">เพิ่ม</button>
          </form>
          <div className="mt-4 space-y-2">{data?.closures.map((closure) => <div key={closure.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-black/20 px-3 py-2 text-sm"><span className="text-gray-200">ห้อง {closure.roomNumber} · {closure.checkIn} ถึง {closure.checkOut}{closure.note ? ` · ${closure.note}` : ""}</span><button onClick={() => removeClosure(closure.id)} className="text-xs font-semibold text-red-300 hover:text-red-200">ยกเลิกการปิดขาย</button></div>)}{data?.closures.length === 0 && <p className="text-xs text-gray-500">ยังไม่มีช่วงวันที่ปิดขาย</p>}</div>
        </div>

        <BookingTable bookings={data?.bookings || []} onCancel={cancelBooking} />

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            icon="👥"
            label="ผู้เข้าชมวันนี้"
            value={data?.todayVisits ?? 0}
            color="green"
          />
          <StatCard
            icon="🌐"
            label="ผู้เข้าชมทั้งหมด"
            value={data?.totalVisits ?? 0}
            color="blue"
          />
          <StatCard
            icon="🎯"
            label="IP ไม่ซ้ำวันนี้"
            value={data?.todayUniqueVisitors ?? 0}
            color="purple"
          />
          <StatCard
            icon="📊"
            label="IP ไม่ซ้ำทั้งหมด"
            value={data?.uniqueVisitors ?? 0}
            color="indigo"
          />
          <StatCard
            icon="⏱️"
            label="เฉลี่ย (นาที) วันนี้"
            value={data?.todayAvgDuration ?? 0}
            color="amber"
          />
          <StatCard
            icon="⏳"
            label="เฉลี่ย (นาที) ทั้งหมด"
            value={data?.avgDuration ?? 0}
            color="rose"
          />
        </div>

        {/* Device Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-sm text-gray-400 mb-4">📱 อุปกรณ์ที่ใช้</h3>
            {data && (
              <div className="space-y-3">
                <DeviceBar
                  label="💻 Desktop"
                  count={data.deviceCount.desktop}
                  total={data.totalVisits || 1}
                />
                <DeviceBar
                  label="📱 Mobile"
                  count={data.deviceCount.mobile}
                  total={data.totalVisits || 1}
                />
                <DeviceBar
                  label="📱 Tablet"
                  count={data.deviceCount.tablet}
                  total={data.totalVisits || 1}
                />
              </div>
            )}
          </div>

          {/* Top Referrers */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-sm text-gray-400 mb-4">🔗 แหล่งที่มา (Top 5)</h3>
            <div className="space-y-2">
              {data?.topReferrers.slice(0, 5).map((ref, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300 truncate mr-2">
                    {ref.referrer.length > 30
                      ? ref.referrer.substring(0, 30) + "..."
                      : ref.referrer}
                  </span>
                  <span className="text-green-400 font-mono font-bold">{ref.count}</span>
                </div>
              ))}
              {(!data || data.topReferrers.length === 0) && (
                <p className="text-gray-500 text-sm">ยังไม่มีข้อมูล</p>
              )}
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-sm text-gray-400 mb-4">📄 หน้ายอดนิยม</h3>
            <div className="space-y-2">
              {data?.topPages.map((pg, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">{pg.page}</span>
                  <span className="text-blue-400 font-mono font-bold">{pg.count}</span>
                </div>
              ))}
              {(!data || data.topPages.length === 0) && (
                <p className="text-gray-500 text-sm">ยังไม่มีข้อมูล</p>
              )}
            </div>
          </div>
        </div>

        {/* Visits by Date Chart */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-sm text-gray-400 mb-4">📊 จำนวนผู้เข้าชมต่อวัน</h3>
          <div className="flex items-end gap-1 h-48 overflow-x-auto pb-2">
            {data &&
              Object.entries(data.visitsByDate)
                .slice(-30)
                .map(([date, count], i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center flex-shrink-0"
                    style={{ minWidth: "40px" }}
                  >
                    <span className="text-xs text-gray-400 mb-1">{count}</span>
                    <div
                      className="w-8 bg-gradient-to-t from-green-600 to-green-400 rounded-t-sm transition-all hover:from-green-500 hover:to-green-300"
                      style={{
                        height: `${Math.max((count / maxDateVisits) * 140, 4)}px`,
                      }}
                    ></div>
                    <span className="text-[10px] text-gray-500 mt-1 transform -rotate-45 origin-top-left">
                      {date.length > 8 ? date.substring(0, 8) : date}
                    </span>
                  </div>
                ))}
            {(!data || Object.keys(data.visitsByDate).length === 0) && (
              <p className="text-gray-500 text-sm w-full text-center py-8">
                ยังไม่มีข้อมูล
              </p>
            )}
          </div>
        </div>

        {/* Recent Visitors Table */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-sm text-gray-400">🕐 ผู้เข้าชมล่าสุด (100 คนล่าสุด)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-white/10">
                  <th className="px-4 py-3 text-left font-medium">วันที่</th>
                  <th className="px-4 py-3 text-left font-medium">เวลา</th>
                  <th className="px-4 py-3 text-left font-medium">อุปกรณ์</th>
                  <th className="px-4 py-3 text-left font-medium">หน้า</th>
                  <th className="px-4 py-3 text-left font-medium">แหล่งที่มา</th>
                  <th className="px-4 py-3 text-left font-medium">IP</th>
                  <th className="px-4 py-3 text-right font-medium">นาทีที่อยู่</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentVisitors.map((v, i) => (
                  <tr
                    key={v.id + i}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-300">{v.date}</td>
                    <td className="px-4 py-3 text-gray-300">{v.time}</td>
                    <td className="px-4 py-3">{v.device}</td>
                    <td className="px-4 py-3 text-gray-300">{v.page}</td>
                    <td className="px-4 py-3 text-gray-400 max-w-[200px] truncate">
                      {v.referrer === "direct"
                        ? "Direct"
                        : v.referrer.length > 25
                        ? v.referrer.substring(0, 25) + "..."
                        : v.referrer}
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{v.ip}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-mono font-bold ${
                          v.durationMinutes >= 5
                            ? "text-green-400"
                            : v.durationMinutes >= 1
                            ? "text-yellow-400"
                            : "text-gray-500"
                        }`}
                      >
                        {v.durationMinutes > 0 ? `${v.durationMinutes}` : "..."}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!data || data.recentVisitors.length === 0) && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      ยังไม่มีข้อมูลผู้เข้าชม
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legacy booking table moved above */}
        <div className="hidden bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-300">Bookings</h3>
              <p className="text-xs text-gray-500 mt-1">Latest 100 reservations</p>
            </div>
            <span className="text-xs text-gray-500">5 rooms</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-white/10">
                  <th className="px-4 py-3 text-left font-medium">Guest</th>
                  <th className="px-4 py-3 text-left font-medium">Stay</th>
                  <th className="px-4 py-3 text-left font-medium">Room</th>
                  <th className="px-4 py-3 text-left font-medium">Contact</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3"><div className="text-gray-200">{booking.guestName}</div><div className="text-[11px] text-gray-500 font-mono">{booking.id}</div></td>
                    <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{booking.checkIn} → {booking.checkOut}<div className="text-xs text-gray-500">{booking.nights} night{booking.nights === 1 ? "" : "s"}</div></td>
                    <td className="px-4 py-3 text-gray-300">#{booking.roomNumber || "—"}</td>
                    <td className="px-4 py-3 text-gray-400">{booking.phone || booking.email || "—"}</td>
                    <td className="px-4 py-3 text-right text-gray-200">฿{booking.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className={`rounded-full px-2 py-1 text-xs ${booking.paymentStatus === "paid" ? "bg-green-500/20 text-green-300" : booking.paymentStatus === "refunded" ? "bg-blue-500/20 text-blue-300" : booking.bookingStatus === "cancelled" ? "bg-red-500/20 text-red-300" : "bg-amber-500/20 text-amber-300"}`}>{booking.paymentStatus === "paid" ? "Paid" : booking.paymentStatus === "refunded" ? "Refunded" : booking.bookingStatus === "cancelled" ? "Cancelled" : "Pending"}</span></td>
                    <td className="px-4 py-3 text-right">{booking.bookingStatus !== "cancelled" && <button onClick={() => cancelBooking(booking.id, booking.paymentStatus === "paid")} className="text-xs font-semibold text-red-300 hover:text-red-200">{booking.paymentStatus === "paid" ? "Cancel & refund" : "Cancel"}</button>}</td>
                  </tr>
                ))}
                {(!data || data.bookings.length === 0) && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No bookings yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 text-xs py-4">
          🔒 Private Dashboard — A-Thip House @ Pai
        </div>
      </div>
    </div>
  );
}

function BookingTable({ bookings: allBookings, onCancel }: { bookings: AnalyticsData["bookings"]; onCancel: (bookingId: string, refund: boolean) => void }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(allBookings.length / pageSize));
  const page = Math.min(currentPage, totalPages);
  const roomCount = (booking: AnalyticsData["bookings"][number]) => booking.rooms || booking.roomNumbers?.length || 1;
  const bookings = allBookings.slice((page - 1) * pageSize, page * pageSize).map((booking) => ({ ...booking, nights: (roomCount(booking) + " rooms · " + booking.nights) as unknown as number }));
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div><h3 className="text-sm text-gray-300">Bookings</h3><p className="text-xs text-gray-500 mt-1">Latest 100 reservations</p></div>
        <div className="flex items-center gap-2"><span className="text-xs text-gray-500">5 rooms</span><button type="button" disabled={page === 1} onClick={() => setCurrentPage((value) => Math.max(1, value - 1))} className="rounded border border-white/10 px-2 py-1 text-xs disabled:opacity-40">Previous</button><span className="text-xs text-gray-400">{page} / {totalPages}</span><button type="button" disabled={page === totalPages} onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))} className="rounded border border-white/10 px-2 py-1 text-xs disabled:opacity-40">Next</button></div>
      </div>
      <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-gray-400 border-b border-white/10"><th className="px-4 py-3 text-left font-medium">Guest</th><th className="px-4 py-3 text-left font-medium">Stay</th><th className="px-4 py-3 text-left font-medium">Room</th><th className="px-4 py-3 text-left font-medium">Contact</th><th className="px-4 py-3 text-right font-medium">Amount</th><th className="px-4 py-3 text-left font-medium">Status</th><th className="px-4 py-3 text-right font-medium">Action</th></tr></thead><tbody>
        {bookings.map((booking) => <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5"><td className="px-4 py-3"><div className="text-gray-200">{booking.guestName}</div><div className="text-[11px] text-gray-500 font-mono">{booking.id}</div></td><td className="px-4 py-3 text-gray-300 whitespace-nowrap">{booking.checkIn} → {booking.checkOut}<div className="text-xs text-gray-500">{booking.nights} night{booking.nights === 1 ? "" : "s"}</div></td><td className="px-4 py-3 text-gray-300">#{booking.roomNumber || "—"}</td><td className="px-4 py-3 text-gray-400">{booking.phone || booking.email || "—"}</td><td className="px-4 py-3 text-right text-gray-200">฿{booking.amount.toLocaleString()}</td><td className="px-4 py-3 whitespace-nowrap"><span className={`rounded-full px-2 py-1 text-xs ${booking.paymentStatus === "paid" ? "bg-green-500/20 text-green-300" : booking.paymentStatus === "refunded" ? "bg-blue-500/20 text-blue-300" : booking.bookingStatus === "cancelled" ? "bg-red-500/20 text-red-300" : "bg-amber-500/20 text-amber-300"}`}>{booking.paymentStatus === "paid" ? "Paid" : booking.paymentStatus === "refunded" ? "Refunded" : booking.bookingStatus === "cancelled" ? "Cancelled" : "Pending"}</span></td><td className="px-4 py-3 text-right">{booking.bookingStatus !== "cancelled" && <button onClick={() => onCancel(booking.id, booking.paymentStatus === "paid")} className="text-xs font-semibold text-red-300 hover:text-red-200">{booking.paymentStatus === "paid" ? "Cancel & refund" : "Cancel"}</button>}</td></tr>)}
        {bookings.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No bookings yet</td></tr>}
      </tbody></table></div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    green: "from-green-600/20 to-green-800/10 border-green-500/20",
    blue: "from-blue-600/20 to-blue-800/10 border-blue-500/20",
    purple: "from-purple-600/20 to-purple-800/10 border-purple-500/20",
    indigo: "from-indigo-600/20 to-indigo-800/10 border-indigo-500/20",
    amber: "from-amber-600/20 to-amber-800/10 border-amber-500/20",
    rose: "from-rose-600/20 to-rose-800/10 border-rose-500/20",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-4 border backdrop-blur-sm`}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
}

function DeviceBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-300">{label}</span>
        <span className="text-gray-400">
          {count} ({pct}%)
        </span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        ></div>
      </div>
    </div>
  );
}
