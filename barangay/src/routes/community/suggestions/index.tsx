import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { fetchAuthors, timeAgo } from "@/lib/api";
import { labelFor, suggestionCategories, suggestionStatuses } from "@/lib/taxonomy";
import { CategoryChip, CommunityBadge, CommunityContentNotice, StatusPill } from "@/components/badges";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/community/suggestions/")({
  head: () => ({
    meta: [
      { title: "Community Suggestions — Barangay Balibago" },
      {
        name: "description",
        content:
          "Ideas and proposals submitted by residents of Barangay Balibago, Angeles City, with official barangay responses shown separately.",
      },
      { property: "og:title", content: "Community Suggestions — Barangay Balibago" },
      {
        property: "og:description",
        content: "Resident ideas and proposals for improving Barangay Balibago.",
      },
    ],
  }),
  component: Suggestions,
});

function Suggestions() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("public_spaces");
  const [locationLabel, setLocationLabel] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["suggestions"],
    queryFn: async () => {
      const { data } = await supabase
        .from("suggestions")
        .select("id, author_id, title, description, category, status, location_label, created_at")
        .eq("content_status", "visible")
        .order("created_at", { ascending: false });
      const authors = await fetchAuthors((data ?? []).map((s) => s.author_id));
      return { items: data ?? [], authors };
    },
  });

  const submit = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in to submit a suggestion.");
      if (title.trim().length < 6) throw new Error("Give your suggestion a clear title.");
      if (description.trim().length < 20)
        throw new Error("Please describe your suggestion in a little more detail.");
      const { error } = await supabase.from("suggestions").insert({
        author_id: user.id,
        title: title.trim(),
        description: description.trim(),
        category,
        location_label: locationLabel.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Suggestion submitted.");
      setTitle("");
      setDescription("");
      setLocationLabel("");
      void qc.invalidateQueries({ queryKey: ["suggestions"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Community</p>
        <h1 className="mt-2 font-display text-4xl">Suggestions</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Propose ideas that could improve Barangay Balibago. Suggestions are resident-submitted;
          any official response is labelled separately.
        </p>
        <CommunityContentNotice className="mt-4" />
      </header>

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-display text-xl">Share a suggestion</h2>
        {!user ? (
          <p className="mt-3 text-sm text-muted-foreground">
            <Link to="/auth" search={{ next: "/community/suggestions" }} className="text-primary underline">
              Sign in
            </Link>{" "}
            to submit a suggestion.
          </p>
        ) : (
          <div className="mt-5 grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="s-title">Title</Label>
              <Input
                id="s-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Add covered waiting area near the barangay hall"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="s-desc">Description</Label>
              <Textarea
                id="s-desc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What would you like to see, and why would it help?"
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
                    {suggestionCategories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="s-loc">Area (optional)</Label>
                <Input
                  id="s-loc"
                  value={locationLabel}
                  onChange={(e) => setLocationLabel(e.target.value)}
                  placeholder="e.g. Don Pepe Subdivision"
                />
              </div>
            </div>
            <div>
              <Button onClick={() => submit.mutate()} disabled={submit.isPending}>
                Submit suggestion
              </Button>
            </div>
          </div>
        )}
      </section>

      <div className="mt-10 grid gap-4">
        {isLoading ? (
          <Skeleton className="h-32 w-full rounded-lg" />
        ) : (data?.items.length ?? 0) === 0 ? (
          <EmptyState
            icon={<Lightbulb className="size-5" />}
            title="No suggestions yet."
            description="Be the first resident to propose an idea."
          />
        ) : (
          data?.items.map((s) => (
            <Link
              key={s.id}
              to="/community/suggestions/$suggestionId"
              params={{ suggestionId: s.id }}
              className="rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-lift"
            >
              <div className="flex flex-wrap items-center gap-2">
                <CommunityBadge />
                <CategoryChip label={labelFor(suggestionCategories, s.category)} />
                <StatusPill status={s.status} label={labelFor(suggestionStatuses, s.status)} />
              </div>
              <h3 className="mt-3 font-display text-lg leading-snug">{s.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{s.description}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {data.authors[s.author_id]?.full_name ?? "Resident"} · {timeAgo(s.created_at)}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
