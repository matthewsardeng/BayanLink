import { createFileRoute } from "@tanstack/react-router";
import { BARANGAY_INFO } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { History, ShieldCheck, UserCheck, FileText, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/audit-log")({
  head: () => ({
    meta: [{ title: "Audit Log — BayanLink Balibago" }],
  }),
  component: AuditLogView,
});

function AuditLogView() {
  const { feed } = useBayanStore();

  return (
    <div className="space-y-6 font-sans">
      <div className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl">
        <span className="text-xs font-mono text-zinc-500 font-semibold uppercase tracking-wider">
          System Transparency Ledger
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
          Barangay Balibago Immutable Audit Log
        </h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">
          Real-time record of all status transitions, inspector assignments, and resident confirmations.
        </p>
      </div>

      <div className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-zinc-200 font-mono text-[11px] uppercase text-zinc-500">
                <th className="pb-2 font-bold">Timestamp</th>
                <th className="pb-2 font-bold">Event Type</th>
                <th className="pb-2 font-bold">Action Details</th>
                <th className="pb-2 font-bold">Zone / Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {feed.map((f) => (
                <tr key={f.id} className="hover:bg-zinc-50">
                  <td className="py-3 font-mono text-zinc-500 text-[11px]">{f.time}</td>
                  <td className="py-3">
                    <span className="bg-zinc-100 text-zinc-800 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase">
                      {f.kind}
                    </span>
                  </td>
                  <td className="py-3">
                    <p className="font-bold text-zinc-900">{f.title}</p>
                    <p className="text-[11px] text-zinc-600 mt-0.5">{f.detail}</p>
                  </td>
                  <td className="py-3 font-mono text-zinc-600">{f.distance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
