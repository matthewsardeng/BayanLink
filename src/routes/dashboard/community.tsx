import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BADGES, BARANGAY_INFO, type FeedItem } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShieldCheck, Users, CheckCircle2, Inbox, Radio, Vote } from "lucide-react";

export const Route = createFileRoute("/dashboard/community")({
  head: () => ({
    meta: [
      { title: "Barangay Balibago Community Feed — BayanLink" },
      {
        name: "description",
        content:
          "Live Barangay Balibago activity feed, resident-voted community proposals, and participation recognition.",
      },
      { property: "og:title", content: "Barangay Balibago Community Feed — BayanLink" },
      {
        property: "og:description",
        content:
          "Live activity, resident-voted proposals and civic recognition for Barangay Balibago.",
      },
    ],
  }),
  component: Community,
});

const KINDS: (FeedItem["kind"] | "All")[] = [
  "All",
  "Issues",
  "Services",
  "Events",
  "Announcements",
  "Alerts",
];

function Community() {
  const { feed: storeFeed, proposals, voteProposal } = useBayanStore();
  const [kind, setKind] = useState<(typeof KINDS)[number]>("All");
  const [votedLocal, setVotedLocal] = useState<string[]>([]);

  const feed = storeFeed.filter((f) => kind === "All" || f.kind === kind);

  const handleVote = (id: string) => {
    if (!votedLocal.includes(id)) {
      setVotedLocal((prev) => [...prev, id]);
      voteProposal(id);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-extrabold sm:text-3xl tracking-tight text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-sky-500" /> Barangay Balibago Community Desk
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-mono mt-1">
          Live stream feed for {BARANGAY_INFO.name}, community proposals, and resident engagement.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <section className="surface-card p-5 border border-border/80 rounded-3xl bg-card shadow-xl">
          <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
            {KINDS.map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={cn(
                  "rounded-xl border px-3 py-1.5 text-xs font-bold transition-all font-mono",
                  kind === k
                    ? "border-transparent bg-sky-600 text-white shadow-md shadow-sky-600/25"
                    : "border-border bg-surface-2 hover:bg-surface-2/80 text-muted-foreground"
                )}
              >
                {k}
              </button>
            ))}
          </div>

          {feed.length > 0 ? (
            <ul className="mt-4 space-y-3.5">
              {feed.map((f) => (
                <li key={f.id} className="rounded-2xl border border-border/80 p-4 bg-surface-2/40 space-y-2">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 font-bold uppercase",
                        f.kind === "Alerts"
                          ? "bg-rose-500/15 text-rose-600 border border-rose-500/20"
                          : "bg-sky-500/10 text-sky-600 border border-sky-500/20"
                      )}
                    >
                      {f.kind}
                    </span>
                    <span className="text-muted-foreground">
                      {f.time} · {f.distance}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground">{f.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.detail}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-12 text-center text-xs text-muted-foreground">
              <Inbox className="h-8 w-8 text-sky-500 mx-auto mb-2 opacity-60" />
              <p className="font-bold text-foreground">No activity logs recorded yet</p>
              <p className="mt-1">
                Submitting a public report will generate real-time stream logs here.
              </p>
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="surface-card p-5 border border-border/80 rounded-3xl bg-card shadow-xl">
            <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <Vote className="h-4.5 w-4.5 text-sky-500" /> Balibago Community Proposals
            </h2>
            <p className="text-xs text-muted-foreground font-mono mt-0.5 mb-4">
              Resident-submitted initiatives for neighborhood voting.
            </p>
            {proposals.length > 0 ? (
              <ul className="space-y-4">
                {proposals.map((p) => {
                  const hasVoted = votedLocal.includes(p.id);
                  return (
                    <li key={p.id} className="rounded-2xl border border-border/80 p-4 bg-surface-2/40 space-y-3">
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-foreground">{p.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {p.purok} · {p.blurb}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant={hasVoted ? "secondary" : "default"}
                          disabled={hasVoted}
                          className={cn("text-xs font-bold rounded-xl", !hasVoted && "bg-sky-600 hover:bg-sky-500 text-white")}
                          onClick={() => handleVote(p.id)}
                        >
                          {hasVoted ? "Voted" : "Vote"}
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                          <div
                            className="h-full rounded-full bg-sky-500 transition-all"
                            style={{ width: `${Math.min(100, (p.votes / p.goal) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs tabular-nums font-bold text-sky-600">
                          {p.votes} / {p.goal}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground">
                <p className="font-bold">No active community proposals</p>
                <p className="mt-1">
                  Resident initiatives submitted for neighborhood voting will be listed here.
                </p>
              </div>
            )}
          </section>

          <section className="surface-card p-5 border border-border/80 rounded-3xl bg-card shadow-xl">
            <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" /> Civic Recognition Badges
            </h2>
            <p className="text-xs text-muted-foreground font-mono mt-0.5 mb-4">
              Recognizing active citizen participation in Barangay Balibago.
            </p>
            <ul className="grid gap-3 sm:grid-cols-1">
              {BADGES.map((b) => (
                <li
                  key={b.name}
                  className="rounded-2xl border border-border/80 p-3.5 bg-surface-2/30 flex items-start gap-3"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-500/10 text-sky-600 shrink-0 border border-sky-500/20">
                    {b.name.includes("Reporter") ? (
                      <ShieldCheck className="h-4.5 w-4.5 text-sky-500" />
                    ) : b.name.includes("Inspector") ? (
                      <Users className="h-4.5 w-4.5 text-emerald-500" />
                    ) : (
                      <CheckCircle2 className="h-4.5 w-4.5 text-amber-500" />
                    )}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-foreground">{b.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{b.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
