import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Heart, MapPin, MessageCircle, Pencil, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { fetchAuthors, initials, timeAgo } from "@/lib/api";
import { labelFor, postCategories } from "@/lib/taxonomy";
import { CategoryChip, CommunityBadge, OfficialBadge } from "@/components/badges";
import { ReportDialog } from "@/components/report-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type PostRow = {
  id: string;
  author_id: string;
  category: string;
  content: string;
  image_url: string | null;
  location_label: string | null;
  is_official: boolean;
  created_at: string;
};

export function PostCard({
  post,
  author,
  reactionCount,
  reacted,
  commentCount,
}: {
  post: PostRow;
  author?: { full_name: string; avatar_url: string | null };
  reactionCount: number;
  reacted: boolean;
  commentCount: number;
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.content);

  const displayName = post.is_official ? "Barangay Balibago Official" : (author?.full_name ?? "Resident");

  const react = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in to react to posts.");
      if (reacted) {
        await supabase.from("post_reactions").delete().eq("post_id", post.id).eq("user_id", user.id);
      } else {
        await supabase.from("post_reactions").insert({ post_id: post.id, user_id: user.id });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feed"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("posts").update({ content: draft }).eq("id", post.id);
      if (error) throw error;
    },
    onSuccess: () => {
      setEditing(false);
      toast.success("Post updated.");
      qc.invalidateQueries({ queryKey: ["feed"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("posts").delete().eq("id", post.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Post deleted.");
      qc.invalidateQueries({ queryKey: ["feed"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <article
      className={cn(
        "rounded-lg border bg-card p-5 shadow-soft transition-shadow hover:shadow-lift",
        post.is_official ? "border-official/35 bg-official-soft/25" : "border-border",
      )}
    >
      <header className="flex items-start gap-3">
        <Avatar className="size-10">
          <AvatarFallback
            className={cn(
              post.is_official ? "bg-official text-official-foreground" : "bg-secondary",
            )}
          >
            {post.is_official ? "B" : initials(displayName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{displayName}</span>
            {post.is_official ? <OfficialBadge /> : <CommunityBadge />}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <time dateTime={post.created_at}>{timeAgo(post.created_at)}</time>
            <span aria-hidden>·</span>
            <CategoryChip label={labelFor(postCategories, post.category)} />
            {post.location_label ? (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" /> {post.location_label}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      {editing ? (
        <div className="mt-4 grid gap-2">
          <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={4} />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => save.mutate()} disabled={save.isPending}>
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-[15px] leading-relaxed whitespace-pre-wrap text-foreground">
          {post.content}
        </p>
      )}

      {post.image_url ? (
        <img
          src={post.image_url}
          alt=""
          loading="lazy"
          className="mt-4 max-h-96 w-full rounded-md border border-border object-cover"
        />
      ) : null}

      <footer className="mt-4 flex flex-wrap items-center gap-1 border-t border-border pt-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => react.mutate()}
          className={cn(reacted && "text-accent")}
        >
          <Heart className={cn("size-4", reacted && "fill-current")} />
          {reactionCount > 0 ? reactionCount : ""} Support
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowComments((v) => !v)}>
          <MessageCircle className="size-4" />
          {commentCount > 0 ? commentCount : ""} Comment
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = `${window.location.origin}/community/${post.id}`;
            void navigator.clipboard?.writeText(url);
            toast.success("Link copied.");
          }}
        >
          <Share2 className="size-4" /> Share
        </Button>
        <div className="ml-auto flex items-center gap-1">
          {user?.id === post.author_id ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => setEditing((v) => !v)}>
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => remove.mutate()}
              >
                <Trash2 className="size-4" />
              </Button>
            </>
          ) : (
            <ReportDialog entityType="post" entityId={post.id} />
          )}
        </div>
      </footer>

      {showComments ? <Comments postId={post.id} /> : null}

      {post.is_official ? null : (
        <p className="mt-3 text-[11px] text-muted-foreground">
          Posted by a resident.{" "}
          <Link to="/community" className="underline">
            Not an official barangay announcement.
          </Link>
        </p>
      )}
    </article>
  );
}

function Comments({ postId }: { postId: string }) {
  const { user, isStaff } = useAuth();
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [asOfficial, setAsOfficial] = useState(false);

  const { data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data: rows } = await supabase
        .from("comments")
        .select("id, author_id, content, is_official, created_at")
        .eq("post_id", postId)
        .eq("status", "visible")
        .order("created_at", { ascending: true });
      const authors = await fetchAuthors((rows ?? []).map((r) => r.author_id));
      return { rows: rows ?? [], authors };
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in to comment.");
      const { error } = await supabase.from("comments").insert({
        post_id: postId,
        author_id: user.id,
        content: text.trim(),
        is_official: asOfficial && isStaff,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setText("");
      qc.invalidateQueries({ queryKey: ["comments", postId] });
      qc.invalidateQueries({ queryKey: ["feed"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mt-4 space-y-4 border-t border-border pt-4">
      {(data?.rows.length ?? 0) === 0 ? (
        <p className="text-sm text-muted-foreground">No comments yet.</p>
      ) : (
        data?.rows.map((c) => (
          <div key={c.id} className="flex gap-3">
            <Avatar className="size-8">
              <AvatarFallback
                className={cn(
                  "text-xs",
                  c.is_official && "bg-official text-official-foreground",
                )}
              >
                {c.is_official ? "B" : initials(data.authors[c.author_id]?.full_name ?? "R")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 rounded-md bg-secondary/70 px-3 py-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold">
                  {c.is_official
                    ? "Barangay Balibago Official"
                    : (data.authors[c.author_id]?.full_name ?? "Resident")}
                </span>
                {c.is_official ? <OfficialBadge /> : null}
                <span className="text-[11px] text-muted-foreground">{timeAgo(c.created_at)}</span>
              </div>
              <p className="mt-1 text-sm whitespace-pre-wrap">{c.content}</p>
              <div className="mt-1">
                <ReportDialog entityType="comment" entityId={c.id} label="Report comment" />
              </div>
            </div>
          </div>
        ))
      )}

      {user ? (
        <div className="grid gap-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            placeholder="Write a comment…"
          />
          <div className="flex items-center gap-3">
            <Button size="sm" disabled={!text.trim() || add.isPending} onClick={() => add.mutate()}>
              Comment
            </Button>
            {isStaff ? (
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={asOfficial}
                  onChange={(e) => setAsOfficial(e.target.checked)}
                />
                Reply as Barangay Balibago Official
              </label>
            ) : null}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          <Link to="/auth" search={{}} className="font-medium text-primary underline">
            Sign in
          </Link>{" "}
          to join the discussion.
        </p>
      )}
    </div>
  );
}
