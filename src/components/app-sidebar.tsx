import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Map,
  ListChecks,
  BarChart3,
  Users,
  FileText,
  Megaphone,
  Globe,
  Building2,
  Sparkles,
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
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
              active
                ? "bg-sky-600 text-white shadow-md shadow-sky-600/25"
                : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
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
    <Sidebar collapsible="icon" className="border-r border-border/80 bg-card font-sans">
      <SidebarHeader className="p-3">
        <Link to="/" className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-surface-2 transition-colors">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white font-bold shadow-md shadow-sky-500/20">
            <Building2 className="h-5 w-5" />
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-extrabold tracking-tight text-foreground">
                {t.appName}
              </span>
              <span className="block truncate text-[11px] font-mono font-medium text-sky-600">
                {t.subTitle}
              </span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-wider font-bold text-muted-foreground">
            {t.operations}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{OPERATIONS.map(item)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-wider font-bold text-muted-foreground">
            Balibago Services
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{COMMUNITY.map(item)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-2 border-t border-border/60">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={t.reportAnIssue}>
              <Link
                to="/report"
                className="flex items-center gap-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 border border-sky-500/20 px-3 py-2 transition-colors font-bold text-xs"
              >
                <Sparkles className="h-4 w-4 shrink-0 text-sky-500" />
                <span className="truncate">{t.reportAnIssue}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {!collapsed && (
          <div className="px-2 py-1.5 flex items-center justify-between text-xs text-muted-foreground bg-surface-2 rounded-xl border border-border/80">
            <span className="flex items-center gap-1.5 font-bold font-mono text-[11px]">
              <Globe className="h-3.5 w-3.5 text-sky-500" /> Language
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              aria-label="Select Language"
              className="bg-card border border-border rounded-lg px-2 py-0.5 text-xs text-foreground font-bold focus:outline-none"
            >
              <option value="en">English</option>
              <option value="tl">Tagalog</option>
              <option value="pam">Kapampangan</option>
            </select>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
