import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MapPin } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { fetchAuthors, formatDate } from "@/lib/api";
import { issueCategories, issueStatuses, labelFor } from "@/lib/taxonomy";
import {
  CategoryChip,
  CommunityBadge,
  CommunityContentNotice,
  OfficialBadge,
  StatusPill,
} from "@/components/badges";
import { CommunityMap } from "@/components/community-map";
import { EmptyState } from "@/components/empty-state";
import { ReportDialog } from "@/components/report-dialog";
import { Button } from "@/components/ui/button";
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

export const Route = createFileRoute("/issues/$issueId")({
  head: () => ({
    meta: [
      { title: "Issue Report — Barangay Balibago" },
      {
        name: "description",
        content:
          "View a community-reported issue in Barangay Balibago, Angeles City, including its location and full status timeline.",
      },
      { property: "og:title", content: "Issue Report — Barangay Balibago" },
      {
        property: "og:description",
        content: "A community issue report in Barangay Balibago with its status timeline.",
      },
    ],
  }),
  component: IssueDetail,
});

function IssueDetail() {
  const { issueId } = Route.useParams();
  const { user, isStaff } = useAuth();
  const qc = useQueryClient();
  const [status, setStatus] = useState<string>("");
  const [note, setNote] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["issues", issueId],
    queryFn: async () => {
      const { data: issue } = await supabase
        .from("issues")
        .select("*")
        .eq("id", issueId)
        .eq("content_status", "visible")
        .maybeSingle();
      if (!issue) return null;
      const { data: updates } = await supabase
        .from("issue_updates")
        .select("id, author_id, note, status, is_official, created_at")
        .eq("issue_id", issueId)
        .order("created_at", { ascending: true });
      const authors = await fetchAuthors([
        issue.reporter_id,
        ...(updates ?? []).map((u) => u.author_id),
      ]);
      return { issue, updates: updates ?? [], authors };
    },
  });

  const addUpdate = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in first.");
      const next = status || data?.issue.status;
      if (!next) throw new Error("Choose a status.");
      const { error } = await supabase.from("issue_updates").insert({
        issue_id: issueId,
        author_id: user.id,
        status: next as (typeof issueStatuses)[number]["value"],
        note: note.trim() || null,
        is_official: isStaff,
      });
      if (error) throw error;
      if (isStaff) {
        await supabase
          .from("issues")
          .update({ status: next as (typeof issueStatuses)[number]["value"] })
          .eq("id", issueId);
      }
    },
    onSuccess: () => {
      toast.success("Update posted.");
      setNote("");
      void qc.invalidateQueries({ queryKey: ["issues"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-12"><Skeleton className="h-72 w-full rounded-lg" /></div>;
  if (!data)
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <EmptyState title="This report is no longer available." />
      </div>
    );

  const { issue, updates, authors } = data;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        to="/issues"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All issues
      </Link>

      <article className="mt-6 rounded-lg border border-border bg-card p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill status={issue.status} label={labelFor(issueStatuses, issue.status)} />
          <CategoryChip label={labelFor(issueCategories, issue.category)} />
          <span className="ml-auto font-mono text-xs text-muted-foreground">
            {issue.reference_no}
          </span>
        </div>
        <h1 className="mt-4 font-display text-3xl leading-snug">{issue.title}</h1>
        <p className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3" /> {issue.location_label}
          </span>
          <span>
            Reported by {authors[issue.reporter_id]?.full_name ?? "Resident"} ·{" "}
            {formatDate(issue.created_at)}
          </span>
        </p>
        <p className="mt-5 text-sm leading-relaxed whitespace-pre-wrap">{issue.description}</p>

        {issue.latitude != null && issue.longitude != null ? (
          <CommunityMap
            className="mt-6"
            height={260}
            markers={[
              {
                id: issue.id,
                lat: issue.latitude,
                lng: issue.longitude,
                label: issue.title,
                status: issue.status,
                active: true,
              },
            ]}
          />
        ) : null}

        <CommunityContentNotice className="mt-6" />
        <div className="mt-4">
          <ReportDialog entityType="issue" entityId={issue.id} />
        </div>
      </article>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Status timeline</h2>
        <ol className="mt-5 grid gap-4 border-l border-border pl-5">
          <li className="relative">
            <span className="absolute top-1.5 -left-[23px] size-2.5 rounded-full bg-primary" />
            <p className="text-sm font-medium">Report submitted</p>
            <p className="text-xs text-muted-foreground">{formatDate(issue.created_at)}</p>
          </li>
          {updates.map((u) => (
            <li key={u.id} className="relative">
              <span className="absolute top-1.5 -left-[23px] size-2.5 rounded-full bg-accent" />
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill status={u.status} label={labelFor(issueStatuses, u.status)} />
                {u.is_official ? <OfficialBadge /> : <CommunityBadge />}
              </div>
              {u.note ? <p className="mt-2 text-sm leading-relaxed">{u.note}</p> : null}
              <p className="mt-1 text-xs text-muted-foreground">
                {u.is_official
                  ? "Barangay Balibago Official"
                  : (authors[u.author_id ?? ""]?.full_name ?? "Resident")}{" "}
                · {formatDate(u.created_at)}
              </p>
            </li>
          ))}
        </ol>

        {user ? (
          <div className="mt-8 grid gap-4 rounded-lg border border-border bg-card p-5">
            <h3 className="font-medium">{isStaff ? "Post an official update" : "Add an update"}</h3>
            {isStaff ? (
              <div className="grid gap-1.5">
                <Label>New status</Label>
                <Select value={status || issue.status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {issueStatuses.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
            <Textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                isStaff ? "Describe the action taken." : "Add more information about this issue."
              }
            />
            <div>
              <Button onClick={() => addUpdate.mutate()} disabled={addUpdate.isPending}>
                Post update
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">
            <Link to="/auth" search={{}} className="text-primary underline">
              Sign in
            </Link>{" "}
            to add an update to this report.
          </p>
        )}
      </section>
    </div>
  );
}
