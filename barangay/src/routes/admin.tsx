import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/api";
import { announcementKinds, labelFor, requestStatuses } from "@/lib/taxonomy";
import { StatusPill } from "@/components/badges";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Barangay Staff Console — Barangay Balibago" },
      {
        name: "description",
        content:
          "Staff console for Barangay Balibago: publish announcements, process service requests and review reported community content.",
      },
      { property: "og:title", content: "Barangay Staff Console — Barangay Balibago" },
      {
        property: "og:description",
        content: "Announcements, service requests and content moderation for barangay staff.",
      },
    ],
  }),
  component: Admin,
});

function Admin() {
  const { user, isStaff, loading } = useAuth();

  if (loading)
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );

  if (!user || !isStaff)
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Staff only</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This console is limited to authorised Barangay Balibago personnel.
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link to="/">Back home</Link>
        </Button>
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Official</p>
        <h1 className="mt-2 font-display text-4xl">Staff console</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Anything published here is labelled as official barangay content.
        </p>
      </header>

      <Tabs defaultValue="announce">
        <TabsList>
          <TabsTrigger value="announce">Announcements</TabsTrigger>
          <TabsTrigger value="requests">Service requests</TabsTrigger>
          <TabsTrigger value="reports">Reported content</TabsTrigger>
        </TabsList>

        <TabsContent value="announce" className="mt-6">
          <AnnouncementForm authorId={user.id} />
        </TabsContent>
        <TabsContent value="requests" className="mt-6">
          <RequestsPanel />
        </TabsContent>
        <TabsContent value="reports" className="mt-6">
          <ReportsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AnnouncementForm({ authorId }: { authorId: string }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [kind, setKind] = useState("announcement");

  const { data } = useQuery({
    queryKey: ["admin", "announcements"],
    queryFn: async () => {
      const { data } = await supabase
        .from("announcements")
        .select("id, title, kind, is_published, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
  });

  const publish = useMutation({
    mutationFn: async () => {
      if (title.trim().length < 5) throw new Error("Add a clear title.");
      if (body.trim().length < 20) throw new Error("Add the announcement body.");
      const { error } = await supabase.from("announcements").insert({
        author_id: authorId,
        title: title.trim(),
        body: body.trim(),
        kind: kind as (typeof announcementKinds)[number]["value"],
        is_published: true,
        published_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Announcement published.");
      setTitle("");
      setBody("");
      void qc.invalidateQueries({ queryKey: ["admin", "announcements"] });
      void qc.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 rounded-lg border border-border bg-card p-6">
        <div className="grid gap-1.5">
          <Label htmlFor="a-title">Title</Label>
          <Input id="a-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label>Type</Label>
          <Select value={kind} onValueChange={setKind}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {announcementKinds.map((k) => (
                <SelectItem key={k.value} value={k.value}>
                  {k.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="a-body">Body</Label>
          <Textarea id="a-body" rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <div>
          <Button onClick={() => publish.mutate()} disabled={publish.isPending}>
            Publish announcement
          </Button>
        </div>
      </div>

      <div className="grid gap-2">
        {(data ?? []).map((a) => (
          <div
            key={a.id}
            className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm"
          >
            <span className="font-medium">{a.title}</span>
            <span className="text-xs text-muted-foreground">{labelFor(announcementKinds, a.kind)}</span>
            <span className="ml-auto text-xs text-muted-foreground">{formatDate(a.created_at)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RequestsPanel() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "requests"],
    queryFn: async () => {
      const { data } = await supabase
        .from("service_requests")
        .select("id, reference_no, purpose, status, created_at, services(name)")
        .order("created_at", { ascending: false })
        .limit(50);
      return data ?? [];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("service_requests")
        .update({ status: status as (typeof requestStatuses)[number]["value"] })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Request updated.");
      void qc.invalidateQueries({ queryKey: ["admin", "requests"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <Skeleton className="h-40 w-full rounded-lg" />;
  if (!data?.length) return <EmptyState title="No service requests yet." />;

  return (
    <div className="grid gap-3">
      {data.map((r) => (
        <div key={r.id} className="rounded-lg border border-border bg-card p-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={r.status} label={labelFor(requestStatuses, r.status)} />
            <span className="ml-auto font-mono text-xs text-muted-foreground">{r.reference_no}</span>
          </div>
          <p className="mt-3 font-medium">
            {(r.services as { name: string } | null)?.name ?? "Service"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{r.purpose}</p>
          <div className="mt-4 max-w-xs">
            <Select value={r.status} onValueChange={(v) => setStatus.mutate({ id: r.id, status: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {requestStatuses.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReportsPanel() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "content-reports"],
    queryFn: async () => {
      const { data } = await supabase
        .from("content_reports")
        .select("id, entity_type, entity_id, reason, details, status, created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      return data ?? [];
    },
  });

  const resolve = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: "dismissed" | "actioned" }) => {
      const { error } = await supabase.from("content_reports").update({ status: action }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Report updated.");
      void qc.invalidateQueries({ queryKey: ["admin", "content-reports"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <Skeleton className="h-40 w-full rounded-lg" />;
  if (!data?.length) return <EmptyState title="No reported content." />;

  return (
    <div className="grid gap-3">
      {data.map((r) => (
        <div key={r.id} className="rounded-lg border border-border bg-card p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-secondary px-2 py-0.5">{r.entity_type}</span>
            <span>{r.reason}</span>
            <span className="ml-auto">{formatDate(r.created_at)}</span>
          </div>
          {r.details ? <p className="mt-3 text-sm">{r.details}</p> : null}
          <p className="mt-2 font-mono text-xs text-muted-foreground">{r.entity_id}</p>
          {r.status === "open" ? (
            <div className="mt-4 flex gap-2">
              <Button size="sm" onClick={() => resolve.mutate({ id: r.id, action: "actioned" })}>
                Mark actioned
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => resolve.mutate({ id: r.id, action: "dismissed" })}
              >
                Dismiss
              </Button>
            </div>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">Status: {r.status}</p>
          )}
        </div>
      ))}
    </div>
  );
}
