import { createFileRoute } from "@tanstack/react-router";
import { BarangayMap } from "@/components/barangay-map";
import { BARANGAY_INFO, CATEGORIES } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { BarChart3, AlertTriangle, Clock, ShieldCheck, Activity, Globe } from "lucide-react";

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
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl tracking-tight text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-sky-500" /> Barangay Balibago Operational Analytics
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-mono mt-1">
            Aggregate statistics for {BARANGAY_INFO.name}, {BARANGAY_INFO.city} · Verified as of{" "}
            {BARANGAY_INFO.lastAuditDate}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 font-mono text-xs">
        {[
          [`${issues.length}`, "Active Tracked Tickets", AlertTriangle, "text-sky-500", "bg-sky-500/10 border-sky-500/20"],
          [`${criticalCount}`, "Critical Emergency Dispatches", Activity, "text-rose-500", "bg-rose-500/10 border-rose-500/20"],
          ["3.2 hrs", "Median Inspection Speed", Clock, "text-amber-500", "bg-amber-500/10 border-amber-500/20"],
          ["100%", "Resident Verified Lockout", ShieldCheck, "text-emerald-500", "bg-emerald-500/10 border-emerald-500/20"],
        ].map(([v, k, Icon, tone, bg]) => (
          <div key={k as string} className="surface-card surface-card-hover p-5 border border-border/80 bg-card rounded-3xl shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase">{k as string}</span>
              <span className={`grid h-8 w-8 place-items-center rounded-xl border ${bg as string}`}>
                <Icon className={`h-4 w-4 ${tone as string}`} />
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-foreground">{v as string}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <section className="surface-card overflow-hidden border border-border/80 rounded-3xl bg-card shadow-xl flex flex-col">
          <div className="border-b border-border px-5 py-4 bg-surface-2/40">
            <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <Globe className="h-4.5 w-4.5 text-sky-500" /> Flood & Infrastructure Hotspot Heatmap
            </h2>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              Fields Ave cor. MacArthur Hwy & Astro Park drainage basin heat density.
            </p>
          </div>
          <BarangayMap issues={issues} className="h-[320px] sm:h-[400px] rounded-none border-none" />
        </section>

        <section className="surface-card p-5 border border-border/80 rounded-3xl bg-card shadow-xl">
          <h2 className="text-base font-extrabold text-foreground">Active Balibago Reports by Category</h2>
          <p className="text-xs text-muted-foreground font-mono mt-0.5 mb-4">Categorized public concern distribution</p>
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
                    borderRadius: 16,
                    fontSize: 12,
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    color: "#f8fafc",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
                  }}
                />
                <Bar dataKey="count" fill="oklch(0.48 0.16 230)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
