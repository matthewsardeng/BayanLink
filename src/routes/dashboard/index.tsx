import { createFileRoute, Link } from "@tanstack/react-router";
import { BarangayMap } from "@/components/barangay-map";
import { BARANGAY_INFO } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { StatusPill } from "@/components/status";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Users,
  Building2,
  MapPin,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Barangay Balibago Operations — BayanLink" },
      {
        name: "description",
        content:
          "Public overview for Barangay Balibago, Angeles City: active issues, impact priorities, and resolution metrics.",
      },
      { property: "og:title", content: "Barangay Balibago Operations — BayanLink" },
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
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 mt-1">
              Public Operations Dashboard
            </h1>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              {BARANGAY_INFO.name}, {BARANGAY_INFO.city} · Punong Barangay: {BARANGAY_INFO.captain}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" variant="outline" className="rounded-full text-xs font-semibold border-zinc-300">
              <Link to="/dashboard/map">Explore Map</Link>
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

      {/* Grid: Map + Priority List */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] items-stretch">
        <div className="surface-card overflow-hidden border border-zinc-200 rounded-3xl bg-white flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200 p-4 bg-zinc-50/50">
            <div>
              <h2 className="text-sm font-bold text-zinc-900">Barangay Balibago Schematic Map</h2>
              <p className="text-xs text-zinc-500 font-mono">
                Real-time issue distribution along MacArthur Hwy, Fields Ave & residential zones.
              </p>
            </div>
            <Button asChild size="sm" variant="ghost" className="rounded-full text-xs font-semibold text-zinc-900">
              <Link to="/dashboard/map" className="gap-1 font-mono">
                Full map <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <BarangayMap issues={issues} className="flex-1 min-h-[380px] rounded-none border-none" />
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
