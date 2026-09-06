"use client";
import { useEffect, useState } from "react";
import AdminShell from "../../components/AdminShell";

type Data = { totalVisits: number; todayVisits: number; uniqueVisitors: number; todayUniqueVisitors: number; avgDuration: number; visitsByDate: Record<string, number> };
export default function AnalyticsPage() {
  const [data, setData] = useState<Data | null>(null); const [error, setError] = useState("");
  useEffect(() => { Promise.all([fetch("/api/admin/auth"), fetch("/api/analytics")]).then(async ([auth, result]) => { if (!(await auth.json()).authenticated) throw new Error("กรุณาเข้าสู่ระบบ"); const json = await result.json(); if (!json.success) throw new Error("โหลดข้อมูลไม่สำเร็จ"); setData(json.data); }).catch((e) => setError(e.message)); }, []);
  return <AdminShell active="analytics"><main className="min-h-screen bg-[#f4f0e7] p-5 text-[#20352b] md:p-10"><header className="mb-6"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#a47d2e]">Insights</p><h1 className="mt-2 font-serif text-4xl font-bold">Analytics</h1><p className="mt-2 text-sm text-gray-500">ภาพรวมการเข้าชมเว็บไซต์และพฤติกรรมผู้เข้าชม</p></header>{error ? <p className="rounded-2xl bg-white p-6 text-red-600">{error}</p> : !data ? <p className="rounded-2xl bg-white p-6 text-gray-500">กำลังโหลดข้อมูล…</p> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[["เข้าชมทั้งหมด", data.totalVisits], ["เข้าชมวันนี้", data.todayVisits], ["ผู้เข้าชมไม่ซ้ำ", data.uniqueVisitors], ["ผู้เข้าชมวันนี้", data.todayUniqueVisitors], ["เวลาเฉลี่ย (นาที)", data.avgDuration]].map(([label, value]) => <section key={label} className="rounded-2xl border border-[#dfe7e1] bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">{label}</p><p className="mt-3 text-3xl font-bold">{value}</p></section>)}</div>}</main></AdminShell>;
}
