import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BarangayMap, CategoryIcon } from "@/components/barangay-map";
import {
  BARANGAY_INFO,
  CATEGORIES,
  LIFECYCLE,
  type IssueCategory,
  type IssueStatus,
} from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { ImpactMeter, LifecycleTrack, SeverityTag, StatusPill } from "@/components/status";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Users, MapPin, CalendarClock, ShieldCheck, FilterX, Map as MapIcon } from "lucide-react";

export const Route = createFileRoute("/dashboard/map")({
  head: () => ({
    meta: [
      { title: "Barangay Balibago Issue Map — BayanLink" },
      {
        name: "description",
        content:
          "Filter Barangay Balibago issues by category, severity, status, and zone on an interactive OpenStreetMap map.",
      },
      { property: "og:title", content: "Barangay Balibago Issue Map — BayanLink" },
      {
        property: "og:description",
        content:
          "Interactive issue map for Barangay Balibago, Angeles City with category and status filters.",
      },
    ],
  }),
  component: MapView,
});

function MapView() {
  const { issues, confirmIssue } = useBayanStore();
  const [cats, setCats] = useState<IssueCategory[]>([]);
  const [status, setStatus] = useState<IssueStatus | "All">("All");
  const [selected, setSelected] = useState<string>(issues[0]?.id || "");

  const filtered = useMemo(
    () =>
      issues.filter(
        (i) =>
          (cats.length === 0 || cats.includes(i.category)) &&
          (status === "All" || i.status === status)
      ),
    [issues, cats, status]
  );

  const issue = issues.find((i) => i.id === selected) ?? filtered[0];

  const toggle = (c: IssueCategory) =>
    setCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full overflow-hidden bg-background font-sans">
      {/* Top Map Operational Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-white px-4 py-2.5 shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-3 min-w-0">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-50 text-sky-700 font-bold shrink-0 border border-sky-200">
            <MapIcon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold leading-tight text-slate-900">
              Barangay Balibago Live Issue Map
            </h1>
            <p className="truncate text-xs text-slate-500 font-mono">
              {filtered.length} active reports · Last updated {BARANGAY_INFO.lastAuditDate}
            </p>
          </div>
        </div>

        {/* Category Line-Icon Filter Bar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              onClick={() => toggle(c.name)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors",
                cats.includes(c.name)
                  ? "border-transparent bg-slate-900 text-white"
                  : "border-border bg-white hover:bg-slate-50 text-slate-600"
              )}
            >
              <CategoryIcon category={c.name} className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{c.name}</span>
            </button>
          ))}

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as IssueStatus | "All")}
            aria-label="Filter by status"
            className="rounded-lg border border-border bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-800 outline-none"
          >
            <option value="All">All Statuses</option>
            {LIFECYCLE.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {(cats.length > 0 || status !== "All") && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs font-semibold text-sky-700 hover:bg-sky-50"
              onClick={() => {
                setCats([]);
                setStatus("All");
              }}
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Main Full-Height Viewport Grid */}
      <div className="grid flex-1 overflow-hidden lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px]">
        {/* Full-Bleed Map Panel */}
        <div className="relative h-full w-full overflow-hidden border-r border-border bg-slate-100">
          {filtered.length > 0 ? (
            <BarangayMap
              issues={filtered}
              selectedId={selected}
              onSelect={setSelected}
              className="h-full w-full rounded-none border-none"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center bg-white text-slate-800">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 border border-slate-200 text-slate-500 mb-3">
                <FilterX className="h-6 w-6" />
              </span>
              <h3 className="text-base font-bold">No reports match selected filters</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-xs">
                No active maintenance or hazard reports match the selected filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 border-slate-300 font-semibold"
                onClick={() => {
                  setCats([]);
                  setStatus("All");
                }}
              >
                Clear Map Filters
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar Desk Panel */}
        <div className="flex flex-col h-full overflow-y-auto bg-slate-50 p-4 space-y-4">
          {issue ? (
            <div className="surface-card p-4 border border-slate-200 space-y-3 rounded-xl bg-white shadow-sm">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-sky-700">{issue.code}</span>
                  <h2 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                    {issue.title}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-1 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-sky-600" /> {issue.purok} · {issue.street}
                  </p>
                </div>
                <StatusPill status={issue.status} />
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {issue.summary}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <SeverityTag severity={issue.severity} />
                <ImpactMeter score={issue.impact} />
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-mono">
                  <Users className="h-3.5 w-3.5" /> {issue.households} households
                </span>
              </div>

              <div className="pt-1">
                <LifecycleTrack status={issue.status} compact />
              </div>

              <div className="rounded-lg border border-slate-200 p-3 text-xs space-y-1.5 bg-slate-50">
                <p className="font-semibold text-slate-900">Next Scheduled Action:</p>
                <p className="text-slate-600">{issue.nextAction}</p>
                <p className="flex items-center gap-1 text-[11px] font-mono text-slate-500 pt-1.5 border-t border-slate-200">
                  <CalendarClock className="h-3.5 w-3.5 text-sky-600" /> ETA: {issue.eta} · {issue.department}
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => confirmIssue(issue.id)}
                className="w-full gap-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-300" /> Confirm Affected Resident (
                {issue.confirmations})
              </Button>
            </div>
          ) : (
            <div className="surface-card p-6 text-center text-xs text-slate-500 rounded-xl bg-white">
              Select a pin on the map to inspect ticket details.
            </div>
          )}

          {/* Active Queue List */}
          <div className="surface-card p-4 border border-slate-200 flex-1 flex flex-col rounded-xl bg-white shadow-sm">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
              <MapPin className="h-3.5 w-3.5 text-sky-600" /> Active Ticket Queue ({filtered.length})
            </h3>
            {filtered.length > 0 ? (
              <ul className="mt-3 space-y-2 flex-1 overflow-y-auto">
                {filtered.map((i) => (
                  <li key={i.id}>
                    <button
                      onClick={() => setSelected(i.id)}
                      className={cn(
                        "grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border p-2.5 text-left transition-colors text-xs",
                        i.id === selected
                          ? "border-sky-600 bg-sky-50 font-semibold"
                          : "border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-slate-900">
                          {i.title}
                        </span>
                        <span className="block text-[11px] text-slate-500 font-mono mt-0.5">
                          {i.category} · {i.purok}
                        </span>
                      </span>
                      <StatusPill status={i.status} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                No tickets matching current filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
