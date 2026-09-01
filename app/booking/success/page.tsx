"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

type Receipt = {
  id: string;
  guestName: string;
  roomNumber: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  amount: number;
};

const copy = {
  en: {
    loading: "Loading your booking...",
    confirmed: "Booking confirmed",
    confirmedText: "Your payment has been received and your stay is confirmed.",
    processing: "Payment received. We are syncing your booking details. Please contact the property with your Booking ID if you need help.",
    receipt: "Booking receipt",
    bookingId: "Booking ID",
    guest: "Guest",
    room: "Room",
    checkIn: "Check-in",
    checkOut: "Check-out",
    nights: "Nights",
    total: "Total paid",
    print: "Print / Save PDF",
    home: "Back to home",
    missing: "We could not find this booking.",
  },
  th: {
    loading: "กำลังโหลดข้อมูลการจอง...",
    confirmed: "ยืนยันการจองสำเร็จ",
    confirmedText: "ได้รับการชำระเงินแล้ว และยืนยันการเข้าพักของคุณเรียบร้อยแล้ว",
    processing: "ได้รับการชำระเงินแล้ว แต่ระบบกำลังซิงก์ข้อมูลการจอง กรุณาติดต่อที่พักพร้อม Booking ID ของคุณหากต้องการความช่วยเหลือ",
    receipt: "ใบยืนยันการจอง",
    bookingId: "รหัสการจอง",
    guest: "ผู้เข้าพัก",
    room: "ห้องพัก",
    checkIn: "เช็กอิน",
    checkOut: "เช็กเอาต์",
    nights: "จำนวนคืน",
    total: "ยอดชำระแล้ว",
    print: "พิมพ์ / บันทึกเป็น PDF",
    home: "กลับหน้าหลัก",
    missing: "ไม่พบข้อมูลการจองนี้",
  },
} as const;

function formatDate(value: string, lang: "en" | "th") {
  return new Intl.DateTimeFormat(lang === "th" ? "th-TH" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function BookingSuccessContent() {
  const params = useSearchParams();
  const { lang } = useLanguage();
  const t = copy[lang];
  const bookingId = params.get("booking");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const load = async () => {
      try {
        const response = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}`);
        const data = await response.json();
        if (cancelled) return;
        if (data.booking) setReceipt(data.booking);
        if (data.status === "confirmed" || attempts >= 4) {
          setConfirmed(data.status === "confirmed");
          setLoading(false);
          return;
        }
      } catch {
        if (!cancelled) setLoading(false);
        return;
      }
      attempts += 1;
      window.setTimeout(load, 1500);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  if (loading && !receipt) {
    return <main className="flex min-h-screen items-center justify-center bg-light px-6 text-primary">{t.loading}</main>;
  }

  return (
    <main className="min-h-screen bg-light px-4 py-10 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 print:hidden">
          <Link href="/" className="text-sm font-semibold text-primary hover:underline">← {t.home}</Link>
        </div>
        {!receipt ? (
          <section className="rounded-3xl bg-white p-8 text-center shadow-xl">
            <p className="text-red-700">{t.missing}</p>
          </section>
        ) : (
          <section className="overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="bg-primary px-7 py-8 text-white md:px-10">
              <p className="text-4xl">✓</p>
              <h1 className="mt-3 font-serif text-3xl font-bold">{confirmed ? t.confirmed : t.receipt}</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
                {confirmed ? t.confirmedText : t.processing}
              </p>
            </div>
            <div className="p-7 md:p-10">
              <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                <h2 className="font-serif text-2xl font-bold text-primary">{t.receipt}</h2>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">THB</span>
              </div>
              <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                <div><dt className="text-xs uppercase tracking-wider text-gray-500">{t.bookingId}</dt><dd className="mt-1 font-bold text-primary">{receipt.id}</dd></div>
                <div><dt className="text-xs uppercase tracking-wider text-gray-500">{t.guest}</dt><dd className="mt-1 font-semibold text-gray-800">{receipt.guestName}</dd></div>
                <div><dt className="text-xs uppercase tracking-wider text-gray-500">{t.room}</dt><dd className="mt-1 font-semibold text-gray-800">#{receipt.roomNumber}</dd></div>
                <div><dt className="text-xs uppercase tracking-wider text-gray-500">{t.nights}</dt><dd className="mt-1 font-semibold text-gray-800">{receipt.nights}</dd></div>
                <div><dt className="text-xs uppercase tracking-wider text-gray-500">{t.checkIn}</dt><dd className="mt-1 font-semibold text-gray-800">{formatDate(receipt.checkIn, lang)}</dd></div>
                <div><dt className="text-xs uppercase tracking-wider text-gray-500">{t.checkOut}</dt><dd className="mt-1 font-semibold text-gray-800">{formatDate(receipt.checkOut, lang)}</dd></div>
              </dl>
              <div className="mt-8 flex items-center justify-between rounded-2xl bg-accent/30 p-5">
                <span className="font-semibold text-primary">{t.total}</span>
                <strong className="font-serif text-3xl text-primary">฿{receipt.amount.toLocaleString()}</strong>
              </div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row print:hidden">
                <button onClick={() => window.print()} className="flex-1 rounded-xl bg-primary px-5 py-3 font-bold text-white hover:bg-primary/90">{t.print}</button>
                <Link href="/" className="flex-1 rounded-xl border border-primary px-5 py-3 text-center font-bold text-primary hover:bg-primary/5">{t.home}</Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default function BookingSuccessPage() {
  return <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-light px-6 text-primary">Loading your booking...</main>}><BookingSuccessContent /></Suspense>;
}
