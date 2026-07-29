import { useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { barangay } from "@/lib/barangay";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Barangay Balibago Community Platform" },
      {
        name: "description",
        content:
          "Sign in or create a resident account to post, submit suggestions, report community issues and track barangay service requests.",
      },
      { property: "og:title", content: "Sign in — Barangay Balibago" },
      {
        property: "og:description",
        content: "Resident sign in for the Barangay Balibago community platform.",
      },
    ],
  }),
  validateSearch: (s: { next?: string }) => ({ next: typeof s.next === "string" ? s.next : undefined }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { next } = useSearch({ from: "/auth" });
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const go = () => navigate({ to: next && next.startsWith("/") ? next : "/community" });

  if (user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-2xl">You're signed in</h1>
        <p className="mt-2 text-sm text-muted-foreground">Continue to the community platform.</p>
        <Button className="mt-6" onClick={go}>
          Continue
        </Button>
      </div>
    );
  }

  const signIn = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    go();
  };

  const signUp = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/community`,
        data: { full_name: name },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created. Check your email if confirmation is required.");
    go();
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) return toast.error("Google sign-in failed. Please try again.");
    if (result.redirected) return;
    go();
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-20 lg:grid-cols-2">
      <div>
        <h1 className="font-display text-4xl leading-tight">Join your barangay online</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          A resident account lets you post in the community feed, submit suggestions, report issues
          and track barangay service requests in one place.
        </p>
        <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
          <li>· Share updates, questions and concerns with neighbours</li>
          <li>· Report community issues with a trackable reference number</li>
          <li>· Follow official responses from Barangay Balibago</li>
        </ul>
        <p className="mt-10 text-xs text-muted-foreground">
          {barangay.hall.address} · {barangay.contact.hotline}
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Create account</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="mt-6 grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="si-email">Email</Label>
              <Input id="si-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="si-pass">Password</Label>
              <Input
                id="si-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button onClick={() => void signIn()} disabled={busy}>
              Sign in
            </Button>
          </TabsContent>

          <TabsContent value="signup" className="mt-6 grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="su-name">Full name</Label>
              <Input id="su-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="su-email">Email</Label>
              <Input id="su-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="su-pass">Password</Label>
              <Input
                id="su-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button onClick={() => void signUp()} disabled={busy}>
              Create resident account
            </Button>
          </TabsContent>
        </Tabs>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>
        <Button variant="outline" className="w-full" onClick={() => void google()}>
          Continue with Google
        </Button>
      </div>
    </div>
  );
}
