"use client";

import { useState, type ReactNode } from "react";

type Props = { children: ReactNode; className?: string };

export default function BookingGateButton({ children, className = "" }: Props) {
  const [closed, setClosed] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setClosed(true)} className={className}>
        {children}
      </button>
      {closed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="booking-closed-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
            <h2 id="booking-closed-title" className="font-serif text-2xl font-bold text-primary">ยังไม่เปิดบริการ</h2>
            <p className="mt-3 text-gray-600">ขณะนี้ยังไม่เปิดให้บริการจองห้องพักออนไลน์ กรุณาติดตามการเปิดบริการอีกครั้ง</p>
            <button type="button" onClick={() => setClosed(false)} className="mt-6 rounded-xl bg-primary px-6 py-3 font-semibold text-white">ปิด</button>
          </div>
        </div>
      )}
    </>
  );
}
