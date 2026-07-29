import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BARANGAY_INFO, SERVICES, type ServiceItem } from "@/data/barangay";
import { cn } from "@/lib/utils";
import { Search, Building2, Clock, FileText, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/services")({
  head: () => ({
    meta: [
      { title: "Barangay Balibago Public Service Explorer — BayanLink" },
      {
        name: "description",
        content:
          "Browse official Barangay Balibago public services, clearances, certificates, fees, requirements, and processing times.",
      },
      { property: "og:title", content: "Barangay Balibago Public Service Explorer — BayanLink" },
      {
        property: "og:description",
        content: "Requirements, fees and processing times for Barangay Balibago public services.",
      },
    ],
  }),
  component: Services,
});

const GROUPS: string[] = ["All", ...Array.from(new Set(SERVICES.map((s: ServiceItem) => s.group)))];

function Services() {
  const [group, setGroup] = useState<string>("All");
  const [q, setQ] = useState<string>("");

  const list = SERVICES.filter(
    (s: ServiceItem) =>
      (group === "All" || s.group === group) &&
      (s.name + s.group + s.requirements.join(" ")).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl">
        <span className="text-xs font-mono text-zinc-500 font-semibold uppercase tracking-wider">
          Municipal Services & Clearances
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
          Barangay Balibago Public Service Explorer
        </h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">
          Requirements, processing windows, fees, and window desk locations for {BARANGAY_INFO.name}, {BARANGAY_INFO.city}.
        </p>
      </div>

      <div className="surface-card flex flex-wrap items-center gap-3 p-4 border border-zinc-200 rounded-3xl bg-white shadow-sm">
        <span className="flex min-w-[240px] flex-1 items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-sm">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search e.g. clearance, indigency, cedula, blotter..."
            aria-label="Search services"
            className="min-w-0 flex-1 bg-transparent outline-none text-xs font-medium text-zinc-900"
          />
        </span>
        {GROUPS.map((g: string) => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all font-mono",
              group === g
                ? "border-transparent bg-zinc-900 text-white"
                : "border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600"
            )}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((s: ServiceItem) => (
          <article
            key={s.id}
            className="surface-card flex flex-col justify-between gap-4 p-5 border border-zinc-200 rounded-3xl bg-white shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold tracking-wide text-zinc-900 uppercase">
                  {s.group}
                </span>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-800">
                  OFFICIAL SERVICE
                </span>
              </div>
              <h2 className="text-base font-bold text-zinc-900">{s.name}</h2>
              <p className="text-xs font-mono font-semibold text-zinc-600 flex items-center gap-1.5 bg-zinc-50 p-2 rounded-xl border border-zinc-200">
                <Clock className="h-3.5 w-3.5 text-zinc-900" /> {s.time} ·{" "}
                <span className="text-zinc-900 font-bold">{s.fee}</span>
              </p>
              <div className="pt-2">
                <p className="text-[11px] font-bold text-zinc-500 uppercase font-mono tracking-wider">
                  Requirements:
                </p>
                <ul className="mt-2 space-y-1.5 text-xs">
                  {s.requirements.map((r: string) => (
                    <li key={r} className="flex items-center gap-2 text-zinc-800 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-zinc-100 pt-3 text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-zinc-900 shrink-0" /> {s.location}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
