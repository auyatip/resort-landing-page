"use client";

import { useState, type ReactNode } from "react";

type Props = { children: ReactNode; className?: string };

export default function BookingGateButton({ children, className = "" }: Props) {
  const [closed, setClosed] = useState(false);
  const [checking, setChecking] = useState(false);

  async function handleClick() {
    setChecking(true);
    try {
      const response = await fetch("/api/bookings");
      const data = await response.json();
      if (data.bookingOpen === false) setClosed(true);
      else window.location.href = "/booking";
    } catch {
      window.location.href = "/booking";
    } finally {
      setChecking(false);
    }
  }

  return (
    <>
      <button type="button" onClick={handleClick} disabled={checking} className={className}>
        {children}
      </button>
      {closed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="booking-closed-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
            <h2 id="booking-closed-title" className="font-serif text-2xl font-bold text-primary">ระบบจองยังไม่เปิดใช้งาน</h2>
            <p className="mt-3 text-gray-600">ขณะนี้ยังไม่เปิดรับจองออนไลน์ หากต้องการจองห้องพัก กรุณาติดต่อผ่านแชทส่วนตัว</p>
            <button type="button" onClick={() => setClosed(false)} className="mt-6 rounded-xl bg-primary px-6 py-3 font-semibold text-white">ปิด</button>
          </div>
        </div>
      )}
    </>
  );
}
