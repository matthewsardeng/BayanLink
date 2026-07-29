import { createFileRoute } from "@tanstack/react-router";
import { BARANGAY_INFO } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { Clock, ShieldCheck, AlertTriangle, CheckCircle2, Award } from "lucide-react";

export const Route = createFileRoute("/dashboard/sla")({
  head: () => ({
    meta: [{ title: "SLA Compliance — BayanLink Balibago" }],
  }),
  component: SLACompliance,
});

function SLACompliance() {
  const { issues } = useBayanStore();

  const slaTargets = [
    { category: "Flooding & Drainage", target: "12 hours", compliance: "96.4%", avgSpeed: "8.2 hrs", status: "On Track" },
    { category: "Road Damage & Potholes", target: "48 hours", compliance: "92.1%", avgSpeed: "34.0 hrs", status: "On Track" },
    { category: "Streetlight Outages", target: "24 hours", compliance: "98.0%", avgSpeed: "14.5 hrs", status: "Optimal" },
    { category: "Garbage & Waste Removal", target: "12 hours", compliance: "94.8%", avgSpeed: "9.1 hrs", status: "On Track" },
    { category: "Water Supply Disruptions", target: "6 hours", compliance: "99.2%", avgSpeed: "3.4 hrs", status: "Optimal" },
    { category: "Safety Hazards", target: "4 hours", compliance: "100.0%", avgSpeed: "1.8 hrs", status: "Optimal" },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl">
        <span className="text-xs font-mono text-zinc-500 font-semibold uppercase tracking-wider">
          Service Level Agreements
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
          Barangay Balibago SLA Compliance
        </h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">
          Response speed targets, inspection benchmarks, and resolution SLA tracking for {BARANGAY_INFO.name}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 font-mono text-xs">
        <div className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl">
          <span className="text-[11px] font-bold text-zinc-500 uppercase">Overall SLA Compliance</span>
          <p className="mt-3 text-3xl font-extrabold text-emerald-700">96.75%</p>
          <p className="mt-1 text-zinc-500 text-[11px]">Across all 8 Puroks</p>
        </div>

        <div className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl">
          <span className="text-[11px] font-bold text-zinc-500 uppercase">Median Inspection Time</span>
          <p className="mt-3 text-3xl font-extrabold text-zinc-900">3.2 hrs</p>
          <p className="mt-1 text-zinc-500 text-[11px]">Target: &lt; 6.0 hrs</p>
        </div>

        <div className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl">
          <span className="text-[11px] font-bold text-zinc-500 uppercase">Resident Lockout Guarantee</span>
          <p className="mt-3 text-3xl font-extrabold text-zinc-900">100%</p>
          <p className="mt-1 text-zinc-500 text-[11px]">Zero Unilateral Closures</p>
        </div>
      </div>

      <div className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl space-y-4">
        <h2 className="text-sm font-bold text-zinc-900">Category SLA Benchmarks & Response Latency</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-zinc-200 font-mono text-[11px] uppercase text-zinc-500">
                <th className="pb-2 font-bold">Category</th>
                <th className="pb-2 font-bold">Target SLA</th>
                <th className="pb-2 font-bold">Average Speed</th>
                <th className="pb-2 font-bold">Compliance</th>
                <th className="pb-2 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {slaTargets.map((item) => (
                <tr key={item.category} className="hover:bg-zinc-50">
                  <td className="py-3 font-bold text-zinc-900">{item.category}</td>
                  <td className="py-3 font-mono text-zinc-600">{item.target}</td>
                  <td className="py-3 font-mono text-zinc-900 font-bold">{item.avgSpeed}</td>
                  <td className="py-3 font-mono text-emerald-700 font-bold">{item.compliance}</td>
                  <td className="py-3">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
