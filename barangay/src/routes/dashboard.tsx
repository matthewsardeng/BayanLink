import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, FileText, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatDate, timeAgo } from "@/lib/api";
import { issueStatuses, labelFor, requestStatuses, suggestionStatuses } from "@/lib/taxonomy";
import { StatusPill } from "@/components/badges";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Barangay Dashboard — Barangay Balibago" },
      {
        name: "description",
        content:
          "Track your Barangay Balibago service requests, issue reports, suggestions and notifications in one place.",
      },
      { property: "og:title", content: "My Barangay Dashboard — Barangay Balibago" },
      {
        property: "og:description",
        content: "Your service requests, reports, suggestions and notifications.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, profile, loading, refreshProfile } = useAuth();

  const { data, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["dashboard", user?.id],
    queryFn: async () => {
      const uid = user!.id;
      const [requests, issues, suggestions, notifications] = await Promise.all([
        supabase
          .from("service_requests")
          .select("id, reference_no, purpose, status, created_at, services(name)")
          .eq("requester_id", uid)
          .order("created_at", { ascending: false }),
        supabase
          .from("issues")
          .select("id, reference_no, title, status, created_at")
          .eq("reporter_id", uid)
          .order("created_at", { ascending: false }),
        supabase
          .from("suggestions")
          .select("id, title, status, created_at")
          .eq("author_id", uid)
          .order("created_at", { ascending: false }),
        supabase
          .from("notifications")
          .select("id, title, body, link, read_at, created_at")
          .eq("user_id", uid)
          .order("created_at", { ascending: false })
          .limit(30),
      ]);
      return {
        requests: requests.data ?? [],
        issues: issues.data ?? [],
        suggestions: suggestions.data ?? [],
        notifications: notifications.data ?? [],
      };
    },
  });

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-16"><Skeleton className="h-64 w-full rounded-lg" /></div>;

  if (!user)
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Your dashboard</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Sign in to track your service requests, reports and suggestions.
        </p>
        <Button asChild className="mt-6">
          <Link to="/auth" search={{ next: "/dashboard" }}>
            Sign in
          </Link>
        </Button>
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Your account
        </p>
        <h1 className="mt-2 font-display text-4xl">
          Kumusta, {profile?.full_name?.split(" ")[0] ?? "kabalen"}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Everything you have submitted to Barangay Balibago through this platform.
        </p>
      </header>

      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="alerts">Notifications</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-6 grid gap-3">
          {isLoading ? (
            <Skeleton className="h-24 w-full rounded-lg" />
          ) : (data?.requests.length ?? 0) === 0 ? (
            <EmptyState
              icon={<FileText className="size-5" />}
              title="No service requests yet."
              action={
                <Button asChild>
                  <Link to="/services">Browse services</Link>
                </Button>
              }
            />
          ) : (
            data?.requests.map((r) => (
              <div key={r.id} className="rounded-lg border border-border bg-card p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill status={r.status} label={labelFor(requestStatuses, r.status)} />
                  <span className="ml-auto font-mono text-xs text-muted-foreground">
                    {r.reference_no}
                  </span>
                </div>
                <h2 className="mt-3 font-medium">
                  {(r.services as { name: string } | null)?.name ?? "Service"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{r.purpose}</p>
                <p className="mt-2 text-xs text-muted-foreground">{formatDate(r.created_at)}</p>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="reports" className="mt-6 grid gap-3">
          {(data?.issues.length ?? 0) === 0 ? (
            <EmptyState
              icon={<TriangleAlert className="size-5" />}
              title="You haven't reported any issues."
              action={
                <Button asChild>
                  <Link to="/issues/new">Report an Issue</Link>
                </Button>
              }
            />
          ) : (
            data?.issues.map((i) => (
              <Link
                key={i.id}
                to="/issues/$issueId"
                params={{ issueId: i.id }}
                className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill status={i.status} label={labelFor(issueStatuses, i.status)} />
                  <span className="ml-auto font-mono text-xs text-muted-foreground">
                    {i.reference_no}
                  </span>
                </div>
                <h2 className="mt-3 font-medium">{i.title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{timeAgo(i.created_at)}</p>
              </Link>
            ))
          )}
        </TabsContent>

        <TabsContent value="suggestions" className="mt-6 grid gap-3">
          {(data?.suggestions.length ?? 0) === 0 ? (
            <EmptyState title="You haven't submitted any suggestions." />
          ) : (
            data?.suggestions.map((s) => (
              <Link
                key={s.id}
                to="/community/suggestions/$suggestionId"
                params={{ suggestionId: s.id }}
                className="rounded-lg border border-border bg-card p-5"
              >
                <StatusPill status={s.status} label={labelFor(suggestionStatuses, s.status)} />
                <h2 className="mt-3 font-medium">{s.title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{timeAgo(s.created_at)}</p>
              </Link>
            ))
          )}
        </TabsContent>

        <TabsContent value="alerts" className="mt-6 grid gap-3">
          {(data?.notifications.length ?? 0) === 0 ? (
            <EmptyState icon={<Bell className="size-5" />} title="No notifications yet." />
          ) : (
            data?.notifications.map((n) => (
              <div key={n.id} className="rounded-lg border border-border bg-card p-5">
                <p className="font-medium">{n.title}</p>
                {n.body ? <p className="mt-1 text-sm text-muted-foreground">{n.body}</p> : null}
                <p className="mt-2 text-xs text-muted-foreground">{timeAgo(n.created_at)}</p>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <ProfileForm
            initialName={profile?.full_name ?? ""}
            initialArea={profile?.area ?? ""}
            userId={user.id}
            onSaved={refreshProfile}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileForm({
  initialName,
  initialArea,
  userId,
  onSaved,
}: {
  initialName: string;
  initialArea: string;
  userId: string;
  onSaved: () => Promise<void>;
}) {
  const qc = useQueryClient();
  const [name, setName] = useState(initialName);
  const [area, setArea] = useState(initialArea);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: name.trim(), area: area.trim() || null })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: async () => {
      toast.success("Profile updated.");
      await onSaved();
      void qc.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="grid max-w-md gap-4 rounded-lg border border-border bg-card p-6">
      <div className="grid gap-1.5">
        <Label htmlFor="p-name">Display name</Label>
        <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="p-area">Purok / subdivision (optional)</Label>
        <Input id="p-area" value={area} onChange={(e) => setArea(e.target.value)} />
      </div>
      <div>
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          Save profile
        </Button>
      </div>
    </div>
  );
}
