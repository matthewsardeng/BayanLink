import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/api";
import { announcementKinds, labelFor } from "@/lib/taxonomy";
import { CategoryChip, OfficialBadge } from "@/components/badges";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/community/updates")({
  head: () => ({
    meta: [
      { title: "Official Updates & Advisories — Barangay Balibago" },
      {
        name: "description",
        content:
          "Official announcements, advisories and service interruption notices published by Barangay Balibago, Angeles City.",
      },
      { property: "og:title", content: "Official Updates — Barangay Balibago" },
      {
        property: "og:description",
        content: "Announcements and advisories published by Barangay Balibago.",
      },
    ],
  }),
  component: Updates,
});

function Updates() {
  const { data, isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data } = await supabase
        .from("announcements")
        .select("id, title, body, kind, published_at, created_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false, nullsFirst: false });
      return data ?? [];
    },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Official</p>
        <h1 className="mt-2 font-display text-4xl">Updates and advisories</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Published by authorised Barangay Balibago personnel through this platform.
        </p>
      </header>

      {isLoading ? (
        <Skeleton className="h-40 w-full rounded-lg" />
      ) : data && data.length > 0 ? (
        <div className="grid gap-4">
          {data.map((a) => (
            <article
              key={a.id}
              className="rounded-lg border border-official/35 bg-official-soft/25 p-6"
            >
              <div className="flex flex-wrap items-center gap-2">
                <OfficialBadge />
                <CategoryChip label={labelFor(announcementKinds, a.kind)} />
                <span className="ml-auto text-xs text-muted-foreground">
                  {formatDate(a.published_at ?? a.created_at)}
                </span>
              </div>
              <h2 className="mt-3 font-display text-2xl leading-snug">{a.title}</h2>
              <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">{a.body}</p>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Megaphone className="size-5" />}
          title="No announcements available at this time."
          description="Official announcements and advisories will appear here when published."
        />
      )}
    </div>
  );
}
