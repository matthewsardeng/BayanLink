import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { barangay } from "@/lib/barangay";
import { CommunityMap } from "@/components/community-map";
import { CommunityContentNotice } from "@/components/badges";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Community Map — Barangay Balibago" },
      {
        name: "description",
        content:
          "Map of community-reported issues across Barangay Balibago, Angeles City, plotted on OpenStreetMap.",
      },
      { property: "og:title", content: "Community Map — Barangay Balibago" },
      {
        property: "og:description",
        content: "See where residents are reporting issues around Barangay Balibago.",
      },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ["map-issues"],
    queryFn: async () => {
      const { data } = await supabase
        .from("issues")
        .select("id, title, status, latitude, longitude")
        .eq("content_status", "visible")
        .not("latitude", "is", null);
      return data ?? [];
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Community</p>
        <h1 className="mt-2 font-display text-4xl">Community map</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Issues reported by residents across {barangay.name}. Select a pin to open the full report.
        </p>
      </header>
      <CommunityContentNotice className="mb-6" />
      <CommunityMap
        height={520}
        markers={(data ?? []).map((i) => ({
          id: i.id,
          lat: i.latitude as number,
          lng: i.longitude as number,
          label: i.title,
          status: i.status,
        }))}
        onSelect={(id) => void navigate({ to: "/issues/$issueId", params: { issueId: id } })}
      />
    </div>
  );
}
