import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MessagesSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchAuthors } from "@/lib/api";
import { postCategories, labelFor, type PostCategory } from "@/lib/taxonomy";
import { PostCard, type PostRow } from "@/components/post-card";
import { PostComposer } from "@/components/post-composer";
import { EmptyState } from "@/components/empty-state";
import { CommunityContentNotice } from "@/components/badges";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/community/")({
  head: () => ({
    meta: [
      { title: "Community Feed — Barangay Balibago" },
      {
        name: "description",
        content:
          "Updates, questions and discussions shared by residents of Barangay Balibago, Angeles City, alongside official barangay posts.",
      },
      { property: "og:title", content: "Community Feed — Barangay Balibago" },
      {
        property: "og:description",
        content: "Resident discussions and official posts from Barangay Balibago.",
      },
    ],
  }),
  component: CommunityFeed,
});

function CommunityFeed() {
  const [category, setCategory] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["feed", category],
    queryFn: async () => {
      let q = supabase
        .from("posts")
        .select("id, author_id, category, content, image_url, location_label, is_official, created_at")
        .eq("status", "visible")
        .order("created_at", { ascending: false })
        .limit(50);
      if (category !== "all") q = q.eq("category", category as PostCategory);
      const { data: posts, error } = await q;
      if (error) throw error;
      const ids = (posts ?? []).map((p) => p.id);
      const [authors, reactions, comments] = await Promise.all([
        fetchAuthors((posts ?? []).map((p) => p.author_id)),
        ids.length
          ? supabase.from("post_reactions").select("post_id, user_id").in("post_id", ids)
          : Promise.resolve({ data: [] as Array<{ post_id: string; user_id: string }> }),
        ids.length
          ? supabase.from("comments").select("post_id").in("post_id", ids).eq("status", "visible")
          : Promise.resolve({ data: [] as Array<{ post_id: string }> }),
      ]);
      const { data: me } = await supabase.auth.getUser();
      const counts: Record<string, number> = {};
      const mine = new Set<string>();
      for (const r of reactions.data ?? []) {
        counts[r.post_id] = (counts[r.post_id] ?? 0) + 1;
        if (me.user && r.user_id === me.user.id) mine.add(r.post_id);
      }
      const commentCounts: Record<string, number> = {};
      for (const c of comments.data ?? []) commentCounts[c.post_id] = (commentCounts[c.post_id] ?? 0) + 1;
      return { posts: (posts ?? []) as PostRow[], authors, counts, mine, commentCounts };
    },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Community</p>
        <h1 className="mt-2 font-display text-4xl">Community feed</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Posts written by residents of Barangay Balibago. Official barangay posts are clearly
          marked.
        </p>
        <CommunityContentNotice className="mt-4" />
      </header>

      <PostComposer />

      <div className="mt-8 flex flex-wrap gap-2">
        {[{ value: "all", label: "All" }, ...postCategories].map((c) => (
          <Button
            key={c.value}
            size="sm"
            variant={category === c.value ? "default" : "outline"}
            className={cn("rounded-full")}
            onClick={() => setCategory(c.value)}
          >
            {c.label}
          </Button>
        ))}
      </div>

      <div className="mt-6 grid gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </>
        ) : (data?.posts.length ?? 0) === 0 ? (
          <EmptyState
            icon={<MessagesSquare className="size-5" />}
            title={
              category === "all"
                ? "No community posts yet."
                : `No posts in ${labelFor(postCategories, category)} yet.`
            }
            description="Start the conversation — share an update, question or concern."
          />
        ) : (
          data?.posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              author={data.authors[p.author_id]}
              reactionCount={data.counts[p.id] ?? 0}
              reacted={data.mine.has(p.id)}
              commentCount={data.commentCounts[p.id] ?? 0}
            />
          ))
        )}
      </div>
    </div>
  );
}
