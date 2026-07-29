import { createFileRoute } from "@tanstack/react-router";
import { BARANGAY_INFO, PUROKS } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { MapPin, Users, AlertTriangle, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/dashboard/puroks")({
  head: () => ({
    meta: [{ title: "Puroks Directory — BayanLink Balibago" }],
  }),
  component: PuroksView,
});

function PuroksView() {
  const { issues } = useBayanStore();

  const purokList = PUROKS.map((name, idx) => {
    const activeCount = issues.filter((i) => i.purok === name).length;
    return {
      name,
      code: `PUR-0${idx + 1}`,
      leader: `Purok President ${idx + 1}`,
      households: 350 + idx * 45,
      activeIssues: activeCount,
    };
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl">
        <span className="text-xs font-mono text-zinc-500 font-semibold uppercase tracking-wider">
          Barangay Zones & Purok Boundaries
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
          Barangay Balibago Purok Directory
        </h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">
          Coverage, active maintenance tickets, and household counts for all 8 puroks in {BARANGAY_INFO.name}.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {purokList.map((p) => (
          <div key={p.code} className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-zinc-900">{p.code}</span>
              <span className="bg-zinc-100 text-zinc-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                {p.activeIssues} Active Tickets
              </span>
            </div>
            <h2 className="text-base font-bold text-zinc-900">{p.name}</h2>
            <div className="text-xs font-mono text-zinc-500 space-y-1 pt-2 border-t border-zinc-100">
              <p>Households: <strong className="text-zinc-900">{p.households}</strong></p>
              <p>Coverage: Balibago Zone {p.code}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
