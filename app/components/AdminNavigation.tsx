"use client";
import { useRouter } from "next/navigation";
export default function AdminNavigation({ active = "" }: { active?: string }) {
  const router = useRouter();
  const items = [["overview", "Overview", "/admin"], ["bookings", "Bookings", "/admin/booking"], ["rooms", "Room management", "/admin/rooms"], ["pricing", "Pricing", "/admin/pricing"], ["analytics", "Analytics", "/admin/analytics"], ["visitors", "Visitors", "/admin/visitors"]];
  const logout = async () => {
    await fetch("/api/admin/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) });
    router.push("/admin");
  };
  return <nav aria-label="Admin navigation" className="mb-6 flex gap-2 overflow-x-auto rounded-2xl border border-[#dfe7e1] bg-white/80 p-2 shadow-sm md:min-h-[calc(100vh-3rem)] md:flex-col">{items.map(([key, label, href]) => <button key={key} type="button" onClick={() => router.push(href)} className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition ${active === key ? "bg-[#20352b] text-white" : "text-gray-600 hover:bg-[#f4f0e7] hover:text-[#20352b]"}`}>{label}</button>)}<button type="button" onClick={logout} className="whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-red-700 transition hover:bg-red-50 md:mt-auto">ออกจากระบบ</button></nav>;
}
