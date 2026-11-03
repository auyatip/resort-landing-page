"use client";

import { useEffect, useState } from "react";

type ApiLog = { id: string; method: string; path: string; status: number; durationMs: number; timestamp: string; ip?: string; userAgent?: string };

export default function ApiLogsPanel() {
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/logs?limit=200", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.text();
        let result: { success?: boolean; logs?: ApiLog[]; message?: string } = {};
        try {
          result = body ? JSON.parse(body) : {};
        } catch {
          throw new Error(`Unable to load API logs (HTTP ${response.status})`);
        }
        if (!response.ok || !result.success) throw new Error(result.message || "Unable to load API logs");
        setLogs(result.logs || []);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load API logs"));
  }, []);

  return <section className="mt-5 overflow-hidden rounded-3xl border border-[#dfe7e1] bg-white shadow-sm"><div className="border-b border-[#edf1ee] p-5"><h2 className="font-semibold">Booking API request logs</h2><p className="mt-1 text-sm text-gray-500">เฉพาะ API ที่เกี่ยวกับการจองห้องและการชำระเงิน</p></div>{error ? <p className="p-5 text-sm text-red-700">{error}</p> : <div className="max-h-[520px] overflow-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="sticky top-0 bg-[#f8faf8] text-xs uppercase text-gray-500"><tr><th className="px-5 py-3">เวลา</th><th className="px-5 py-3">Method</th><th className="px-5 py-3">Path</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Duration</th><th className="px-5 py-3">IP</th></tr></thead><tbody>{logs.map((log) => <tr key={log.id} className="border-t border-[#edf1ee] hover:bg-[#f8faf8]"><td className="whitespace-nowrap px-5 py-3 text-xs text-[#66766c]">{new Date(log.timestamp).toLocaleString("th-TH")}</td><td className="px-5 py-3 font-mono text-xs font-semibold">{log.method}</td><td className="px-5 py-3 font-mono text-xs">{log.path}</td><td className="px-5 py-3 text-xs">{log.status || "—"}</td><td className="px-5 py-3 text-xs">{log.durationMs} ms</td><td className="px-5 py-3 text-xs text-[#66766c]">{log.ip || "—"}</td></tr>)}{logs.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-500">ยังไม่มี Booking API log</td></tr>}</tbody></table></div>}</section>;
}
