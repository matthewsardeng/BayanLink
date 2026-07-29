import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { barangay } from "@/lib/barangay";
import { issueCategories } from "@/lib/taxonomy";
import { CommunityMap } from "@/components/community-map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/issues/new")({
  head: () => ({
    meta: [
      { title: "Report a Community Issue — Barangay Balibago" },
      {
        name: "description",
        content:
          "Report flooding, road damage, drainage, garbage or streetlight problems in Barangay Balibago, Angeles City and track the response.",
      },
      { property: "og:title", content: "Report a Community Issue — Barangay Balibago" },
      {
        property: "og:description",
        content: "Submit a community issue report for Barangay Balibago and track its status.",
      },
    ],
  }),
  component: NewIssue,
});

function NewIssue() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("road_damage");
  const [locationLabel, setLocationLabel] = useState("");
  const [point, setPoint] = useState<{ lat: number; lng: number } | null>(null);

  const submit = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in to report an issue.");
      if (title.trim().length < 6) throw new Error("Give the issue a clear, short title.");
      if (description.trim().length < 20) throw new Error("Please describe the issue in more detail.");
      if (!locationLabel.trim()) throw new Error("Add a street, purok or landmark.");
      const { data, error } = await supabase
        .from("issues")
        .insert({
          reporter_id: user.id,
          title: title.trim(),
          description: description.trim(),
          category,
          location_label: locationLabel.trim(),
          latitude: point?.lat ?? null,
          longitude: point?.lng ?? null,
        })
        .select("id, reference_no")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Report submitted — reference ${data.reference_no}`);
      void navigate({ to: "/issues/$issueId", params: { issueId: data.id } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Community reports
        </p>
        <h1 className="mt-2 font-display text-4xl">Report an issue</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Reports are visible to the community and to barangay staff on this platform. For
          emergencies, call the barangay hotline at {barangay.contact.hotline} instead.
        </p>
      </header>

      {!user ? (
        <div className="rounded-lg border border-border bg-card p-6 text-sm">
          <Link to="/auth" search={{ next: "/issues/new" }} className="text-primary underline">
            Sign in
          </Link>{" "}
          to submit a report so you can track its status.
        </div>
      ) : (
        <div className="grid gap-5 rounded-lg border border-border bg-card p-6">
          <div className="grid gap-1.5">
            <Label htmlFor="i-title">Title</Label>
            <Input
              id="i-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep pothole along the main road"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {issueCategories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="i-loc">Street, purok or landmark</Label>
              <Input
                id="i-loc"
                value={locationLabel}
                onChange={(e) => setLocationLabel(e.target.value)}
                placeholder="e.g. Near T. Aguas St."
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="i-desc">Description</Label>
            <Textarea
              id="i-desc"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is the problem, how long has it been there, and who does it affect?"
            />
          </div>

          <div className="grid gap-2">
            <Label>Pin the location (optional)</Label>
            <p className="text-xs text-muted-foreground">
              Click on the map to drop a pin. This helps the barangay find the exact spot.
            </p>
            <CommunityMap
              markers={
                point
                  ? [{ id: "new", lat: point.lat, lng: point.lng, label: title || "New report", status: "submitted", active: true }]
                  : []
              }
              height={280}
              onPick={(lat, lng) => setPoint({ lat, lng })}
            />
            {point ? (
              <p className="text-xs text-muted-foreground">
                Pinned at {point.lat.toFixed(5)}, {point.lng.toFixed(5)} ·{" "}
                <button className="underline" onClick={() => setPoint(null)}>
                  clear
                </button>
              </p>
            ) : null}
          </div>

          <div>
            <Button onClick={() => submit.mutate()} disabled={submit.isPending}>
              Submit report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
