import { createFileRoute } from "@tanstack/react-router";
import { BarangayMap } from "@/components/barangay-map";
import { BARANGAY_INFO, CATEGORIES } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { AlertTriangle, Clock, ShieldCheck, Activity, Globe } from "lucide-react";

export const Route = createFileRoute("/dashboard/analytics")({
  head: () => ({
    meta: [
      { title: "Barangay Balibago Analytics — BayanLink" },
      {
        name: "description",
        content:
          "Heatmaps, category trends, and resolution performance statistics for Barangay Balibago, Angeles City.",
      },
      { property: "og:title", content: "Barangay Balibago Analytics — BayanLink" },
      {
        property: "og:description",
        content: "Heatmaps, trends and resolution performance for Barangay Balibago.",
      },
    ],
  }),
  component: Analytics,
});

function Analytics() {
  const { issues } = useBayanStore();

  const byCategory = CATEGORIES.map((c) => ({
    name: c.name,
    count: issues.filter((i) => i.category === c.name).length,
  }));

  const criticalCount = issues.filter((i) => i.severity === "Critical").length;

  return (
    <div className="space-y-6 font-sans">
      <div className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl">
        <span className="text-xs font-mono text-zinc-500 font-semibold uppercase tracking-wider">
          Performance & Statistics
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
          Barangay Balibago Operational Analytics
        </h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">
          Aggregate statistics for {BARANGAY_INFO.name}, {BARANGAY_INFO.city} · Verified as of {BARANGAY_INFO.lastAuditDate}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 font-mono text-xs">
        {[
          [`${issues.length}`, "Active Tracked Tickets", AlertTriangle, "text-zinc-900", "bg-zinc-100 border-zinc-200"],
          [`${criticalCount}`, "Critical Emergency Dispatches", Activity, "text-rose-600", "bg-rose-50 border-rose-200"],
          ["3.2 hrs", "Median Inspection Speed", Clock, "text-amber-600", "bg-amber-50 border-amber-200"],
          ["100%", "Resident Verified Lockout", ShieldCheck, "text-emerald-600", "bg-emerald-50 border-emerald-200"],
        ].map(([v, k, Icon, tone, bg]) => (
          <div key={k as string} className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-500 uppercase">{k as string}</span>
              <span className={`grid h-8 w-8 place-items-center rounded-xl border ${bg as string}`}>
                <Icon className={`h-4 w-4 ${tone as string}`} />
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-zinc-900">{v as string}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <section className="surface-card p-6 border border-zinc-200 rounded-3xl bg-white shadow-sm space-y-4">
          <div className="border-b border-zinc-100 pb-3">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Globe className="h-4 w-4 text-zinc-900" /> Active 2026 Balibago Civic Programs & Health Facilities
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              Verified municipal programs and medical centers serving 38,510 residents
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* TODA Economic Relief */}
            <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/60 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                Tripartite MOA (Apr 30, 2026)
              </span>
              <h3 className="font-bold text-sm text-zinc-900">Fuel-First, Pay-Later Relief</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Spearheaded by Chairman Joseph Ponce for over <strong>2,000 TODA tricycle drivers</strong> across Balibago commercial transit routes.
              </p>
            </div>

            {/* Balibago Health Center */}
            <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/60 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                1511 Rossana St., Mt. View
              </span>
              <h3 className="font-bold text-sm text-zinc-900">Balibago Health Center</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Mon–Fri 8AM–5PM · Buntis Day, Child Immunization (0-59 mos), and <strong>Dental Consultations every Thursday</strong>.
              </p>
            </div>

            {/* DOH RHU IV */}
            <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/60 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                Doña Rosario St.
              </span>
              <h3 className="font-bold text-sm text-zinc-900">Angeles RHU IV – Balibago</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Department of Health (DOH) National TB Control Program public DOTS laboratory & diagnostic facility.
              </p>
            </div>

            {/* Public Building Safety */}
            <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/60 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                City Building Official Desk
              </span>
              <h3 className="font-bold text-sm text-zinc-900">Public Structure Safety Audits</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Automated hazard routing with City Engineer's Office for commercial building safety & structural inspection requests.
              </p>
            </div>
          </div>
        </section>

        <section className="surface-card p-5 border border-zinc-200 rounded-3xl bg-white shadow-sm">
          <h2 className="text-sm font-bold text-zinc-900">Active Balibago Reports by Category</h2>
          <p className="text-xs text-zinc-500 font-mono mt-0.5 mb-4">Categorized public concern distribution</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCategory} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    fontSize: 12,
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    color: "#ffffff",
                  }}
                />
                <Bar dataKey="count" fill="#18181b" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
