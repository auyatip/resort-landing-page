"use client";
import Link from "next/link";
export default function AdminNavigation({ active = "" }: { active?: string }) {
  const items = [["overview", "Overview", "/admin"], ["bookings", "Bookings", "/admin/bookings"], ["rooms", "Room management", "/admin/rooms"], ["pricing", "Pricing", "/admin/pricing"], ["analytics", "Analytics", "/admin/analytics"], ["visitors", "Visitors", "/admin/visitors"]];
  return <nav aria-label="Admin navigation" className="mb-6 flex gap-2 overflow-x-auto rounded-2xl border border-[#dfe7e1] bg-white/80 p-2 shadow-sm md:flex-col">{items.map(([key, label, href]) => <Link key={key} href={href} className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${active === key ? "bg-[#20352b] text-white" : "text-gray-600 hover:bg-[#f4f0e7] hover:text-[#20352b]"}`}>{label}</Link>)}</nav>;
}
