import { createFileRoute, Link } from "@tanstack/react-router";
import { BarangayMap } from "@/components/barangay-map";
import { BARANGAY_INFO, TREND } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { ImpactMeter, StatusPill } from "@/components/status";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Users,
  Building2,
  Globe,
  Radio,
  Sparkles,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Barangay Balibago Command Center — BayanLink Admin" },
      {
        name: "description",
        content:
          "Digital twin overview of Barangay Balibago, Angeles City: active issues, impact-ranked priorities, live activity, and resolution performance.",
      },
      { property: "og:title", content: "Barangay Balibago Command Center — BayanLink Admin" },
      {
        property: "og:description",
        content:
          "Active issues, impact-ranked priorities and resolution performance for Barangay Balibago.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { issues, feed } = useBayanStore();

  const priority = [...issues].sort((a, b) => b.impact - a.impact).slice(0, 5);

  const kpis = [
    {
      label: "Active Tracked Tickets",
      value: `${issues.length}`,
      delta: `Verified as of ${BARANGAY_INFO.lastAuditDate}`,
      icon: AlertTriangle,
      tone: "text-sky-500",
      bg: "bg-sky-500/10 border-sky-500/20",
    },
    {
      label: "Verified Resolutions",
      value: "112",
      delta: "100% Resident Verified Lockout",
      icon: CheckCircle2,
      tone: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Median Inspection Speed",
      value: "3.2 hrs",
      delta: "Barangay Inspector Dispatch",
      icon: Clock,
      tone: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Households Impacted",
      value: "1,420",
      delta: "Across 8 Balibago Zones",
      icon: Users,
      tone: "text-blue-500",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Balibago Header Card */}
      <div className="surface-card p-6 border border-border/80 bg-card rounded-3xl shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-0.5 text-xs font-bold text-sky-600 mb-1">
                <Radio className="h-3.5 w-3.5 text-sky-500 animate-pulse" /> Live Civic Twin
              </span>
            </div>
            <h1 className="text-2xl font-extrabold sm:text-3xl tracking-tight text-foreground">
              Barangay Balibago Operations Console
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-mono">
              {BARANGAY_INFO.name}, {BARANGAY_INFO.city}, {BARANGAY_INFO.province} ·{" "}
              {BARANGAY_INFO.captainTitle}: {BARANGAY_INFO.captain}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="sm" variant="outline" className="rounded-xl font-bold border-border">
              <Link to="/dashboard/map">
                <Globe className="h-4 w-4 text-sky-500 mr-1.5" /> Dual-Engine Map
              </Link>
            </Button>
            <Button asChild size="sm" className="rounded-xl font-bold bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/20">
              <Link to="/report">
                <Sparkles className="h-3.5 w-3.5 mr-1" /> File New Report
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="surface-card surface-card-hover p-5 border border-border/80 bg-card rounded-3xl shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
              <span className={`grid h-8 w-8 place-items-center rounded-xl border ${kpi.bg}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.tone}`} />
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-foreground">{kpi.value}</p>
            <p className="mt-1.5 text-[11px] text-muted-foreground">{kpi.delta}</p>
          </div>
        ))}
      </div>

      {/* Grid: Map + Priority List */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="surface-card overflow-hidden border border-border/80 rounded-3xl shadow-xl flex flex-col bg-card">
          <div className="flex items-center justify-between border-b border-border p-4 sm:p-5 bg-surface-2/40">
            <div>
              <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                <Globe className="h-4.5 w-4.5 text-sky-500" /> Barangay Balibago Digital GIS Map
              </h2>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                Real-time issue distribution along MacArthur Hwy, Fields Ave & residential zones.
              </p>
            </div>
            <Button asChild size="sm" variant="ghost" className="rounded-xl font-bold text-sky-600 hover:text-sky-500">
              <Link to="/dashboard/map" className="gap-1 font-mono text-xs">
                Full Screen <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <BarangayMap issues={issues} className="h-[380px] sm:h-[450px] rounded-none border-none" />
        </div>

        {/* Impact Ranked Priority Queue */}
        <div className="surface-card p-5 border border-border/80 rounded-3xl shadow-xl space-y-4 flex flex-col justify-between bg-card">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                <TrendingUp className="h-4.5 w-4.5 text-sky-500" /> Highest Impact Priority Tickets
              </h2>
              <span className="text-xs font-mono text-muted-foreground font-bold">Ranked Impact</span>
            </div>

            <div className="mt-4 space-y-3">
              {priority.map((i) => (
                <div key={i.id} className="rounded-2xl border border-border/80 p-3.5 bg-surface-2/40 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-sky-600">{i.code}</span>
                    <StatusPill status={i.status} />
                  </div>
                  <h3 className="text-sm font-bold text-foreground truncate">{i.title}</h3>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-sky-500" /> {i.purok}
                    </span>
                    <span className="font-bold text-sky-600">{i.impact}/100 Impact</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button asChild variant="outline" className="w-full text-xs font-bold rounded-xl border-border">
            <Link to="/dashboard/issues">View Full Public Ticket Queue ({issues.length})</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
