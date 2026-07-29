import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchAuthors } from "@/lib/api";
import { PostCard, type PostRow } from "@/components/post-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/community/$postId")({
  head: () => ({
    meta: [
      { title: "Community Post — Barangay Balibago" },
      {
        name: "description",
        content:
          "Read a community post and its discussion from residents of Barangay Balibago, Angeles City.",
      },
      { property: "og:title", content: "Community Post — Barangay Balibago" },
      {
        property: "og:description",
        content: "A community post and discussion from Barangay Balibago residents.",
      },
    ],
  }),
  component: PostDetail,
});

function PostDetail() {
  const { postId } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["feed", "post", postId],
    queryFn: async () => {
      const { data: post } = await supabase
        .from("posts")
        .select("id, author_id, category, content, image_url, location_label, is_official, created_at")
        .eq("id", postId)
        .eq("status", "visible")
        .maybeSingle();
      if (!post) return null;
      const [authors, reactions, comments, me] = await Promise.all([
        fetchAuthors([post.author_id]),
        supabase.from("post_reactions").select("user_id").eq("post_id", postId),
        supabase.from("comments").select("id").eq("post_id", postId).eq("status", "visible"),
        supabase.auth.getUser(),
      ]);
      return {
        post: post as PostRow,
        author: authors[post.author_id],
        reactionCount: reactions.data?.length ?? 0,
        reacted: !!me.data.user && !!reactions.data?.some((r) => r.user_id === me.data.user!.id),
        commentCount: comments.data?.length ?? 0,
      };
    },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        to="/community"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to the feed
      </Link>
      <div className="mt-6">
        {isLoading ? (
          <Skeleton className="h-48 w-full rounded-lg" />
        ) : !data ? (
          <EmptyState
            title="This post is no longer available."
            description="It may have been removed by its author or by a moderator."
          />
        ) : (
          <PostCard
            post={data.post}
            author={data.author}
            reactionCount={data.reactionCount}
            reacted={data.reacted}
            commentCount={data.commentCount}
          />
        )}
      </div>
    </div>
  );
}
