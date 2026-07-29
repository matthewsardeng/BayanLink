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
import { Users, MapPin, CalendarClock, ShieldCheck, FilterX, Map as MapIcon, Inbox } from "lucide-react";

export const Route = createFileRoute("/dashboard/map")({
  head: () => ({
    meta: [
      { title: "Barangay Balibago Issue Map — BayanLink" },
      {
        name: "description",
        content:
          "Filter Barangay Balibago issues by category, severity, status, and zone on an interactive map.",
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
    <div className="space-y-6 font-sans">
      {/* Standardized Header */}
      <div className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-zinc-500 font-semibold uppercase tracking-wider">
              Geospatial Operations & GIS Map
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
              Barangay Balibago Live Issue Map
            </h1>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              {filtered.length} active reports plotted · Pampanga bounds · Last audit {BARANGAY_INFO.lastAuditDate}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c.name}
                onClick={() => toggle(c.name)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  cats.includes(c.name)
                    ? "border-transparent bg-zinc-900 text-white font-bold"
                    : "border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600"
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
              className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-900 outline-none cursor-pointer"
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
                className="h-8 text-xs font-semibold text-zinc-900 rounded-full"
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
      </div>

      {/* Main Viewport Grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px] h-[580px]">
        {/* Map Panel */}
        <div className="surface-card overflow-hidden border border-zinc-200 bg-white rounded-3xl shadow-sm relative h-full">
          {filtered.length > 0 ? (
            <BarangayMap
              issues={filtered}
              selectedId={selected}
              onSelect={setSelected}
              className="h-full w-full rounded-none border-none"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-white text-zinc-900">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-zinc-100 border border-zinc-200 text-zinc-500 mb-3">
                <FilterX className="h-7 w-7 text-zinc-700" />
              </span>
              <h3 className="text-base font-bold text-zinc-900">No active reports match filter</h3>
              <p className="mt-1 text-xs text-zinc-500 max-w-xs leading-relaxed">
                There are no active municipal hazard or infrastructure reports matching your selected categories.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-full border-zinc-300 font-semibold text-xs"
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

        {/* Sidebar Panel */}
        <div className="flex flex-col h-full space-y-4 overflow-y-auto">
          {issue ? (
            <div className="surface-card p-5 border border-zinc-200 space-y-3 rounded-3xl bg-white shadow-sm shrink-0">
              <div className="flex items-start justify-between gap-2 border-b border-zinc-100 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-zinc-900">{issue.code}</span>
                  <h2 className="text-base font-bold text-zinc-900 mt-0.5 leading-snug">
                    {issue.title}
                  </h2>
                  <p className="text-xs text-zinc-500 font-mono mt-1 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-zinc-900" /> {issue.purok} · {issue.street}
                  </p>
                </div>
                <StatusPill status={issue.status} />
              </div>

              <p className="text-xs text-zinc-700 leading-relaxed bg-zinc-50 p-3 rounded-2xl border border-zinc-200">
                {issue.summary}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <SeverityTag severity={issue.severity} />
                <ImpactMeter score={issue.impact} />
                <span className="inline-flex items-center gap-1 text-xs text-zinc-500 font-mono">
                  <Users className="h-3.5 w-3.5" /> {issue.households} households
                </span>
              </div>

              <div className="pt-1">
                <LifecycleTrack status={issue.status} compact />
              </div>

              <div className="rounded-2xl border border-zinc-200 p-3 text-xs space-y-1 bg-zinc-50 font-mono">
                <p className="font-semibold text-zinc-900">Next Action: {issue.nextAction}</p>
                <p className="text-[11px] text-zinc-500">ETA: {issue.eta} · {issue.department}</p>
              </div>

              <Button
                size="sm"
                onClick={() => confirmIssue(issue.id)}
                className="w-full gap-1.5 text-xs font-semibold rounded-full bg-zinc-900 hover:bg-zinc-800 text-white"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Confirm Affected Resident ({issue.confirmations})
              </Button>
            </div>
          ) : (
            <div className="surface-card p-6 text-center text-xs text-zinc-500 rounded-3xl bg-white border border-zinc-200">
              <p className="font-bold text-zinc-900">No Ticket Selected</p>
              <p className="mt-1">Select a pin marker on the map to inspect ticket details.</p>
            </div>
          )}

          {/* Active Queue List */}
          <div className="surface-card p-4 border border-zinc-200 flex-1 flex flex-col rounded-3xl bg-white shadow-sm min-h-[220px]">
            <h3 className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100 pb-2.5 font-mono">
              <span className="flex items-center gap-1.5 text-zinc-900">
                <MapPin className="h-3.5 w-3.5 text-zinc-900" /> Ticket Queue
              </span>
              <span>{filtered.length} reports</span>
            </h3>

            {filtered.length > 0 ? (
              <ul className="mt-3 space-y-2 flex-1 overflow-y-auto">
                {filtered.map((i) => (
                  <li key={i.id}>
                    <button
                      onClick={() => setSelected(i.id)}
                      className={cn(
                        "grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-2xl border p-2.5 text-left transition-colors text-xs",
                        i.id === selected
                          ? "border-zinc-900 bg-zinc-100 font-semibold"
                          : "border-zinc-200 hover:bg-zinc-50"
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-bold text-zinc-900">
                          {i.title}
                        </span>
                        <span className="block text-[11px] text-zinc-500 font-mono mt-0.5">
                          {i.category} · {i.purok}
                        </span>
                      </span>
                      <StatusPill status={i.status} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center text-xs text-zinc-500">
                <Inbox className="h-6 w-6 text-zinc-400 mx-auto mb-2" />
                <p className="font-bold text-zinc-900">Queue empty for selected criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
