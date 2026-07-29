import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Map,
  ListChecks,
  Clock3,
  BarChart3,
  MapPin,
  Users,
  Megaphone,
  CalendarDays,
  FileCheck,
  UserCheck,
  History,
  Globe,
  Plus,
  LogOut,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useBayanStore, type Language } from "@/lib/store";
import { useAuth } from "@/lib/auth-store";
import { TRANSLATIONS } from "@/lib/i18n";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { language, setLanguage } = useBayanStore();
  const { user, logout } = useAuth();
  const t = TRANSLATIONS[language];

  // Exact navigation structure requested by user
  const OPERATIONS = [
    { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
    { title: "Live Map", url: "/dashboard/map", icon: Map },
    { title: "Ticket Queue", url: "/dashboard/issues", icon: ListChecks },
    { title: "SLA Compliance", url: "/dashboard/sla", icon: Clock3 },
    { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  ] as const;

  const BARANGAY = [
    { title: "Puroks", url: "/dashboard/puroks", icon: MapPin },
    { title: "Officials", url: "/dashboard/officials", icon: Users },
    { title: "Announcements", url: "/dashboard/announcements", icon: Megaphone },
    { title: "Schedules", url: "/dashboard/schedules", icon: CalendarDays },
  ] as const;

  const RECORDS = [
    { title: "Documents", url: "/dashboard/documents", icon: FileCheck },
    { title: "Residents", url: "/dashboard/residents", icon: UserCheck },
    { title: "Audit Log", url: "/dashboard/audit-log", icon: History },
  ] as const;

  const renderItem = (i: { title: string; url: string; icon: typeof Map }) => {
    const active = path === i.url;
    return (
      <SidebarMenuItem key={i.url}>
        <SidebarMenuButton asChild isActive={active} tooltip={i.title}>
          <Link
            to={i.url}
            className={`flex items-center gap-2.5 rounded-full px-3 py-2 text-xs font-semibold transition-all ${
              active
                ? "bg-zinc-900 text-white font-bold"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            <i.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{i.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-zinc-200 bg-[#fafafa] font-sans">
      <SidebarHeader className="p-3">
        <Link to="/" className="flex items-center gap-2.5 p-1 rounded-xl">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-900 text-white font-bold text-xs">
            T
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-bold tracking-tight text-zinc-900">
                Tugnay
              </span>
              <span className="block truncate text-[10px] font-mono text-zinc-500 font-semibold">
                Tugon at Ugnay · Balibago
              </span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 space-y-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-wider font-semibold text-zinc-400">
            Operations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{OPERATIONS.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-wider font-semibold text-zinc-400">
            Barangay
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{BARANGAY.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-wider font-semibold text-zinc-400">
            Records
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{RECORDS.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-2 border-t border-zinc-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={t.reportAnIssue}>
              <Link
                to="/report"
                className="flex items-center justify-center gap-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white px-3 py-2 transition-colors font-semibold text-xs"
              >
                <Plus className="h-4 w-4 shrink-0 text-white" />
                <span className="truncate">{t.reportAnIssue}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Language selector */}
        {!collapsed ? (
          <div className="px-3 py-1.5 flex items-center justify-between text-xs text-zinc-500 bg-white rounded-full border border-zinc-200">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <Globe className="h-3.5 w-3.5 text-zinc-700" /> Language
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              aria-label="Select Language"
              className="bg-transparent text-xs text-zinc-900 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="tl">Tagalog</option>
              <option value="pam">Kapampangan</option>
            </select>
          </div>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => {
                  const nextLang: Language = language === "en" ? "tl" : language === "tl" ? "pam" : "en";
                  setLanguage(nextLang);
                }}
                tooltip={`Language: ${language.toUpperCase()}`}
              >
                <Globe className="h-4 w-4 text-zinc-700" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}

        {/* User profile */}
        {user && !collapsed && (
          <div className="flex items-center justify-between pt-1 text-xs text-zinc-600 font-mono">
            <span className="flex items-center gap-1.5 truncate">
              <User className="h-3.5 w-3.5 text-zinc-900" /> {user.name}
            </span>
            <button onClick={logout} className="text-rose-600 hover:underline" title="Sign out">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
