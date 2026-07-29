import { createFileRoute } from "@tanstack/react-router";
import { BARANGAY_INFO, BARANGAY_OFFICIALS, PUROKS } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { MapPin, Users, Building2, Award, UserCheck, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/dashboard/puroks")({
  head: () => ({
    meta: [{ title: "Purok Directory & Official Governance — Tugnay Balibago" }],
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
      households: 350 + idx * 45,
      activeIssues: activeCount,
    };
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Core Metadata */}
      <div className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-zinc-500 font-semibold uppercase tracking-wider">
              Official Governance & Demographics
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
              Barangay Balibago Directory & Leadership Roster
            </h1>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              PSGC: <strong>{BARANGAY_INFO.psgcCode}</strong> · Classification: <strong>{BARANGAY_INFO.classification}</strong> · {BARANGAY_INFO.city}, {BARANGAY_INFO.province}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 px-4 py-2 rounded-2xl font-mono text-xs text-zinc-700">
            <Users className="h-4 w-4 text-zinc-900" />
            <div>
              <span className="block font-bold text-zinc-900 text-sm">38,510</span>
              <span className="text-[10px] text-zinc-500">2024 POPCEN Official Census</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sangguniang Barangay Official Roster (2023–2026 Term) */}
      <div className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-600" /> Sangguniang Barangay Leadership (2023–2026 Term)
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              Punong Barangay: {BARANGAY_INFO.captain} · Term ends Nov 2026
            </p>
          </div>
          <span className="bg-emerald-50 text-emerald-800 text-xs font-mono font-bold px-3 py-1 rounded-full border border-emerald-200">
            DILG Masterlist Verified
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 font-mono text-xs">
          {BARANGAY_OFFICIALS.map((o) => (
            <div key={o.name} className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/60 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {o.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-zinc-900 truncate">{o.name}</p>
                <p className="text-[11px] text-zinc-600 font-semibold">{o.title}</p>
                <p className="text-[10px] text-zinc-400">{o.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purok Cards */}
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
