import { useState } from "react";
import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-store";
import { Bell, Search, Plus, User, Settings, LogOut, X, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const isMobile = useIsMobile();
  const { user, logout, login } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const notifications = [
    { id: "n1", title: "Drainage repair scheduled on Fields Ave", time: "10m ago", icon: AlertTriangle, type: "info" },
    { id: "n2", title: "Purok 3 water restoration verified by 12 residents", time: "1h ago", icon: CheckCircle2, type: "success" },
    { id: "n3", title: "Streetlight maintenance team dispatched to Sta. Maria", time: "3h ago", icon: ShieldCheck, type: "info" },
  ];

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-[#fafafa] font-sans text-[#18181b]">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Dashboard Header Bar */}
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-zinc-200 bg-[#fafafa]/90 px-4 backdrop-blur-md">
            <SidebarTrigger />

            <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs text-zinc-500 md:flex shadow-sm">
              <Search className="h-4 w-4 shrink-0 text-zinc-400" />
              <input
                className="min-w-0 flex-1 bg-transparent outline-none text-zinc-900 placeholder:text-zinc-400 font-medium"
                placeholder="Search Balibago issues, subdivisions, services, tracking codes..."
                aria-label="Search"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button asChild size="sm" className="hidden sm:inline-flex rounded-full text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white px-4">
                <Link to="/report">
                  <Plus className="h-3.5 w-3.5 mr-1" /> New Report
                </Link>
              </Button>

              {/* Interactive Notifications Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  aria-label="Notifications"
                  className="relative grid h-9 w-9 place-items-center rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 transition-colors shadow-sm"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-zinc-900 text-[10px] font-bold text-white">
                    3
                  </span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl z-50 text-xs font-sans">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-2 mb-2">
                      <span className="font-bold text-zinc-900">Notifications & Alerts</span>
                      <button onClick={() => setShowNotifications(false)} className="text-zinc-400 hover:text-zinc-700">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {notifications.map((n) => (
                        <li key={n.id} className="p-2 rounded-xl bg-zinc-50 border border-zinc-100 flex items-start gap-2">
                          <n.icon className="h-4 w-4 text-zinc-900 shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-zinc-900 leading-tight">{n.title}</p>
                            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{n.time}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Account & Settings Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white p-1 pr-3 hover:bg-zinc-50 transition-colors shadow-sm"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-zinc-900 text-white font-bold text-xs">
                    {user ? user.name.charAt(0).toUpperCase() : "G"}
                  </span>
                  <span className="hidden min-w-0 text-left text-xs font-semibold sm:block">
                    <span className="block truncate text-zinc-900">{user ? user.name : "Guest Resident"}</span>
                  </span>
                </button>

                {showSettings && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl z-50 text-xs font-sans space-y-3">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                      <span className="font-bold text-zinc-900">Account Settings</span>
                      <button onClick={() => setShowSettings(false)} className="text-zinc-400 hover:text-zinc-700">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200 text-zinc-700 space-y-1">
                      <p className="font-bold text-zinc-900">{user ? user.name : "Public Guest User"}</p>
                      <p className="text-[11px] font-mono text-zinc-500">{user ? user.email : "Default Public Access Mode"}</p>
                      <p className="text-[11px] font-mono text-zinc-500">Purok: Balibago Central</p>
                    </div>

                    <div className="space-y-1 pt-1">
                      {user ? (
                        <button
                          onClick={() => {
                            logout();
                            setShowSettings(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-rose-600 font-semibold hover:bg-rose-50 flex items-center justify-between"
                        >
                          Sign Out <LogOut className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            login("resident@balibago.gov.ph");
                            setShowSettings(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-zinc-900 font-bold hover:bg-zinc-100 flex items-center justify-between"
                        >
                          Quick Sign In <User className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
