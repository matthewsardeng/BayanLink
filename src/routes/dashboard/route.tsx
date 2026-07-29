import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Search, Siren, ShieldCheck } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/85 px-3 backdrop-blur sm:px-5">
            <SidebarTrigger />
            <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm text-muted-foreground md:flex">
              <Search className="h-4 w-4 shrink-0" />
              <input
                className="min-w-0 flex-1 bg-transparent outline-none"
                placeholder="Search Balibago issues, subdivisions, services, tracking codes..."
                aria-label="Search"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                [DEMO DASHBOARD]
              </span>
              <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
                <Link to="/report">
                  <Siren className="h-4 w-4" /> New Report
                </Link>
              </Button>
              <button
                aria-label="Notifications"
                className="relative grid h-9 w-9 place-items-center rounded-full border border-border bg-card"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-danger text-[10px] font-bold text-danger-foreground">
                  5
                </span>
              </button>
              <div className="flex items-center gap-2 pl-1">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full gradient-brand text-xs font-bold text-primary-foreground">
                  JP
                </span>
                <span className="hidden min-w-0 leading-tight lg:block">
                  <span className="block truncate text-sm font-semibold">
                    Hon. Joseph "PG" Ponce
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    Punong Barangay · Balibago
                  </span>
                </span>
              </div>
            </div>
          </header>
          <main className="min-w-0 flex-1 px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
