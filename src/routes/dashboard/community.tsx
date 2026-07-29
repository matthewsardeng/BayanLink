import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BADGES, BARANGAY_INFO, PUROKS, type FeedItem } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShieldCheck, Users, CheckCircle2, Inbox, Vote, MessageSquare, Plus, X } from "lucide-react";

export const Route = createFileRoute("/dashboard/community")({
  head: () => ({
    meta: [
      { title: "Barangay Balibago Community Desk — BayanLink" },
      {
        name: "description",
        content:
          "Live Barangay Balibago activity feed, resident-voted community proposals, and participation recognition.",
      },
      { property: "og:title", content: "Barangay Balibago Community Desk — BayanLink" },
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
  const { feed: storeFeed, proposals, voteProposal, addProposal } = useBayanStore();
  const { user } = useAuth();
  const [kind, setKind] = useState<(typeof KINDS)[number]>("All");
  const [votedLocal, setVotedLocal] = useState<string[]>([]);

  // Proposal Submission Modal State
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [title, setTitle] = useState("");
  const [blurb, setBlurb] = useState("");
  const [selectedPurok, setSelectedPurok] = useState(user?.purok || PUROKS[0]);
  const [goal, setGoal] = useState(100);

  const feed = storeFeed.filter((f) => kind === "All" || f.kind === kind);

  const handleVote = (id: string) => {
    if (!votedLocal.includes(id)) {
      setVotedLocal((prev) => [...prev, id]);
      voteProposal(id);
    }
  };

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !blurb) return;
    await addProposal({
      title,
      purok: selectedPurok,
      blurb,
      goal: Number(goal) || 100,
    });
    setTitle("");
    setBlurb("");
    setShowProposalModal(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Standardized Header */}
      <div className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-zinc-500 font-semibold uppercase tracking-wider">
              Community Participation & Stream
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
              Barangay Balibago Community Desk
            </h1>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              Live stream feed for {BARANGAY_INFO.name}, community proposals, and resident engagement.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => setShowProposalModal(true)}
            className="rounded-full text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white px-4"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Propose Initiative
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <section className="surface-card p-5 border border-zinc-200 rounded-3xl bg-white shadow-sm">
          <div className="flex flex-wrap gap-2 pb-4 border-b border-zinc-200">
            {KINDS.map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all font-mono",
                  kind === k
                    ? "border-transparent bg-zinc-900 text-white"
                    : "border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600"
                )}
              >
                {k}
              </button>
            ))}
          </div>

          {feed.length > 0 ? (
            <ul className="mt-4 space-y-3.5">
              {feed.map((f) => (
                <li key={f.id} className="rounded-2xl border border-zinc-200 p-4 bg-zinc-50/50 space-y-2">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 font-bold uppercase",
                        f.kind === "Alerts"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-zinc-200 text-zinc-800"
                      )}
                    >
                      {f.kind}
                    </span>
                    <span className="text-zinc-500">
                      {f.time} · {f.distance}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-zinc-900">{f.title}</p>
                  <p className="text-xs text-zinc-600 leading-relaxed">{f.detail}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-12 text-center text-xs text-zinc-500 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 mt-4 p-6">
              <MessageSquare className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
              <p className="font-bold text-zinc-900">No activity logs for this filter</p>
              <p className="mt-1 max-w-xs mx-auto">
                Submitting a public concern or community update will populate real-time activity logs here.
              </p>
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="surface-card p-5 border border-zinc-200 rounded-3xl bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
              <div>
                <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Vote className="h-4 w-4 text-zinc-900" /> Balibago Community Proposals
                </h2>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">
                  Resident-submitted initiatives for neighborhood voting.
                </p>
              </div>
            </div>

            {proposals.length > 0 ? (
              <ul className="space-y-4">
                {proposals.map((p) => {
                  const hasVoted = votedLocal.includes(p.id);
                  return (
                    <li key={p.id} className="rounded-2xl border border-zinc-200 p-4 bg-zinc-50/50 space-y-3">
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-zinc-900">{p.title}</p>
                          <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                            {p.purok} · {p.blurb}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant={hasVoted ? "secondary" : "default"}
                          disabled={hasVoted}
                          className={cn("text-xs font-semibold rounded-full", !hasVoted && "bg-zinc-900 hover:bg-zinc-800 text-white")}
                          onClick={() => handleVote(p.id)}
                        >
                          {hasVoted ? "Voted" : "Vote"}
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200">
                          <div
                            className="h-full rounded-full bg-zinc-900 transition-all"
                            style={{ width: `${Math.min(100, (p.votes / p.goal) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs tabular-nums font-bold text-zinc-900">
                          {p.votes} / {p.goal}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="py-8 text-center text-xs text-zinc-500 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 p-6">
                <Inbox className="h-6 w-6 text-zinc-400 mx-auto mb-2" />
                <p className="font-bold text-zinc-900">No active community proposals</p>
                <p className="mt-1">
                  Resident initiatives submitted for neighborhood voting will be listed here.
                </p>
              </div>
            )}
          </section>

          <section className="surface-card p-5 border border-zinc-200 rounded-3xl bg-white shadow-sm">
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Civic Recognition Badges
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-0.5 mb-4">
              Recognizing active citizen participation in Barangay Balibago.
            </p>
            <ul className="grid gap-3 sm:grid-cols-1">
              {BADGES.map((b) => (
                <li
                  key={b.name}
                  className="rounded-2xl border border-zinc-200 p-3.5 bg-zinc-50/50 flex items-start gap-3"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-white border border-zinc-200 text-zinc-900 shrink-0 shadow-sm">
                    {b.name.includes("Reporter") ? (
                      <ShieldCheck className="h-4 w-4 text-zinc-900" />
                    ) : b.name.includes("Inspector") ? (
                      <Users className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-amber-600" />
                    )}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">{b.name}</p>
                    <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">{b.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Proposal Submission Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="surface-card w-full max-w-md p-6 border border-zinc-200 bg-white rounded-3xl shadow-xl space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-base font-bold text-zinc-900">Submit Community Proposal</h3>
              <button
                onClick={() => setShowProposalModal(false)}
                className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleProposalSubmit} className="space-y-3.5">
              <div>
                <label className="block font-bold text-zinc-500 uppercase tracking-wider text-[10px] mb-1">
                  Proposal Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Solar Streetlight Installation along MacArthur Corridor"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 font-medium outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-500 uppercase tracking-wider text-[10px] mb-1">
                  Balibago Zone / Purok
                </label>
                <select
                  value={selectedPurok}
                  onChange={(e) => setSelectedPurok(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 font-medium outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900"
                >
                  {PUROKS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-500 uppercase tracking-wider text-[10px] mb-1">
                  Short Description & Community Benefit
                </label>
                <textarea
                  rows={3}
                  required
                  value={blurb}
                  onChange={(e) => setBlurb(e.target.value)}
                  placeholder="Explain why this proposal will benefit residents in this area..."
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 font-medium outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-500 uppercase tracking-wider text-[10px] mb-1">
                  Target Resident Votes Goal
                </label>
                <input
                  type="number"
                  min={10}
                  max={1000}
                  value={goal}
                  onChange={(e) => setGoal(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 font-medium outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900"
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-white text-xs"
              >
                Launch Proposal Vote Campaign
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
