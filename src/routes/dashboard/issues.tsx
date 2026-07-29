import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BARANGAY_INFO, CATEGORIES, type IssueCategory } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { ImpactMeter, LifecycleTrack, SeverityTag, StatusPill } from "@/components/status";
import { BeforeAfter } from "@/components/landing/before-after";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, Repeat, ShieldAlert, ShieldCheck, Inbox, Search, Filter, Sparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard/issues")({
  head: () => ({
    meta: [
      { title: "Barangay Balibago Issue Queue — BayanLink" },
      {
        name: "description",
        content:
          "Impact-ranked issue queue for Barangay Balibago with transparent lifecycle timelines, recurring clusters, and before/after proof of work.",
      },
      { property: "og:title", content: "Barangay Balibago Issue Queue — BayanLink" },
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
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold sm:text-3xl tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-sky-500" /> Barangay Balibago Public Issue Queue
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-mono mt-1">
            {issues.length} active tickets verified as of {BARANGAY_INFO.lastAuditDate}
          </p>
        </div>

        <div className="flex shrink-0 gap-1 rounded-2xl border border-border bg-card p-1 text-xs font-mono shadow-sm">
          {(["impact", "recent"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={cn(
                "rounded-xl px-3.5 py-1.5 font-bold capitalize transition-all",
                sort === s ? "bg-sky-600 text-white shadow-md shadow-sky-600/25" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s === "impact" ? "Impact Priority" : "Most Recent"}
            </button>
          ))}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 surface-card p-4 border border-border/80 bg-card rounded-3xl shadow-md">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tickets by code, title, street, or purok..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-border bg-surface-2 pl-10 pr-4 py-2 text-xs font-medium text-foreground outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedCat("All")}
            className={cn(
              "px-3 py-1.5 text-xs font-bold rounded-xl transition-all",
              selectedCat === "All"
                ? "bg-sky-600 text-white shadow-sm"
                : "bg-surface-2 text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedCat(c.name)}
              className={cn(
                "px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all hidden md:inline-flex items-center gap-1",
                selectedCat === c.name
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-surface-2 text-muted-foreground hover:text-foreground"
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
              <article key={i.id} className="surface-card overflow-hidden border border-border/80 rounded-3xl bg-card shadow-md transition-all">
                <button
                  onClick={() => setOpen(expanded ? null : i.id)}
                  className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5 text-left hover:bg-surface-2/40 transition-colors"
                  aria-expanded={expanded}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-sky-600">{i.code}</span>
                      <StatusPill status={i.status} />
                      {i.recurring && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-600">
                          <Repeat className="h-3 w-3" /> Recurring ×{i.recurring.count} /{" "}
                          {i.recurring.sinceMonths} mo
                        </span>
                      )}
                      {i.severity === "Critical" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 text-[10px] font-bold text-rose-600">
                          <ShieldAlert className="h-3 w-3" /> Emergency Dispatch
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 text-base font-extrabold text-foreground truncate">{i.title}</h2>
                    <p className="mt-1 truncate text-xs text-muted-foreground font-mono">
                      {i.category} · {i.street}, {i.purok} · {i.confirmations} resident confirmations · {i.households} households
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="hidden sm:block">
                      <ImpactMeter score={i.impact} />
                    </div>
                    <ChevronDown
                      className={cn("h-5 w-5 text-slate-400 transition-transform duration-200", expanded && "rotate-180")}
                    />
                  </div>
                </button>

                <div className="px-5 pb-4">
                  <LifecycleTrack status={i.status} compact />
                </div>

                {expanded && (
                  <div className="grid gap-6 border-t border-border p-5 lg:grid-cols-[1.2fr_1fr] bg-surface-2/30 animate-in fade-in duration-200">
                    <div>
                      <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed bg-surface-2 p-3.5 rounded-2xl border border-border/80">
                        {i.summary}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs">
                        <SeverityTag severity={i.severity} />
                        <span className="text-muted-foreground">
                          Department: <strong className="text-foreground font-bold">{i.department}</strong>
                        </span>
                        <span className="text-muted-foreground">
                          Target: <strong className="text-foreground font-bold">{i.eta}</strong>
                        </span>
                      </div>
                      <ol className="mt-5 space-y-3.5 border-l-2 border-sky-500/30 pl-4 font-mono text-xs">
                        {i.timeline.map((e, k) => (
                          <li key={k} className="relative">
                            <span className="absolute top-1.5 -left-[21px] h-3 w-3 rounded-full bg-sky-500 ring-4 ring-card" />
                            <p className="font-bold text-foreground">{e.status}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {e.at} · {e.by}
                            </p>
                            <p className="text-xs text-foreground/80 mt-0.5 leading-relaxed">{e.note}</p>
                          </li>
                        ))}
                      </ol>
                      <p className="mt-5 rounded-2xl bg-sky-500/10 border border-sky-500/20 p-3.5 text-xs text-sky-950 dark:text-sky-100 font-mono">
                        <span className="font-bold">Next Scheduled Action: </span>
                        {i.nextAction}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {i.proof ? (
                        <div>
                          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                            Inspectable Proof of Work
                          </p>
                          <BeforeAfter before={i.proof.before} after={i.proof.after} />
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-border p-4 text-xs text-muted-foreground font-mono">
                          Inspectable photo proof is required before this issue can be closed by resident vote.
                        </div>
                      )}
                      <div className="rounded-2xl border border-border p-4 bg-card shadow-sm">
                        <p className="text-xs font-bold text-foreground">
                          Resident Verification Status
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {i.status === "Resident Verified"
                            ? "Closed permanently by resident verification votes."
                            : "Requires local resident confirmation votes in Balibago to verify physical resolution."}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => confirmIssue(i.id)}
                            className="gap-1.5 text-xs font-bold rounded-xl border-border hover:bg-surface-2"
                          >
                            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Confirm Affected Resident (
                            {i.confirmations})
                          </Button>
                          {i.status !== "Resident Verified" && (
                            <Button
                              size="sm"
                              className="text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white"
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
        <div className="surface-card p-12 text-center border border-border rounded-3xl bg-card">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-surface-2 text-muted-foreground mx-auto mb-4 border border-border">
            <Inbox className="h-7 w-7 text-sky-500" />
          </span>
          <h3 className="text-base font-bold text-foreground">No active reports match filter</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Try resetting your search query or category filters to view active tickets.
          </p>
        </div>
      )}
    </div>
  );
}
