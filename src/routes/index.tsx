import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BARANGAY_INFO, BARANGAY_OFFICIALS, ISSUES, SERVICES, PUROKS, CATEGORIES, type IssueCategory } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-store";
import { TRANSLATIONS } from "@/lib/i18n";
import { BarangayMap, CategoryIcon } from "@/components/barangay-map";
import { StatusPill } from "@/components/status";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import bgImage from "@/assets/bg.jpg";
import balibagoImg from "@/assets/balibago.jpg";
import logoImg from "@/assets/logo.png";
import {
  Map,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Phone,
  PhoneCall,
  Siren,
  FileCheck,
  FileText,
  CheckCircle2,
  Building2,
  Users,
  Search,
  Globe,
  Clock,
  Vote,
  AlertTriangle,
  User,
  LogOut,
  X,
  Radio,
  ExternalLink,
  Calendar,
  Layers,
  ChevronRight,
  Award,
  Zap,
  Trash2,
  HeartPulse,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tugnay — Barangay Balibago Operations Portal" },
      {
        name: "description",
        content:
          "Bawat tugon, panibagong ugnay sa komunidad. Report issues, track clearances, and verify neighborhood repairs in Barangay Balibago, Angeles City.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { issues, language, setLanguage, confirmIssue } = useBayanStore();
  const { user, login, signup, logout } = useAuth();
  const t = TRANSLATIONS[language];
  const [mounted, setMounted] = useState(false);

  // Live Map Section Filters & Selection
  const [mapCategory, setMapCategory] = useState<IssueCategory | "All">("All");
  const [selectedMapId, setSelectedMapId] = useState<string>(issues[0]?.id || "");

  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedPurok, setSelectedPurok] = useState(PUROKS[0]);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredMapIssues = useMemo(() => {
    return issues.filter((i) => mapCategory === "All" || i.category === mapCategory);
  }, [issues, mapCategory]);

  const selectedMapIssue = issues.find((i) => i.id === selectedMapId) || filteredMapIssues[0];

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      if (authMode === "login") {
        await login(email);
      } else {
        await signup(name || "Balibago Resident", email, selectedPurok);
      }
      setShowAuthModal(false);
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      {/* STICKY TOP HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 sm:h-24 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={logoImg} alt="Tugnay Logo" className="h-16 sm:h-20 w-auto object-contain shrink-0" />
            <div className="hidden min-[380px]:block">
              <span className="block font-display text-xl font-bold tracking-tight text-zinc-900 leading-none">
                Tugnay
              </span>
              <span className="block text-xs font-mono text-zinc-500 font-semibold mt-0.5">
                Tugon at Ugnay · Balibago
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-zinc-600">
            <a href="#ops" className="hover:text-zinc-900 transition-colors">
              Live Operations
            </a>
            <a href="#news" className="hover:text-zinc-900 transition-colors">
              Announcements
            </a>
            <a href="#officials" className="hover:text-zinc-900 transition-colors">
              Officials
            </a>
            <a href="#services" className="hover:text-zinc-900 transition-colors">
              Services
            </a>
            <a href="#schedules" className="hover:text-zinc-900 transition-colors">
              Schedules
            </a>
            <a href="#emergency" className="hover:text-zinc-900 transition-colors">
              Emergency
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Non-breaking compact Language Selector */}
            <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-mono">
              <Globe className="h-3.5 w-3.5 text-zinc-700 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                aria-label="Select Language"
                className="bg-transparent text-xs text-zinc-900 font-bold outline-none cursor-pointer pr-1"
              >
                <option value="en">EN</option>
                <option value="tl">TL</option>
                <option value="pam">PAM</option>
              </select>
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-700 hidden xl:inline font-bold">
                  {user.name}
                </span>
                <Button size="sm" variant="outline" onClick={logout} className="rounded-full text-xs font-semibold border-zinc-300">
                  <LogOut className="h-3.5 w-3.5 mr-1" /> Logout
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setAuthMode("login");
                  setShowAuthModal(true);
                }}
                className="rounded-full text-xs font-semibold border-zinc-300 hidden sm:inline-flex"
              >
                <User className="h-3.5 w-3.5 mr-1 text-zinc-900" /> Sign In
              </Button>
            )}

            <Button asChild size="sm" className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold px-4 shrink-0">
              <Link to="/report">File Concern ↗</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO SECTION */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-white py-8 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            {/* Hero Left Column */}
            <div className="space-y-6">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                Serbisyo Publiko · Est. 1961
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 leading-[1.08]">
                Mabilis na Tugon, Matibay na <span className="underline underline-offset-8 decoration-zinc-900">Ugnay</span> sa bawat Purok.
              </h1>

              <p className="text-base text-zinc-600 leading-relaxed max-w-xl">
                Tugnay connects residents directly with Barangay Balibago operations. Report municipal concerns, track physical repair progress in real time, and request official clearances with total civic transparency.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button asChild size="lg" className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold px-7 text-xs sm:text-sm">
                  <Link to="/report">File a Concern Now <ArrowRight className="h-4 w-4 ml-1.5" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-zinc-300 font-semibold px-7 text-xs sm:text-sm">
                  <Link to="/dashboard">Explore Operations Desk</Link>
                </Button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-100 text-xs font-mono text-zinc-500">
                <div>
                  <span className="block font-bold text-base sm:text-lg text-zinc-900">42,274</span>
                  Residents Served
                </div>
                <div>
                  <span className="block font-bold text-base sm:text-lg text-zinc-900">8 Puroks</span>
                  Complete Coverage
                </div>
                <div>
                  <span className="block font-bold text-base sm:text-lg text-zinc-900">96.8%</span>
                  SLA Compliance
                </div>
              </div>
            </div>

            {/* Hero Right Column: Balibago Image (Bigger Height, Preserved Aspect Ratio) */}
            <div className="surface-card overflow-hidden border border-zinc-200 bg-white rounded-3xl shadow-xl relative h-[460px] sm:h-[520px] lg:h-[560px] flex flex-col justify-end">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{ backgroundImage: `url(${balibagoImg})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />

              {/* Bottom Compact Streaming Ticker Box */}
              <div className="relative z-10 p-3.5 space-y-2 font-mono text-[11px] text-white">
                <div className="flex items-center justify-between border-b border-white/20 pb-1.5">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase text-[9px] tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" /> Live · Recently resolved
                  </span>
                  <span className="text-zinc-400 text-[9px]">Streaming</span>
                </div>

                <ul className="space-y-1.5">
                  <li className="flex items-center justify-between bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 text-[11px]">
                    <div>
                      <span className="font-bold text-white">BAL-2231</span> · <span className="text-zinc-300">Streetlight, Purok 4</span>
                    </div>
                    <span className="text-emerald-400 font-bold text-[10px]">✓ 12m ago</span>
                  </li>
                  <li className="flex items-center justify-between bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 text-[11px]">
                    <div>
                      <span className="font-bold text-white">BAL-2229</span> · <span className="text-zinc-300">Garbage, Purok 7</span>
                    </div>
                    <span className="text-emerald-400 font-bold text-[10px]">✓ 48m ago</span>
                  </li>
                  <li className="flex items-center justify-between bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 text-[11px]">
                    <div>
                      <span className="font-bold text-white">BAL-2224</span> · <span className="text-zinc-300">Water Supply, Purok 2</span>
                    </div>
                    <span className="text-emerald-400 font-bold text-[10px]">✓ 2h ago</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: § 02 · LIVE OPERATIONS */}
      <section id="ops" className="py-10 sm:py-14 border-b border-zinc-200 bg-[#fafafa]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                § 02 · Live Operations
              </span>
              <h2 className="text-3xl font-extrabold text-zinc-900 mt-1">
                Balibago issue map
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-1">
                Every open concern, plotted along MacArthur Hwy, Fields Ave & residential zones.
              </p>
            </div>

            <Button asChild size="sm" variant="outline" className="rounded-full text-xs font-semibold border-zinc-300">
              <Link to="/dashboard">Open ops dashboard →</Link>
            </Button>
          </div>

          {/* Interactive Map Layout with Top Filter Pills & Right Side Queue Panel */}
          <div className="surface-card border border-zinc-200 bg-white rounded-3xl overflow-hidden shadow-sm space-y-0">
            {/* Top Filter Category Bar (Compact flex-wrap, no horizontal scrollbar) */}
            <div className="flex flex-wrap items-center gap-1.5 p-3.5 border-b border-zinc-200 bg-zinc-50">
              <button
                onClick={() => setMapCategory("All")}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-mono font-bold uppercase transition-all shrink-0 border",
                  mapCategory === "All"
                    ? "bg-zinc-900 text-white border-transparent"
                    : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                )}
              >
                ((•)) ALL ({issues.length})
              </button>
              {CATEGORIES.map((c) => {
                const cnt = issues.filter((i) => i.category === c.name).length;
                return (
                  <button
                    key={c.name}
                    onClick={() => setMapCategory(c.name)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-bold uppercase transition-all shrink-0 border",
                      mapCategory === c.name
                        ? "bg-zinc-900 text-white border-transparent"
                        : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                    )}
                  >
                    <CategoryIcon category={c.name} className="h-3.5 w-3.5" />
                    {c.name} ({cnt})
                  </button>
                );
              })}
            </div>

            {/* Split View: Map (Left) & Live Ticket Queue Panel (Right) */}
            <div className="grid lg:grid-cols-[1fr_360px] min-h-[480px]">
              {/* Main Map Tile Viewport */}
              <div className="relative min-h-[380px] lg:min-h-[480px] bg-zinc-100 border-b lg:border-b-0 lg:border-r border-zinc-200">
                <BarangayMap
                  issues={filteredMapIssues}
                  selectedId={selectedMapId}
                  onSelect={setSelectedMapId}
                  className="h-full w-full rounded-none border-none"
                />
              </div>

              {/* Separate Right Side Panel (LIVE SELECTED TICKET & QUEUE) */}
              <div className="p-4 flex flex-col justify-between space-y-3 bg-white font-mono overflow-hidden">
                {selectedMapIssue ? (
                  <div className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/80 space-y-2">
                    <div className="flex items-center justify-between gap-2 border-b border-zinc-200/60 pb-2">
                      <span className="text-xs font-bold text-zinc-900">{selectedMapIssue.code}</span>
                      <StatusPill status={selectedMapIssue.status} />
                    </div>
                    <h3 className="font-bold text-xs text-zinc-900 leading-snug">{selectedMapIssue.title}</h3>
                    <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-zinc-900" /> {selectedMapIssue.purok}
                    </p>
                    <p className="text-[11px] text-zinc-600 leading-relaxed font-sans line-clamp-2">
                      {selectedMapIssue.summary}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => confirmIssue(selectedMapIssue.id)}
                      className="w-full text-xs font-semibold rounded-full bg-zinc-900 text-white mt-1"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 mr-1" /> Confirm Resident ({selectedMapIssue.confirmations})
                    </Button>
                  </div>
                ) : (
                  <div className="p-3 text-center text-xs text-zinc-500">
                    <p className="font-bold text-zinc-900">Select a pin marker on the map</p>
                  </div>
                )}

                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-100 pb-2 mb-2">
                    LIVE TICKET QUEUE ({filteredMapIssues.length})
                  </h3>

                  <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                    {filteredMapIssues.map((i) => (
                      <button
                        key={i.id}
                        onClick={() => setSelectedMapId(i.id)}
                        className={cn(
                          "w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-2",
                          i.id === selectedMapIssue?.id
                            ? "border-zinc-900 bg-zinc-100 font-bold"
                            : "border-zinc-200 bg-white hover:bg-zinc-50"
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-zinc-900 truncate text-[11px]">{i.title}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{i.category} · {i.purok}</p>
                        </div>
                        <StatusPill status={i.status} />
                      </button>
                    ))}
                  </div>
                </div>

                <Button asChild size="sm" className="w-full rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-white text-xs shrink-0">
                  <Link to="/dashboard/issues">View Complete Queue ({issues.length})</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: § 03 · BALITA MULA SA KAPITAN */}
      <section id="news" className="py-10 sm:py-14 border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                § 03 · Balita mula sa Kapitan
              </span>
              <h2 className="text-3xl font-extrabold text-zinc-900 mt-1">
                Announcements & Directives
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-1">
                Official advisories from Punong Barangay Joseph "PG" Ponce
              </p>
            </div>
            <Link to="/dashboard/announcements" className="text-xs font-mono font-bold text-zinc-900 hover:underline flex items-center gap-1">
              View all →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <article className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl space-y-3 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                    <HeartPulse className="h-3 w-3" /> Health Mission
                  </span>
                  <span className="text-zinc-500 font-bold">Aug 02</span>
                </div>
                <h3 className="text-base font-bold text-zinc-900 leading-snug">
                  Free medical mission at the covered court
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  General consult, BP monitoring, and free maintenance meds for Senior Citizens & PWDs. Bring your barangay ID.
                </p>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 pt-2 border-t border-zinc-100 flex items-center gap-1">
                <Clock className="h-3 w-3" /> 8:00 AM – 1:00 PM · Balibago Covered Court
              </span>
            </article>

            <article className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl space-y-3 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                    <Zap className="h-3 w-3" /> Utilities Notice
                  </span>
                  <span className="text-zinc-500 font-bold">Jul 31</span>
                </div>
                <h3 className="text-base font-bold text-zinc-900 leading-snug">
                  Scheduled brownout, Puroks 3–5
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Meralco feeder line maintenance & tree trimming along MacArthur Highway corridor from 9:00 AM to 12:00 PM.
                </p>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 pt-2 border-t border-zinc-100 flex items-center gap-1">
                <Clock className="h-3 w-3" /> 9:00 AM – 12:00 PM · Puroks 3, 4 & 5
              </span>
            </article>

            <article className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl space-y-3 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="bg-zinc-100 text-zinc-800 border border-zinc-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                    <Users className="h-3 w-3" /> Town Hall Assembly
                  </span>
                  <span className="text-zinc-500 font-bold">Aug 04</span>
                </div>
                <h3 className="text-base font-bold text-zinc-900 leading-snug">
                  Barangay assembly — MacArthur Hwy update
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Kapitan Ponce will present updates on Astro Park flood mitigation culverts, TODA fuel relief, and streetlight expansion.
                </p>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 pt-2 border-t border-zinc-100 flex items-center gap-1">
                <Clock className="h-3 w-3" /> 2:00 PM · Session Hall
              </span>
            </article>
          </div>
        </div>
      </section>

      {/* SECTION 4: § 04 · ANG INYONG LINGKOD-BAYAN (Verified 2026 Leadership Roster) */}
      <section id="officials" className="py-10 sm:py-14 border-b border-zinc-200 bg-[#fafafa]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                § 04 · Ang inyong lingkod-bayan
              </span>
              <h2 className="text-3xl font-extrabold text-zinc-900 mt-1">
                Officials of Barangay Balibago
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-1">
                Sangguniang Barangay 2023–2026 Term · Verified DILG Roster
              </p>
            </div>
            <Link to="/dashboard/puroks" className="text-xs font-mono font-bold text-zinc-900 hover:underline flex items-center gap-1">
              View full directory →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
            {BARANGAY_OFFICIALS.slice(0, 8).map((o) => (
              <div key={o.name} className="surface-card p-4 border border-zinc-200 bg-white rounded-3xl space-y-2.5 shadow-sm hover:border-zinc-300 transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                    {o.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-zinc-900 truncate font-sans">{o.name}</h3>
                    <p className="text-[11px] text-amber-700 font-bold">{o.title}</p>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-500 border-t border-zinc-100 pt-2 truncate">{o.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: § 05 · SERBISYO */}
      <section id="services" className="py-10 sm:py-14 border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                § 05 · Serbisyo
              </span>
              <h2 className="text-3xl font-extrabold text-zinc-900 mt-1">
                Public services & clearances
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-1">
                Apply for official municipal documents online with PDF claim slips.
              </p>
            </div>
            <Link to="/dashboard/services" className="text-xs font-mono font-bold text-zinc-900 hover:underline flex items-center gap-1">
              Browse all documents →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
            {SERVICES.map((s) => (
              <div key={s.id} className="surface-card p-5 border border-zinc-200 bg-zinc-50/50 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm hover:border-zinc-300 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {s.time}
                    </span>
                    <span className="font-bold text-zinc-900 text-xs">{s.fee}</span>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 font-sans leading-snug">{s.name}</h3>
                  <p className="text-[11px] text-zinc-500 font-mono truncate">{s.group} · {s.requirements.length} requirement(s)</p>
                </div>
                <Button asChild size="sm" className="w-full rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-white text-xs">
                  <Link to="/dashboard/services">Apply Online ↗</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: § 06 · ISKEDYUL */}
      <section id="schedules" className="py-10 sm:py-14 border-b border-zinc-200 bg-[#fafafa]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                § 06 · Iskedyul
              </span>
              <h2 className="text-3xl font-extrabold text-zinc-900 mt-1">
                This week in Balibago
              </h2>
            </div>
            <span className="bg-zinc-100 text-zinc-800 px-3 py-1 rounded-full text-xs font-mono font-bold border border-zinc-200">
              Jul 29 – Aug 04, 2026
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase">
                  TUE / THU / SAT
                </span>
                <Trash2 className="h-4 w-4 text-emerald-600" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">Garbage Collection</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Segregated waste pickup (biodegradable, non-bio, recyclables) across all 8 Puroks starting at 5:30 AM.
              </p>
            </div>

            <div className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase">
                  WED · 09:00–12:00
                </span>
                <Zap className="h-4 w-4 text-amber-600" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">Meralco Line Maintenance</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Feeder line rehabilitation along Puroks 3, 4, & 5. Charge devices and backup batteries in advance.
              </p>
            </div>

            <div className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full uppercase">
                  SAT · 07:00 AM
                </span>
                <HeartPulse className="h-4 w-4 text-sky-600" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">Community Health Mission</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Balibago Covered Court. Free medical consults, blood pressure screening, and maintenance medicine distribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: § 07 · EMERGENCY RESPONSE COMMAND CENTER (High Priority Callout UI) */}
      <section id="emergency" className="py-10 sm:py-14 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Urgent Emergency Callout Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950 via-zinc-900 to-rose-950 p-6 sm:p-10 text-white shadow-2xl border border-rose-800/60">
            <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 opacity-10 pointer-events-none">
              <Siren className="h-72 w-72 text-rose-500" />
            </div>

            <div className="relative z-10 space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/20 px-3.5 py-1 text-xs font-mono font-bold text-rose-400 border border-rose-500/30 uppercase tracking-wider">
                <Siren className="h-3.5 w-3.5 text-rose-400 animate-pulse" /> 24/7 Life Safety & Dispatch Hotline
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                May emergency? Dial the hotline first.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                For life-safety incidents, fires, medical emergencies, or crime in progress, call local emergency responders directly before filing a web ticket.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="tel:09990990638"
                  className="inline-flex items-center gap-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs px-5 py-2.5 shadow-lg transition-all"
                >
                  <PhoneCall className="h-4 w-4" /> Call Barangay Hotline: 0999-099-0638
                </a>
                <a
                  href="tel:911"
                  className="inline-flex items-center gap-2 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 font-mono font-bold text-xs px-5 py-2.5 shadow-md transition-all"
                >
                  <Siren className="h-4 w-4 text-rose-600" /> Dial 911 (National Emergency)
                </a>
              </div>
            </div>
          </div>

          {/* 1-Tap Emergency Contact Card Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 font-mono text-xs">
            <div className="surface-card p-4 border border-zinc-200 bg-zinc-50/80 rounded-2xl space-y-2 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                  24/7 Command Desk
                </span>
                <p className="font-bold text-zinc-900 text-xs mt-2">Barangay Hotline</p>
                <p className="text-zinc-700 font-bold text-sm mt-0.5">0999-099-0638</p>
                <p className="text-[10px] text-zinc-500">0916-741-4383</p>
              </div>
              <a
                href="tel:09990990638"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-semibold py-1.5"
              >
                <PhoneCall className="h-3 w-3 text-rose-400" /> Call Hotline
              </a>
            </div>

            <div className="surface-card p-4 border border-zinc-200 bg-zinc-50/80 rounded-2xl space-y-2 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  Balibago Substation
                </span>
                <p className="font-bold text-zinc-900 text-xs mt-2">Police Station 4</p>
                <p className="text-zinc-700 font-bold text-sm mt-0.5">(045) 322-2146</p>
                <p className="text-[10px] text-zinc-500">(045) 893-0931</p>
              </div>
              <a
                href="tel:0453222146"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-semibold py-1.5"
              >
                <PhoneCall className="h-3 w-3 text-amber-400" /> Call Police
              </a>
            </div>

            <div className="surface-card p-4 border border-zinc-200 bg-zinc-50/80 rounded-2xl space-y-2 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                  Disaster Office
                </span>
                <p className="font-bold text-zinc-900 text-xs mt-2">ACDRRMO Rescue</p>
                <p className="text-zinc-700 font-bold text-sm mt-0.5">0917-851-9581</p>
                <p className="text-[10px] text-zinc-500">0998-842-7746</p>
              </div>
              <a
                href="tel:09178519581"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-semibold py-1.5"
              >
                <PhoneCall className="h-3 w-3 text-sky-400" /> Call ACDRRMO
              </a>
            </div>

            <div className="surface-card p-4 border border-zinc-200 bg-zinc-50/80 rounded-2xl space-y-2 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                  Fire Station
                </span>
                <p className="font-bold text-zinc-900 text-xs mt-2">BFP Angeles Fire</p>
                <p className="text-zinc-700 font-bold text-sm mt-0.5">(045) 888-5899</p>
                <p className="text-[10px] text-zinc-500">0995-822-3620</p>
              </div>
              <a
                href="tel:0458885899"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-semibold py-1.5"
              >
                <PhoneCall className="h-3 w-3 text-orange-400" /> Call BFP
              </a>
            </div>

            <div className="surface-card p-4 border border-zinc-200 bg-zinc-50/80 rounded-2xl space-y-2 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Health Facility
                </span>
                <p className="font-bold text-zinc-900 text-xs mt-2">Balibago Health Center</p>
                <p className="text-zinc-700 font-bold text-sm mt-0.5">0917-231-8842</p>
                <p className="text-[10px] text-zinc-500">1511 Rossana St.</p>
              </div>
              <a
                href="tel:09172318842"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-semibold py-1.5"
              >
                <PhoneCall className="h-3 w-3 text-emerald-400" /> Call Health Desk
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-[#fafafa] py-10 text-xs font-mono text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <p>© 2026 Barangay Balibago, Angeles City, Pampanga. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="hover:text-zinc-900">Official Dashboard</Link>
            <Link to="/report" className="hover:text-zinc-900">Report Issue</Link>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="surface-card w-full max-w-sm p-6 border border-zinc-200 bg-white rounded-3xl shadow-xl space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-base font-bold text-zinc-900">
                {authMode === "login" ? "Resident Sign In" : "Register Resident Account"}
              </h3>
              <button onClick={() => setShowAuthModal(false)} className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            {authError && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-rose-700 font-medium">
                {authError}
              </p>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {authMode === "signup" && (
                <div>
                  <label className="block font-bold text-zinc-500 uppercase tracking-wider text-[10px] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maria Santos"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 font-medium outline-none text-zinc-900"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-zinc-500 uppercase tracking-wider text-[10px] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="resident@balibago.gov.ph"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 font-medium outline-none text-zinc-900"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-500 uppercase tracking-wider text-[10px] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 font-medium outline-none text-zinc-900"
                />
              </div>

              {authMode === "signup" && (
                <div>
                  <label className="block font-bold text-zinc-500 uppercase tracking-wider text-[10px] mb-1">
                    Resident Zone / Purok
                  </label>
                  <select
                    value={selectedPurok}
                    onChange={(e) => setSelectedPurok(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 font-medium outline-none text-zinc-900"
                  >
                    {PUROKS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <Button type="submit" className="w-full rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-white text-xs">
                {authMode === "login" ? "Sign In to Resident Account" : "Create Resident Account"}
              </Button>
            </form>

            <div className="pt-2 text-center text-zinc-500 border-t border-zinc-100">
              {authMode === "login" ? (
                <button onClick={() => setAuthMode("signup")} className="hover:underline font-semibold text-zinc-900">
                  Need an account? Register here
                </button>
              ) : (
                <button onClick={() => setAuthMode("login")} className="hover:underline font-semibold text-zinc-900">
                  Already registered? Sign in here
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
