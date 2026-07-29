import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Map,
  ListChecks,
  BarChart3,
  Users,
  FileText,
  Building2,
  Globe,
  Plus,
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
import { TRANSLATIONS } from "@/lib/i18n";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { language, setLanguage } = useBayanStore();
  const t = TRANSLATIONS[language];

  const OPERATIONS = [
    { title: t.overview, url: "/dashboard", icon: LayoutDashboard },
    { title: t.issueMap, url: "/dashboard/map", icon: Map },
    { title: t.issueQueue, url: "/dashboard/issues", icon: ListChecks },
    { title: t.analytics, url: "/dashboard/analytics", icon: BarChart3 },
  ] as const;

  const COMMUNITY = [
    { title: t.communityFeed, url: "/dashboard/community", icon: Users },
    { title: t.publicServices, url: "/dashboard/services", icon: FileText },
  ] as const;

  const item = (i: { title: string; url: string; icon: typeof Map }) => {
    const active = path === i.url;
    return (
      <SidebarMenuItem key={i.url}>
        <SidebarMenuButton asChild isActive={active} tooltip={i.title}>
          <Link
            to={i.url}
            className={`flex items-center gap-2.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all ${
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
            B
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-bold tracking-tight text-zinc-900">
                BayanLink
              </span>
              <span className="block truncate text-[11px] font-mono text-zinc-500">
                Balibago Portal
              </span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-wider font-semibold text-zinc-400">
            Operations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{OPERATIONS.map(item)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-wider font-semibold text-zinc-400">
            Services
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{COMMUNITY.map(item)}</SidebarMenu>
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
                <Plus className="h-4 w-4 shrink-0" />
                <span className="truncate">{t.reportAnIssue}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {!collapsed && (
          <div className="px-3 py-1.5 flex items-center justify-between text-xs text-zinc-500 bg-white rounded-full border border-zinc-200">
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Globe className="h-3.5 w-3.5 text-zinc-700" /> Lang
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              aria-label="Select Language"
              className="bg-transparent text-xs text-zinc-900 font-semibold focus:outline-none"
            >
              <option value="en">EN</option>
              <option value="tl">TL</option>
              <option value="pam">PAM</option>
            </select>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
