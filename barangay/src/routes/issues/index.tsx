import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, TriangleAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { timeAgo } from "@/lib/api";
import { issueCategories, issueStatuses, labelFor } from "@/lib/taxonomy";
import { CategoryChip, CommunityContentNotice, StatusPill } from "@/components/badges";
import { CommunityMap } from "@/components/community-map";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/issues/")({
  head: () => ({
    meta: [
      { title: "Community Issue Reports — Barangay Balibago" },
      {
        name: "description",
        content:
          "Track community-reported issues in Barangay Balibago, Angeles City: flooding, road damage, drainage, garbage and streetlights, with live status updates.",
      },
      { property: "og:title", content: "Community Issue Reports — Barangay Balibago" },
      {
        property: "og:description",
        content: "Reported issues around Barangay Balibago and their current status.",
      },
    ],
  }),
  component: Issues,
});

function Issues() {
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["issues"],
    queryFn: async () => {
      const { data } = await supabase
        .from("issues")
        .select(
          "id, reference_no, title, category, status, location_label, latitude, longitude, created_at",
        )
        .eq("content_status", "visible")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const filtered = useMemo(
    () =>
      (data ?? []).filter(
        (i) => (status === "all" || i.status === status) && (category === "all" || i.category === category),
      ),
    [data, status, category],
  );

  const markers = filtered
    .filter((i) => i.latitude != null && i.longitude != null)
    .map((i) => ({
      id: i.id,
      lat: i.latitude as number,
      lng: i.longitude as number,
      label: i.title,
      status: i.status,
    }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Community reports
          </p>
          <h1 className="mt-2 font-display text-4xl">Issue reports</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Issues reported by residents, each with a reference number and a transparent status
            timeline.
          </p>
        </div>
        <Button asChild>
          <Link to="/issues/new">Report an Issue</Link>
        </Button>
      </header>

      <CommunityContentNotice className="mb-6" />

      <CommunityMap markers={markers} height={340} className="mb-8" />

      <div className="mb-6 grid gap-3">
        <div className="flex flex-wrap gap-2">
          {[{ value: "all", label: "All statuses" }, ...issueStatuses].map((s) => (
            <Button
              key={s.value}
              size="sm"
              variant={status === s.value ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setStatus(s.value)}
            >
              {s.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {[{ value: "all", label: "All categories" }, ...issueCategories].map((c) => (
            <Button
              key={c.value}
              size="sm"
              variant={category === c.value ? "secondary" : "ghost"}
              className="rounded-full"
              onClick={() => setCategory(c.value)}
            >
              {c.label}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-40 w-full rounded-lg" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<TriangleAlert className="size-5" />}
          title="No issues match this filter."
          description="Try a different status or category, or report a new issue."
          action={
            <Button asChild>
              <Link to="/issues/new">Report an Issue</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3">
          {filtered.map((i) => (
            <Link
              key={i.id}
              to="/issues/$issueId"
              params={{ issueId: i.id }}
              className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill status={i.status} label={labelFor(issueStatuses, i.status)} />
                <CategoryChip label={labelFor(issueCategories, i.category)} />
                <span className="ml-auto font-mono text-xs text-muted-foreground">
                  {i.reference_no}
                </span>
              </div>
              <h2 className="mt-3 font-display text-lg leading-snug">{i.title}</h2>
              <p className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3" /> {i.location_label}
                </span>
                <span>{timeAgo(i.created_at)}</span>
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
