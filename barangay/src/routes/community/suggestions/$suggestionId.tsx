import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchAuthors, formatDate } from "@/lib/api";
import { labelFor, suggestionCategories, suggestionStatuses } from "@/lib/taxonomy";
import { CategoryChip, CommunityBadge, CommunityContentNotice, StatusPill } from "@/components/badges";
import { EmptyState } from "@/components/empty-state";
import { ReportDialog } from "@/components/report-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/community/suggestions/$suggestionId")({
  head: () => ({
    meta: [
      { title: "Suggestion — Barangay Balibago Community" },
      {
        name: "description",
        content:
          "A resident-submitted suggestion for Barangay Balibago, Angeles City, and its current review status.",
      },
      { property: "og:title", content: "Suggestion — Barangay Balibago" },
      {
        property: "og:description",
        content: "A resident suggestion for Barangay Balibago and its status.",
      },
    ],
  }),
  component: SuggestionDetail,
});

function SuggestionDetail() {
  const { suggestionId } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["suggestions", suggestionId],
    queryFn: async () => {
      const { data: s } = await supabase
        .from("suggestions")
        .select("id, author_id, title, description, category, status, location_label, created_at")
        .eq("id", suggestionId)
        .eq("content_status", "visible")
        .maybeSingle();
      if (!s) return null;
      const authors = await fetchAuthors([s.author_id]);
      return { s, author: authors[s.author_id] };
    },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        to="/community/suggestions"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All suggestions
      </Link>

      {isLoading ? (
        <Skeleton className="mt-6 h-56 w-full rounded-lg" />
      ) : !data ? (
        <EmptyState className="mt-6" title="This suggestion is no longer available." />
      ) : (
        <article className="mt-6 rounded-lg border border-border bg-card p-6">
          <div className="flex flex-wrap items-center gap-2">
            <CommunityBadge />
            <CategoryChip label={labelFor(suggestionCategories, data.s.category)} />
            <StatusPill status={data.s.status} label={labelFor(suggestionStatuses, data.s.status)} />
          </div>
          <h1 className="mt-4 font-display text-3xl leading-snug">{data.s.title}</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            {data.author?.full_name ?? "Resident"} · {formatDate(data.s.created_at)}
          </p>
          {data.s.location_label ? (
            <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" /> {data.s.location_label}
            </p>
          ) : null}
          <p className="mt-5 text-sm leading-relaxed whitespace-pre-wrap">{data.s.description}</p>

          <CommunityContentNotice className="mt-6" />

          <div className="mt-4">
            <ReportDialog entityType="suggestion" entityId={data.s.id} />
          </div>
        </article>
      )}
    </div>
  );
}
