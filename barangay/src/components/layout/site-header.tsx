import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, LogOut, Menu, Shield, User2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/community", label: "Community" },
  { to: "/community/updates", label: "Updates" },
  { to: "/community/suggestions", label: "Suggestions" },
  { to: "/issues", label: "Issues" },
  { to: "/map", label: "Map" },
  { to: "/services", label: "Services" },
];

export function SiteHeader() {
  const { user, profile, isStaff, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  const { data: unread = 0 } = useQuery({
    queryKey: ["unread", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { count } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .is("read_at", null);
      return count ?? 0;
    },
  });

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary font-display text-lg text-primary-foreground">
            B
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[15px] text-foreground">Barangay Balibago</span>
            <span className="block text-[11px] tracking-wide text-muted-foreground uppercase">
              Angeles City
            </span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                path === item.to && "bg-secondary text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="relative hidden rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
                aria-label="Notifications"
              >
                <Bell className="size-5" />
                {unread > 0 ? (
                  <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                    {unread > 9 ? "9+" : unread}
                  </span>
                ) : null}
              </Link>
              {isStaff ? (
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link to="/admin">
                    <Shield className="size-4" /> Admin
                  </Link>
                </Button>
              ) : null}
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                <Link to="/dashboard">
                  <User2 className="size-4" />
                  {profile?.full_name?.split(" ")[0] ?? "Dashboard"}
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => void signOut()}
                aria-label="Sign out"
                className="hidden sm:inline-flex"
              >
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/auth" search={{}}>Sign in</Link>
            </Button>
          )}

          <button
            className="rounded-md p-2 text-foreground lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto grid max-w-6xl gap-1 px-4 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid gap-2 border-t border-border pt-3">
              {user ? (
                <>
                  <Button asChild variant="outline" size="sm" onClick={() => setOpen(false)}>
                    <Link to="/dashboard">My Dashboard</Link>
                  </Button>
                  {isStaff ? (
                    <Button asChild variant="ghost" size="sm" onClick={() => setOpen(false)}>
                      <Link to="/admin">Barangay Administration</Link>
                    </Button>
                  ) : null}
                  <Button variant="ghost" size="sm" onClick={() => void signOut()}>
                    Sign out
                  </Button>
                </>
              ) : (
                <Button asChild size="sm" onClick={() => setOpen(false)}>
                  <Link to="/auth" search={{}}>Sign in</Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
