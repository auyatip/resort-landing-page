"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Booking = { id: string; roomNumber?: number; roomNumbers?: number[]; rooms?: number; guestName: string; checkIn: string; checkOut: string; bookingStatus: string; paymentStatus: string; holdUntil?: string };
type Closure = { id: string; roomNumber: number; checkIn: string; checkOut: string; note?: string };
type RoomData = { bookingOpen: boolean; openRooms: number[]; closures: Closure[]; bookings: Booking[] };

const ROOMS = [1, 2, 3, 4, 5];
const pad = (n: number) => String(n).padStart(2, "0");
const dateKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const nextDay = (key: string) => { const date = new Date(`${key}T00:00:00`); date.setDate(date.getDate() + 1); return dateKey(date); };

export default function RoomManagementPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [data, setData] = useState<RoomData | null>(null);
  const [month, setMonth] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ roomNumber: 1, checkIn: "", checkOut: "", note: "" });

  const load = async (withLogin = !authenticated) => {
    if (withLogin) {
      const login = await fetch("/api/admin/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      if (!login.ok) throw new Error("รหัสผ่านไม่ถูกต้อง");
    }
    const response = await fetch("/api/analytics");
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error("รหัสผ่านไม่ถูกต้อง");
    setData(result.data); setAuthenticated(true); setError("");
  };
  useEffect(() => {
    fetch("/api/admin/auth")
      .then((response) => response.json())
      .then((result) => { if (result.authenticated) { setAuthenticated(true); load(false).catch(() => setError("โหลดข้อมูลไม่สำเร็จ")); } })
      .finally(() => setCheckingSession(false))
      .catch(() => undefined);
  }, []);
  useEffect(() => { if (authenticated) load().catch(() => setError("โหลดข้อมูลไม่สำเร็จ")); }, [month]);

  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const start = new Date(first); start.setDate(first.getDate() - first.getDay()); start.setHours(12, 0, 0, 0);
    return Array.from({ length: 42 }, (_, i) => { const date = new Date(start); date.setDate(start.getDate() + i); return date; });
  }, [month]);

  const activeBooking = (booking: Booking) => booking.bookingStatus !== "cancelled" && (booking.paymentStatus === "paid" || (booking.holdUntil ? new Date(booking.holdUntil) > new Date() : false));
  const bookingsOn = (date: string) => data?.bookings.filter((booking) => activeBooking(booking) && booking.checkIn <= date && booking.checkOut > date && (!selectedRoom || (booking.roomNumbers || [booking.roomNumber]).includes(selectedRoom))) || [];
  const closedOn = (date: string, room: number) => Boolean(data?.closures.some((closure) => closure.roomNumber === room && closure.checkIn <= date && closure.checkOut > date));
  const openRoomsOn = (date: string) => ROOMS.filter((room) => data?.openRooms.includes(room) && !closedOn(date, room));

  const save = async (next: RoomData) => {
    const response = await fetch("/api/booking-settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bookingOpen: next.bookingOpen, openRooms: next.openRooms, closures: next.closures }) });
    if (!response.ok) throw new Error("บันทึกไม่สำเร็จ");
    setData(next);
  };
  const selectDate = (key: string) => { setSelectedDate(key); setForm({ roomNumber: selectedRoom || 1, checkIn: key, checkOut: nextDay(key), note: "" }); };
  const toggleDayRoom = async (room: number, open: boolean) => {
    if (!data || !selectedDate) return;
    const end = nextDay(selectedDate);
    const closures = open ? data.closures.filter((closure) => !(closure.roomNumber === room && closure.checkIn === selectedDate && closure.checkOut === end)) : [...data.closures, { id: `C-${Date.now().toString(36)}-${room}`, roomNumber: room, checkIn: selectedDate, checkOut: end, note: "ปิดขายจากปฏิทิน" }];
    try { await save({ ...data, closures }); } catch (e) { setError(e instanceof Error ? e.message : "บันทึกไม่สำเร็จ"); }
  };
  const setRoomCount = async (count: number) => { for (const room of ROOMS) await toggleDayRoom(room, room <= count); };
  const addClosure = async (event: React.FormEvent) => { event.preventDefault(); if (!data || !form.checkIn || !form.checkOut || form.checkIn >= form.checkOut) return; try { await save({ ...data, closures: [...data.closures, { id: `C-${Date.now().toString(36)}`, ...form }] }); setForm({ ...form, checkIn: "", checkOut: "", note: "" }); } catch (e) { setError(e instanceof Error ? e.message : "บันทึกไม่สำเร็จ"); } };
  const removeClosure = async (id: string) => { if (!data) return; try { await save({ ...data, closures: data.closures.filter((closure) => closure.id !== id) }); } catch (e) { setError(e instanceof Error ? e.message : "บันทึกไม่สำเร็จ"); } };

  if (checkingSession) return <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">กำลังตรวจสอบสิทธิ์…</main>;
  if (!authenticated) return <main className="flex min-h-screen items-center justify-center bg-gray-950 px-4"><form onSubmit={(event) => { event.preventDefault(); load().catch((e) => setError(e.message)); }} className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8"><h1 className="font-serif text-3xl font-bold text-white">จัดการห้องพัก</h1><p className="mt-2 text-sm text-gray-400">เข้าสู่ระบบด้วยรหัส Admin</p><input autoFocus type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Admin password" className="mt-6 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white" />{error && <p className="mt-3 text-sm text-red-300">{error}</p>}<button className="mt-5 w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white">เข้าสู่ระบบ</button><Link href="/admin" className="mt-4 block text-center text-sm text-gray-400">กลับ Dashboard</Link></form></main>;

  return <main className="admin-room-page min-h-screen bg-gray-950 px-4 py-6 text-white md:px-8"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-center justify-between gap-4"><div><Link href="/admin" className="text-sm text-gray-400">← Dashboard</Link><h1 className="mt-2 font-serif text-4xl font-bold">Room calendar</h1><p className="mt-1 text-sm text-gray-400">ดู booking และปรับจำนวนห้องที่เปิดขายรายวัน</p></div><div className="flex gap-2"><button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="rounded-lg bg-white/10 px-4 py-2">←</button><button onClick={() => setMonth(new Date())} className="rounded-lg bg-white/10 px-4 py-2 text-sm">วันนี้</button><button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="rounded-lg bg-white/10 px-4 py-2">→</button></div></div>
    <div className="mt-6 flex flex-wrap gap-2"><button onClick={() => setSelectedRoom(0)} className={`rounded-full px-3 py-1 text-xs font-semibold ${selectedRoom === 0 ? "bg-accent text-primary" : "bg-white/10 text-gray-300"}`}>ทุกห้อง</button>{ROOMS.map((room) => <button key={room} onClick={() => { setSelectedRoom(room); setForm({ ...form, roomNumber: room }); }} className={`rounded-full px-3 py-1 text-xs font-semibold ${selectedRoom === room ? "bg-accent text-primary" : "bg-white/10 text-gray-300"}`}>ห้อง {room}</button>)}</div>
    <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_340px]"><section className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6"><h2 className="mb-4 font-serif text-2xl font-bold">{month.toLocaleDateString("th-TH", { month: "long", year: "numeric" })}</h2><div className="grid grid-cols-7 border-l border-t border-white/10">{["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((day) => <div key={day} className="border-b border-r border-white/10 p-2 text-center text-xs text-gray-500">{day}</div>)}{days.map((date) => { const key = date.toISOString().slice(0, 10); const booked = bookingsOn(key); const open = openRoomsOn(key); const isCurrentMonth = date.getMonth() === month.getMonth(); return <button type="button" key={key} onClick={() => selectDate(key)} className={`min-h-28 border-b border-r border-white/10 p-2 text-left hover:bg-white/10 ${isCurrentMonth ? "" : "bg-black/20 text-gray-600"} ${selectedDate === key ? "ring-2 ring-inset ring-accent" : ""}`}><span className="text-xs">{date.getDate()}</span><div className="mt-2 space-y-1"><div className="text-[10px] text-gray-400">{booked.length} จอง · {open.length} เปิด</div>{booked.slice(0, 2).map((booking) => <div key={booking.id} className="truncate rounded bg-green-500/20 px-1.5 py-1 text-[10px] text-green-300">ห้อง {booking.roomNumber} · {booking.guestName}</div>)}{booked.length > 2 && <div className="text-[10px] text-gray-500">+{booked.length - 2} รายการ</div>}{open.length < 5 && <div className="rounded bg-red-500/20 px-1.5 py-1 text-[10px] text-red-300">ปิด {5 - open.length} ห้อง</div>}</div></button>; })}</div><div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-400"><span>จองแล้ว = สีเขียว</span><span>ปิดขาย = สีแดง</span><span>คลิกวันเพื่อจัดการ</span></div></section>
      <aside className="space-y-6"><div className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="font-semibold">รายละเอียดวันที่</h2><p className="mt-1 text-sm text-accent">{selectedDate || "คลิกวันที่ในปฏิทิน"}</p>{selectedDate && <><div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-lg bg-green-500/10 p-3"><strong className="block text-lg text-green-300">{bookingsOn(selectedDate).length}</strong>จองแล้ว</div><div className="rounded-lg bg-accent/10 p-3"><strong className="block text-lg text-accent">{openRoomsOn(selectedDate).length}</strong>เปิดขาย</div><div className="rounded-lg bg-red-500/10 p-3"><strong className="block text-lg text-red-300">{5 - openRoomsOn(selectedDate).length}</strong>ปิดขาย</div></div><p className="mt-5 text-xs font-semibold text-gray-300">เปิดขายกี่ห้อง</p><div className="mt-2 flex gap-2">{ROOMS.map((count) => <button type="button" key={count} onClick={() => setRoomCount(count)} className="flex-1 rounded-lg bg-white/10 py-2 text-xs hover:bg-accent hover:text-primary">{count}</button>)}</div><div className="mt-4 space-y-2">{bookingsOn(selectedDate).map((booking) => <div key={booking.id} className="rounded-lg bg-black/20 p-3 text-xs"><div className="font-semibold">ห้อง {booking.roomNumber} · {booking.guestName}</div><div className="mt-1 text-gray-400">{booking.id} · {booking.checkIn} ถึง {booking.checkOut}</div></div>)}{bookingsOn(selectedDate).length === 0 && <p className="text-xs text-gray-500">ยังไม่มี booking ในวันนี้</p>}</div><p className="mt-5 text-xs font-semibold text-gray-300">เปิด/ปิดรายห้อง</p><div className="mt-2 grid grid-cols-2 gap-2">{ROOMS.map((room) => { const isOpen = openRoomsOn(selectedDate).includes(room); return <button type="button" key={room} onClick={() => toggleDayRoom(room, !isOpen)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${isOpen ? "bg-green-600/20 text-green-300" : "bg-red-600/20 text-red-300"}`}>ห้อง {room} · {isOpen ? "เปิด" : "ปิด"}</button>; })}</div></>}</div>
        <form onSubmit={addClosure} className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="font-semibold">ปิดขายช่วงวันที่</h2><p className="mt-1 text-xs text-gray-400">ใช้สำหรับปิดหลายวัน เช่น ซ่อมแซมหรือกันไว้ใช้เอง</p><label className="mt-4 block text-xs text-gray-300">ห้อง<select value={form.roomNumber} onChange={(event) => setForm({ ...form, roomNumber: Number(event.target.value) })} className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 text-white">{ROOMS.map((room) => <option key={room} value={room}>ห้อง {room}</option>)}</select></label><label className="mt-3 block text-xs text-gray-300">เริ่มปิด<input required type="date" value={form.checkIn} onChange={(event) => setForm({ ...form, checkIn: event.target.value })} className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 text-white" /></label><label className="mt-3 block text-xs text-gray-300">เปิดกลับ<input required type="date" min={form.checkIn} value={form.checkOut} onChange={(event) => setForm({ ...form, checkOut: event.target.value })} className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 text-white" /></label><label className="mt-3 block text-xs text-gray-300">หมายเหตุ<input value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} className="mt-1 w-full rounded-lg bg-gray-800 px-3 py-2 text-white" /></label>{error && <p className="mt-3 text-sm text-red-300">{error}</p>}<button className="mt-5 w-full rounded-lg bg-amber-600 px-4 py-3 font-semibold">บันทึกการปิดขาย</button></form><div className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="font-semibold">ช่วงที่ปิดขายอยู่</h2><div className="mt-4 space-y-2">{data?.closures.map((closure) => <div key={closure.id} className="rounded-lg bg-black/20 p-3 text-xs"><div>ห้อง {closure.roomNumber} · {closure.checkIn} ถึง {closure.checkOut}</div><div className="mt-1 flex justify-between text-gray-400"><span>{closure.note || "ปิดขายด้วยตนเอง"}</span><button onClick={() => removeClosure(closure.id)} className="text-red-300">ยกเลิก</button></div></div>)}{data?.closures.length === 0 && <p className="text-xs text-gray-500">ยังไม่มีช่วงปิดขาย</p>}</div></div></aside></div></div></main>;
}
