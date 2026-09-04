"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getStayPricingWithRates, NIGHTLY_RATES_THB, ROOM_COUNT } from "../lib/booking";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "../components/LanguageToggle";

type Form = { guestName: string; phone: string; checkIn: string; checkOut: string; rooms: string };
const labels = {
  en: { back: "Back to A-Thip House", title: "Book your stay", intro: "Choose your dates, number of rooms, and enter your name.", checkIn: "Check-in", checkOut: "Check-out", roomCount: "Number of rooms", name: "Guest name", phone: "Phone / WhatsApp", optional: "optional", choose: "Choose dates to see availability", checking: "Checking availability...", available: "rooms available", full: "These dates are full", details: "Your details", total: "Total", night: "night", nights: "nights", view: "View nightly prices", prices: "Nightly prices", close: "Close", pay: "Continue to payment", loading: "Preparing your booking...", error: "Unable to create your booking." },
  th: { back: "\u0e01\u0e25\u0e31\u0e1a\u0e2b\u0e19\u0e49\u0e32 A-Thip House", title: "\u0e08\u0e2d\u0e07\u0e2b\u0e49\u0e2d\u0e07\u0e1e\u0e31\u0e01", intro: "\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e27\u0e31\u0e19\u0e40\u0e02\u0e49\u0e32\u0e1e\u0e31\u0e01 \u0e08\u0e33\u0e19\u0e27\u0e19\u0e2b\u0e49\u0e2d\u0e07 \u0e41\u0e25\u0e30\u0e01\u0e23\u0e2d\u0e01\u0e0a\u0e37\u0e48\u0e2d", checkIn: "\u0e40\u0e0a\u0e47\u0e01\u0e2d\u0e34\u0e19", checkOut: "\u0e40\u0e0a\u0e47\u0e01\u0e40\u0e2d\u0e32\u0e15\u0e4c", roomCount: "\u0e08\u0e33\u0e19\u0e27\u0e19\u0e2b\u0e49\u0e2d\u0e07", name: "\u0e0a\u0e37\u0e48\u0e2d\u0e1c\u0e39\u0e49\u0e40\u0e02\u0e49\u0e32\u0e1e\u0e31\u0e01", phone: "\u0e40\u0e1a\u0e2d\u0e23\u0e4c\u0e42\u0e17\u0e23 / WhatsApp", optional: "\u0e44\u0e21\u0e48\u0e1a\u0e31\u0e07\u0e04\u0e31\u0e1a", choose: "\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e27\u0e31\u0e19\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e14\u0e39\u0e2b\u0e49\u0e2d\u0e07\u0e27\u0e48\u0e32\u0e07", checking: "\u0e01\u0e33\u0e25\u0e31\u0e07\u0e40\u0e0a\u0e47\u0e01\u0e2b\u0e49\u0e2d\u0e07\u0e27\u0e48\u0e32\u0e07...", available: "\u0e2b\u0e49\u0e2d\u0e07\u0e27\u0e48\u0e32\u0e07", full: "\u0e0a\u0e48\u0e27\u0e07\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e40\u0e15\u0e47\u0e21\u0e41\u0e25\u0e49\u0e27", details: "\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e1c\u0e39\u0e49\u0e40\u0e02\u0e49\u0e32\u0e1e\u0e31\u0e01", total: "\u0e22\u0e2d\u0e14\u0e23\u0e27\u0e21", night: "\u0e04\u0e37\u0e19", nights: "\u0e04\u0e37\u0e19", view: "\u0e14\u0e39\u0e23\u0e32\u0e04\u0e32\u0e17\u0e38\u0e01\u0e04\u0e37\u0e19", prices: "\u0e23\u0e32\u0e04\u0e32\u0e02\u0e2d\u0e07\u0e41\u0e15\u0e48\u0e25\u0e30\u0e04\u0e37\u0e19", close: "\u0e1b\u0e34\u0e14", pay: "\u0e44\u0e1b\u0e0a\u0e33\u0e23\u0e30\u0e40\u0e07\u0e34\u0e19", loading: "\u0e01\u0e33\u0e25\u0e31\u0e07\u0e40\u0e15\u0e23\u0e35\u0e22\u0e21\u0e01\u0e32\u0e23\u0e08\u0e2d\u0e07...", error: "\u0e44\u0e21\u0e48\u0e2a\u0e32\u0e21\u0e32\u0e23\u0e16\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e08\u0e2d\u0e07\u0e44\u0e14\u0e49" },
} as const;

