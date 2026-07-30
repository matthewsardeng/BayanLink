import { createFileRoute, Link } from "@tanstack/react-router";
import { BARANGAY_INFO, PUROKS } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { StatusPill } from "@/components/status";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Users,
  MapPin,
  Map,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Barangay Balibago Operations — Tugnay" },
      {
        name: "description",
        content:
          "Public overview for Barangay Balibago, Angeles City: active issues, impact priorities, and resolution metrics.",
      },
      { property: "og:title", content: "Barangay Balibago Operations — Tugnay" },
      {
        property: "og:description",
        content: "Active issues and resolution performance for Barangay Balibago.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { issues } = useBayanStore();

  const priority = [...issues].sort((a, b) => b.impact - a.impact).slice(0, 5);

  // Group issues count per Purok
  const purokCounts = PUROKS.map((purok) => {
    const activeInPurok = issues.filter((i) => i.purok === purok);
    const criticalInPurok = activeInPurok.filter((i) => i.severity === "Critical" || i.severity === "High");
    return {
      name: purok,
      count: activeInPurok.length,
      criticalCount: criticalInPurok.length,
    };
  }).sort((a, b) => b.count - a.count);

  const kpis = [
    {
      label: "Active Reports",
      value: `${issues.length}`,
      delta: `Audit: ${BARANGAY_INFO.lastAuditDate}`,
      icon: AlertTriangle,
    },
    {
      label: "Resolved Issues",
      value: "112",
      delta: "100% Resident Verified",
      icon: CheckCircle2,
    },
    {
      label: "Median Inspection Time",
      value: "3.2 hrs",
      delta: "Barangay Inspector Dispatch",
      icon: Clock,
    },
    {
      label: "Households Impacted",
      value: "1,420",
      delta: "Across 8 Balibago Zones",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-zinc-500 font-semibold uppercase tracking-wider">
              Barangay Balibago Operations
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
              Public Operations Dashboard
            </h1>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              {BARANGAY_INFO.name}, {BARANGAY_INFO.city} · Punong Barangay: {BARANGAY_INFO.captain}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" variant="outline" className="rounded-full text-xs font-semibold border-zinc-300">
              <Link to="/dashboard/map">Explore Live Map</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white px-4">
              <Link to="/report">File New Concern</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="surface-card p-5 border border-zinc-200 bg-white rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{kpi.label}</span>
              <kpi.icon className="h-4 w-4 text-zinc-900" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-zinc-900">{kpi.value}</p>
            <p className="mt-1 text-[11px] text-zinc-500">{kpi.delta}</p>
          </div>
        ))}
      </div>

      {/* Grid: Purok Hotspots + Priority List */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] items-stretch">
        {/* Purok Hotspot Breakdown Card */}
        <div className="surface-card border border-zinc-200 rounded-3xl bg-white flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-200 p-4 bg-zinc-50/50 shrink-0">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-zinc-900" /> Balibago Purok Incident Hotspots
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">
                Active community reports distributed across 8 municipal zones
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="rounded-full text-xs font-semibold border-zinc-300">
              <Link to="/dashboard/map" className="gap-1 font-mono">
                Open Interactive GIS Map <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {purokCounts.map((p) => {
              const maxCount = Math.max(...purokCounts.map((x) => x.count), 1);
              const percentage = Math.round((p.count / maxCount) * 100);
              return (
                <div key={p.name} className="p-3 rounded-2xl border border-zinc-100 bg-zinc-50/60 hover:bg-zinc-100/60 transition-colors space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                      <Map className="h-3.5 w-3.5 text-zinc-500" /> {p.name}
                    </span>
                    <div className="flex items-center gap-2">
                      {p.criticalCount > 0 && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {p.criticalCount} High Risk
                        </span>
                      )}
                      <span className="font-bold text-zinc-900">{p.count} active</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-200 overflow-hidden">
                    <div
                      className="h-full bg-zinc-900 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-zinc-50 border-t border-zinc-200 text-xs font-mono text-zinc-500 flex items-center justify-between shrink-0">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> 100% Resident Verified
            </span>
            <Link to="/dashboard/puroks" className="text-zinc-900 font-bold hover:underline">
              View All 8 Purok Profiles →
            </Link>
          </div>
        </div>

        {/* Priority List */}
        <div className="surface-card border border-zinc-200 rounded-3xl bg-white flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-200 p-4 bg-zinc-50/50 shrink-0">
            <h2 className="text-sm font-bold text-zinc-900">Highest Impact Tickets</h2>
            <span className="text-xs font-mono text-zinc-500">Ranked Score</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {priority.map((i) => (
              <div key={i.id} className="rounded-2xl border border-zinc-200 p-3.5 bg-zinc-50/50 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-zinc-900">{i.code}</span>
                  <StatusPill status={i.status} />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 truncate">{i.title}</h3>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-zinc-900" /> {i.purok}
                  </span>
                  <span className="font-bold text-zinc-900">{i.impact}/100</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 pt-0 shrink-0">
            <Button asChild variant="outline" className="w-full text-xs font-semibold rounded-full border-zinc-300">
              <Link to="/dashboard/issues">View Full Ticket Queue ({issues.length})</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
