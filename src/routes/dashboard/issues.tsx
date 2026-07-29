import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BARANGAY_INFO, CATEGORIES, type IssueCategory } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { ImpactMeter, LifecycleTrack, SeverityTag, StatusPill } from "@/components/status";
import { BeforeAfter } from "@/components/before-after";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, Repeat, ShieldAlert, ShieldCheck, Inbox, Search, ListFilter } from "lucide-react";

export const Route = createFileRoute("/dashboard/issues")({
  head: () => ({
    meta: [
      { title: "Barangay Balibago Issue Queue — Tugnay" },
      {
        name: "description",
        content:
          "Impact-ranked issue queue for Barangay Balibago with transparent lifecycle timelines, recurring clusters, and before/after proof of work.",
      },
      { property: "og:title", content: "Barangay Balibago Issue Queue — Tugnay" },
      {
        property: "og:description",
        content:
          "Transparent lifecycle timelines, recurring clusters and proof of completed work in Barangay Balibago.",
      },
    ],
  }),
  component: Issues,
});

function Issues() {
  const { issues, confirmIssue, updateIssueStatus } = useBayanStore();
  const [open, setOpen] = useState<string | null>(issues[0]?.id || null);
  const [sort, setSort] = useState<"impact" | "recent">("impact");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState<IssueCategory | "All">("All");

  const filtered = issues.filter((i) => {
    const matchesSearch =
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.purok.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.street.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === "All" || i.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const list = [...filtered].sort((a, b) =>
    sort === "impact" ? b.impact - a.impact : b.reportedAt.localeCompare(a.reportedAt)
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-zinc-500 font-semibold uppercase tracking-wider">
              Issue Queue & Lifecycle
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
              Barangay Balibago Public Issue Queue
            </h1>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              {issues.length} active tickets verified as of {BARANGAY_INFO.lastAuditDate}
            </p>
          </div>

          <div className="flex shrink-0 gap-1 rounded-full border border-zinc-200 bg-zinc-50 p-1 text-xs font-mono">
            {(["impact", "recent"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 font-semibold capitalize transition-all",
                  sort === s ? "bg-zinc-900 text-white" : "text-zinc-600 hover:text-zinc-900"
                )}
              >
                {s === "impact" ? "Impact Priority" : "Most Recent"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 surface-card p-4 border border-zinc-200 bg-white rounded-3xl shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search tickets by code, title, street, or purok..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-2 text-xs font-medium text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedCat("All")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-full transition-all",
              selectedCat === "All"
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:text-zinc-900"
            )}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedCat(c.name)}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-full transition-all hidden md:inline-flex items-center gap-1",
                selectedCat === c.name
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:text-zinc-900"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {list.length > 0 ? (
        <div className="space-y-4">
          {list.map((i) => {
            const expanded = open === i.id;
            return (
              <article key={i.id} className="surface-card overflow-hidden border border-zinc-200 rounded-3xl bg-white shadow-sm transition-all">
                <button
                  onClick={() => setOpen(expanded ? null : i.id)}
                  className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5 text-left hover:bg-zinc-50/50 transition-colors"
                  aria-expanded={expanded}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-zinc-900">{i.code}</span>
                      <StatusPill status={i.status} />
                      {i.recurring && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-semibold text-amber-800">
                          <Repeat className="h-3 w-3" /> Recurring ×{i.recurring.count} / {i.recurring.sinceMonths} mo
                        </span>
                      )}
                      {i.severity === "Critical" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-semibold text-rose-800">
                          <ShieldAlert className="h-3 w-3" /> Emergency Dispatch
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 text-base font-bold text-zinc-900 truncate">{i.title}</h2>
                    <p className="mt-1 truncate text-xs text-zinc-500 font-mono">
                      {i.category} · {i.street}, {i.purok} · {i.confirmations} resident confirmations · {i.households} households
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="hidden sm:block">
                      <ImpactMeter score={i.impact} />
                    </div>
                    <ChevronDown
                      className={cn("h-5 w-5 text-zinc-400 transition-transform duration-200", expanded && "rotate-180")}
                    />
                  </div>
                </button>

                <div className="px-5 pb-4">
                  <LifecycleTrack status={i.status} compact />
                </div>

                {expanded && (
                  <div className="grid gap-6 border-t border-zinc-200 p-5 lg:grid-cols-[1.2fr_1fr] bg-zinc-50/50">
                    <div>
                      <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed bg-white p-3.5 rounded-2xl border border-zinc-200">
                        {i.summary}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs">
                        <SeverityTag severity={i.severity} />
                        <span className="text-zinc-500">
                          Department: <strong className="text-zinc-900 font-bold">{i.department}</strong>
                        </span>
                        <span className="text-zinc-500">
                          Target: <strong className="text-zinc-900 font-bold">{i.eta}</strong>
                        </span>
                      </div>
                      <ol className="mt-5 space-y-3.5 border-l-2 border-zinc-300 pl-4 font-mono text-xs">
                        {i.timeline.map((e, k) => (
                          <li key={k} className="relative">
                            <span className="absolute top-1.5 -left-[21px] h-3 w-3 rounded-full bg-zinc-900 ring-4 ring-white" />
                            <p className="font-bold text-zinc-900">{e.status}</p>
                            <p className="text-[11px] text-zinc-500">
                              {e.at} · {e.by}
                            </p>
                            <p className="text-xs text-zinc-700 mt-0.5 leading-relaxed">{e.note}</p>
                          </li>
                        ))}
                      </ol>
                      <p className="mt-5 rounded-2xl bg-white border border-zinc-200 p-3.5 text-xs text-zinc-900 font-mono">
                        <span className="font-bold">Next Scheduled Action: </span>
                        {i.nextAction}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {i.proof ? (
                        <div>
                          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
                            Inspectable Proof of Work
                          </p>
                          <BeforeAfter before={i.proof.before} after={i.proof.after} />
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-zinc-300 p-4 text-xs text-zinc-500 font-mono">
                          Inspectable photo proof is required before this issue can be closed by resident vote.
                        </div>
                      )}
                      <div className="rounded-2xl border border-zinc-200 p-4 bg-white shadow-sm">
                        <p className="text-xs font-bold text-zinc-900">
                          Resident Verification Status
                        </p>
                        <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                          {i.status === "Resident Verified"
                            ? "Closed permanently by resident verification votes."
                            : "Requires local resident confirmation votes in Balibago to verify physical resolution."}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => confirmIssue(i.id)}
                            className="gap-1.5 text-xs font-semibold rounded-full border-zinc-300"
                          >
                            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Confirm Affected Resident ({i.confirmations})
                          </Button>
                          {i.status !== "Resident Verified" && (
                            <Button
                              size="sm"
                              className="text-xs font-semibold rounded-full bg-emerald-600 hover:bg-emerald-500 text-white"
                              onClick={() =>
                                updateIssueStatus(
                                  i.id,
                                  "Resident Verified",
                                  "Verified solved by local resident vote"
                                )
                              }
                            >
                              Vote Resolved
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="surface-card p-12 text-center border border-zinc-200 rounded-3xl bg-white">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-zinc-100 text-zinc-500 mx-auto mb-4 border border-zinc-200">
            <Inbox className="h-7 w-7 text-zinc-700" />
          </span>
          <h3 className="text-base font-bold text-zinc-900">No active reports match filter</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Try resetting your search query or category filters to view active tickets.
          </p>
        </div>
      )}
    </div>
  );
}