function formatDate(value: string, lang: "en" | "th") {
  return new Intl.DateTimeFormat(lang === "th" ? "th-TH" : "en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value + "T12:00:00"));
}

export default function BookingPage() {
  const { lang } = useLanguage();
  const t = { ...labels[lang], optional: lang === "th" ? "ไม่บังคับ" : "optional" };
  const [form, setForm] = useState<Form>({ guestName: "", phone: "", checkIn: "", checkOut: "", rooms: "1" });
  const [availableRooms, setAvailableRooms] = useState<number | null>(null);
  const [bookingOpen, setBookingOpen] = useState(true);
  const [checking, setChecking] = useState(false);
  const [priceDialog, setPriceDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pricingConfig, setPricingConfig] = useState(NIGHTLY_RATES_THB);
  const today = new Date().toISOString().slice(0, 10);
  const pricing = useMemo(() => getStayPricingWithRates(form.checkIn, form.checkOut, pricingConfig), [form.checkIn, form.checkOut, pricingConfig]);
  const roomCount = Math.max(1, Number(form.rooms) || 1);
  const rows = pricing.rates.map((rate, index) => ({ rate, date: new Date(new Date(form.checkIn + "T00:00:00Z").getTime() + index * 86400000).toISOString().slice(0, 10) }));

  useEffect(() => {
    fetch("/api/pricing").then((response) => response.json()).then((data) => { if (data.pricing) setPricingConfig(data.pricing); }).catch(() => undefined);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/bookings")
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled && data.bookingOpen === false) window.location.replace("/");
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (pricing.nights < 1) { setAvailableRooms(null); return; }
    let cancelled = false;
    setChecking(true);
    fetch("/api/bookings?checkIn=" + form.checkIn + "&checkOut=" + form.checkOut).then((response) => response.json()).then((data) => { if (!cancelled) { if (data.bookingOpen === false) { window.location.replace("/"); return; } setAvailableRooms(data.availableRooms ?? 0); setBookingOpen(true); } }).catch(() => { if (!cancelled) setAvailableRooms(null); }).finally(() => { if (!cancelled) setChecking(false); });
    return () => { cancelled = true; };
  }, [form.checkIn, form.checkOut, pricing.nights]);

  function update(field: keyof Form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage("");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!bookingOpen) { setMessage(lang === "th" ? "\u0e02\u0e13\u0e30\u0e19\u0e35\u0e49\u0e1b\u0e34\u0e14\u0e23\u0e31\u0e1a\u0e08\u0e2d\u0e07\u0e0a\u0e31\u0e48\u0e27\u0e04\u0e23\u0e32\u0e27" : "Bookings are temporarily closed."); return; }
    if (availableRooms === null || roomCount > availableRooms) { setMessage(t.full); return; }
    setLoading(true);
    try {
      const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || t.error);
      if (data.checkoutUrl) { window.location.href = data.checkoutUrl; return; }
      setMessage(data.booking.id);
    } catch (error) { setMessage(error instanceof Error ? error.message : t.error); } finally { setLoading(false); }
  }

  const canSubmit = Boolean(bookingOpen && form.guestName && form.checkIn && form.checkOut && pricing.nights > 0 && availableRooms !== null && roomCount <= (availableRooms || 0) && !checking && !loading);
  return <main className="min-h-screen bg-light px-4 py-6 md:py-12"><LanguageToggle /><div className="mx-auto max-w-3xl"><Link href="/" className="text-sm font-semibold text-primary hover:underline">← {t.back}</Link><form onSubmit={submit} className="mt-5 rounded-3xl bg-white p-6 shadow-xl md:p-10"><p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">A-Thip House @ Pai</p><h1 className="mt-3 font-serif text-4xl font-bold text-primary">{t.title}</h1><p className="mt-3 text-gray-600">{t.intro}</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><label>{t.checkIn}<input required type="date" min={today} value={form.checkIn} onChange={(event) => update("checkIn", event.target.value)} /></label><label>{t.checkOut}<input required type="date" min={form.checkIn || today} value={form.checkOut} onChange={(event) => update("checkOut", event.target.value)} /></label></div><div className="mt-4"><label>{t.roomCount}<select value={form.rooms} onChange={(event) => update("rooms", event.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-3">{Array.from({ length: availableRooms || 0 }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count}</option>)}</select></label></div><div className="mt-4 min-h-10 rounded-xl bg-gray-50 px-4 py-3 text-sm">{checking ? <span className="text-gray-500">{t.checking}</span> : availableRooms === null ? <span className="text-gray-500">{t.choose}</span> : availableRooms === 0 ? <span className="font-semibold text-red-700">{t.full}</span> : <span className="font-semibold text-green-700">● {availableRooms} {t.available}</span>}</div><div className="mt-8 border-t border-gray-100 pt-7"><p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Step 2</p><h2 className="mt-2 font-serif text-2xl font-bold text-primary">{t.details}</h2></div><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2">{t.name}<input required autoComplete="name" value={form.guestName} onChange={(event) => update("guestName", event.target.value)} /></label><label className="sm:col-span-2">{t.phone} <span className="font-normal text-gray-400">({t.optional})</span><input type="tel" autoComplete="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} /></label></div><div className="mt-7 rounded-2xl bg-accent/30 p-5"><div className="flex justify-between text-sm text-gray-600"><span>{roomCount} {t.roomCount} × {pricing.nights || 0} {pricing.nights === 1 ? t.night : t.nights}</span><span>THB</span></div>{pricing.nights > 0 && pricing.nights <= 7 && <div className="mt-3 space-y-1 border-t border-primary/10 pt-3 text-sm text-gray-700">{rows.map((row, index) => <div key={row.date} className="flex justify-between"><span>{index + 1}. {formatDate(row.date, lang)} × {roomCount}</span><span>฿{(row.rate * roomCount).toLocaleString()}</span></div>)}</div>}{pricing.nights > 7 && <button type="button" onClick={() => setPriceDialog(true)} className="mt-3 w-full rounded-xl border border-primary/20 px-4 py-2 text-sm font-semibold text-primary hover:bg-white">{t.view}</button>}<div className="mt-4 flex items-end justify-between border-t border-primary/10 pt-3"><span className="font-semibold text-primary">{t.total}</span><strong className="font-serif text-3xl text-primary">฿{(pricing.total * roomCount).toLocaleString()}</strong></div></div>{message && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{message}</p>}<button disabled={!canSubmit} className="mt-5 w-full rounded-xl bg-primary px-6 py-4 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{loading ? t.loading : t.pay}</button></form></div>{priceDialog && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true"><div className="max-h-[85vh] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-gray-100 p-5"><h2 className="font-serif text-xl font-bold text-primary">{t.prices}</h2><button type="button" onClick={() => setPriceDialog(false)} className="rounded-full px-3 py-1 text-xl text-gray-500 hover:bg-gray-100" aria-label={t.close}>×</button></div><div className="max-h-[60vh] space-y-2 overflow-y-auto p-5">{rows.map((row, index) => <div key={row.date} className="flex justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"><span>{index + 1}. {formatDate(row.date, lang)} × {roomCount}</span><span className="font-semibold text-primary">฿{(row.rate * roomCount).toLocaleString()}</span></div>)}</div><div className="border-t border-gray-100 p-5"><div className="flex justify-between font-bold text-primary"><span>{t.total}</span><span>฿{(pricing.total * roomCount).toLocaleString()}</span></div></div></div></div>}</main>;
}
