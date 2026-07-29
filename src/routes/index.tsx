import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BARANGAY_INFO, ISSUES, SERVICES, PUROKS, CATEGORIES, type IssueCategory } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-store";
import { TRANSLATIONS } from "@/lib/i18n";
import { BarangayMap, CategoryIcon } from "@/components/barangay-map";
import { StatusPill } from "@/components/status";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import bgImage from "@/assets/bg.jpg";
import {
  Map,
  ShieldCheck,
  ArrowRight,
  Phone,
  FileCheck,
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
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Barangay Balibago — Live Barangay Map & Public Services" },
      {
        name: "description",
        content:
          "Official civic operating system for Barangay Balibago, Angeles City. Live issue map, resident-verified fixes, public announcements, and online clearance applications.",
      },
      { property: "og:title", content: "Barangay Balibago — Live Map & Services" },
      {
        property: "og:description",
        content:
          "Report issues, track clearances, and verify neighborhood repairs in Barangay Balibago, Angeles City.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { issues, language, setLanguage } = useBayanStore();
  const { user, login, signup, logout } = useAuth();
  const t = TRANSLATIONS[language];
  const [mounted, setMounted] = useState(false);

  // Live Map Section Filters
  const [mapCategory, setMapCategory] = useState<IssueCategory | "All">("All");

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
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-zinc-900 text-white font-bold text-sm shadow-sm">
              B
            </span>
            <div className="hidden min-[380px]:block">
              <span className="block font-display text-base font-bold tracking-tight text-zinc-900 leading-none">
                BayanLink
              </span>
              <span className="block text-[10px] font-mono text-zinc-500 font-semibold mt-0.5">
                Barangay Balibago, Angeles City
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
      <section className="relative overflow-hidden border-b border-zinc-200 bg-white py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            {/* Hero Left Column */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-1.5 text-xs font-mono font-semibold text-zinc-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Barangay Balibago · {mounted ? issues.filter((i) => i.status !== "Resident Verified").length : 5} issues open right now
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 leading-[1.08]">
                Serbisyo para sa bawat <span className="underline underline-offset-8 decoration-zinc-900">Purok</span> sa Balibago.
              </h1>

              <p className="text-base text-zinc-600 leading-relaxed max-w-xl">
                A transparent operations portal for Barangay Balibago. File concerns, track resolution in real time, and access every municipal service — from clearance to hotlines — in one place.
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

            {/* Hero Right Column: Balibago Image with Live Streaming Ticker */}
            <div className="surface-card overflow-hidden border border-zinc-200 bg-white rounded-3xl shadow-lg relative h-[380px] sm:h-[430px] flex flex-col justify-end">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{ backgroundImage: `url(${bgImage})` }}
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
      <section id="ops" className="py-16 sm:py-24 border-b border-zinc-200 bg-[#fafafa]">
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
            {/* Top Filter Category Bar */}
            <div className="flex items-center gap-2 p-4 border-b border-zinc-200 overflow-x-auto bg-zinc-50">
              <button
                onClick={() => setMapCategory("All")}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-mono font-bold uppercase transition-all shrink-0 border",
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
                      "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-mono font-bold uppercase transition-all shrink-0 border",
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

            {/* Split View: Map (Left/Top) & Separate Side Queue Panel (Right) */}
            <div className="grid lg:grid-cols-[1fr_360px] min-h-[460px]">
              {/* Main Map Tile Viewport */}
              <div className="relative min-h-[380px] lg:min-h-[460px] bg-zinc-100 border-b lg:border-b-0 lg:border-r border-zinc-200">
                <BarangayMap issues={filteredMapIssues} className="h-full w-full rounded-none border-none" />
              </div>

              {/* Separate Right Side Panel (HIGHEST IMPACT QUEUE) */}
              <div className="p-5 flex flex-col justify-between space-y-4 bg-white font-mono">
                <div>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-100 pb-3 mb-3">
                    HIGHEST IMPACT QUEUE
                  </h3>

                  <ul className="space-y-3">
                    <li className="flex items-center justify-between p-3 rounded-2xl border border-zinc-200 bg-zinc-50/50">
                      <div>
                        <span className="text-[11px] text-zinc-500 font-bold">BAL-2242 · Purok 5</span>
                        <p className="font-bold text-zinc-900 text-xs">Flooding</p>
                      </div>
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                        4H LEFT
                      </span>
                    </li>

                    <li className="flex items-center justify-between p-3 rounded-2xl border border-zinc-200 bg-zinc-50/50">
                      <div>
                        <span className="text-[11px] text-zinc-500 font-bold">BAL-2240 · Purok 3</span>
                        <p className="font-bold text-zinc-900 text-xs">Streetlight</p>
                      </div>
                      <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        1D
                      </span>
                    </li>

                    <li className="flex items-center justify-between p-3 rounded-2xl border border-zinc-200 bg-zinc-50/50">
                      <div>
                        <span className="text-[11px] text-zinc-500 font-bold">BAL-2237 · Purok 7</span>
                        <p className="font-bold text-zinc-900 text-xs">Garbage</p>
                      </div>
                      <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        2D
                      </span>
                    </li>

                    <li className="flex items-center justify-between p-3 rounded-2xl border border-emerald-200 bg-emerald-50/50">
                      <div>
                        <span className="text-[11px] text-emerald-800 font-bold">BAL-2231 · Purok 2</span>
                        <p className="font-bold text-emerald-900 text-xs">Water</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                        RESOLVED
                      </span>
                    </li>
                  </ul>
                </div>

                <Button asChild size="sm" className="w-full rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-white text-xs">
                  <Link to="/dashboard/issues">View Complete Queue ({issues.length})</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: § 03 · BALITA MULA SA KAPITAN */}
      <section id="news" className="py-16 sm:py-24 border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                § 03 · Balita mula sa Kapitan
              </span>
              <h2 className="text-3xl font-extrabold text-zinc-900 mt-1">
                Announcements
              </h2>
            </div>
            <Link to="/dashboard/announcements" className="text-xs font-mono font-bold text-zinc-900 hover:underline flex items-center gap-1">
              View all →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <article className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl space-y-3 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    Health
                  </span>
                  <span className="text-zinc-500">Aug 02</span>
                </div>
                <h3 className="text-base font-bold text-zinc-900">
                  Free medical mission at the covered court
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  General consult, BP monitoring, and free maintenance meds. Bring your barangay ID.
                </p>
              </div>
            </article>

            <article className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl space-y-3 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    Utilities
                  </span>
                  <span className="text-zinc-500">Jul 31</span>
                </div>
                <h3 className="text-base font-bold text-zinc-900">
                  Scheduled brownout, Puroks 3–5
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Meralco line maintenance from 9:00 AM to 12:00 PM. Charge devices in advance.
                </p>
              </div>
            </article>

            <article className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl space-y-3 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="bg-zinc-100 text-zinc-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    Peace & Order
                  </span>
                  <span className="text-zinc-500">Aug 04</span>
                </div>
                <h3 className="text-base font-bold text-zinc-900">
                  Barangay assembly — MacArthur Hwy update
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Kapitan will report on flood mitigation and pedestrian lane rehab.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* SECTION 4: § 04 · ANG INYONG LINGKOD-BAYAN */}
      <section id="officials" className="py-16 sm:py-24 border-b border-zinc-200 bg-[#fafafa]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
              § 04 · Ang inyong lingkod-bayan
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-900 mt-1">
              Officials of Balibago
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              Every filed concern is routed to the kagawad in charge. You'll see who's on the ticket.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl space-y-3 shadow-sm">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-zinc-900 text-white font-bold text-xs">
                P
              </span>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Hon. Joseph "PG" Ponce</h3>
                <p className="text-xs font-mono text-zinc-500">Punong Barangay</p>
              </div>
            </div>

            <div className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl space-y-3 shadow-sm">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-zinc-900 text-white font-bold text-xs">
                C
              </span>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Hon. Maria Cruz</h3>
                <p className="text-xs font-mono text-zinc-500">Kagawad — Peace & Order</p>
              </div>
            </div>

            <div className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl space-y-3 shadow-sm">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-zinc-900 text-white font-bold text-xs">
                S
              </span>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Hon. Ramon Santos</h3>
                <p className="text-xs font-mono text-zinc-500">Kagawad — Health</p>
              </div>
            </div>

            <div className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl space-y-3 shadow-sm">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-zinc-900 text-white font-bold text-xs">
                M
              </span>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Hon. Liza Mendoza</h3>
                <p className="text-xs font-mono text-zinc-500">Kagawad — Infrastructure</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: § 05 · SERBISYO */}
      <section id="services" className="py-16 sm:py-24 border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
              § 05 · Serbisyo
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-900 mt-1">
              Public services & documents
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              Request common barangay documents online. Pickup at the hall or e-delivery.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
            <div className="surface-card p-5 border border-zinc-200 bg-zinc-50/50 rounded-3xl space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 font-sans">Barangay Clearance</h3>
                <p className="text-zinc-500 text-xs mt-1">Same day turnaround</p>
              </div>
              <Button asChild size="sm" className="w-full rounded-full font-semibold bg-zinc-900 text-white text-xs">
                <Link to="/dashboard/services">Apply Online</Link>
              </Button>
            </div>

            <div className="surface-card p-5 border border-zinc-200 bg-zinc-50/50 rounded-3xl space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 font-sans">Certificate of Indigency</h3>
                <p className="text-zinc-500 text-xs mt-1">Same day turnaround</p>
              </div>
              <Button asChild size="sm" className="w-full rounded-full font-semibold bg-zinc-900 text-white text-xs">
                <Link to="/dashboard/services">Apply Online</Link>
              </Button>
            </div>

            <div className="surface-card p-5 border border-zinc-200 bg-zinc-50/50 rounded-3xl space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 font-sans">Business Permit Endorsement</h3>
                <p className="text-zinc-500 text-xs mt-1">2 days turnaround</p>
              </div>
              <Button asChild size="sm" className="w-full rounded-full font-semibold bg-zinc-900 text-white text-xs">
                <Link to="/dashboard/services">Apply Online</Link>
              </Button>
            </div>

            <div className="surface-card p-5 border border-zinc-200 bg-zinc-50/50 rounded-3xl space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 font-sans">Residency Certification</h3>
                <p className="text-zinc-500 text-xs mt-1">Same day turnaround</p>
              </div>
              <Button asChild size="sm" className="w-full rounded-full font-semibold bg-zinc-900 text-white text-xs">
                <Link to="/dashboard/services">Apply Online</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: § 06 · ISKEDYUL */}
      <section id="schedules" className="py-16 sm:py-24 border-b border-zinc-200 bg-[#fafafa]">
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
            <div className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl space-y-2 shadow-sm">
              <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase">TUE / THU / SAT</span>
              <h3 className="text-base font-bold text-zinc-900">Garbage collection</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Biodegradable, non-bio, recyclables — 5:30 AM start.
              </p>
            </div>

            <div className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl space-y-2 shadow-sm">
              <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase">WED · 09:00–12:00</span>
              <h3 className="text-base font-bold text-zinc-900">Brownout, Puroks 3–5</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Meralco line maintenance. Prepare for outage.
              </p>
            </div>

            <div className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl space-y-2 shadow-sm">
              <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase">SAT · 07:00</span>
              <h3 className="text-base font-bold text-zinc-900">Free medical mission</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Covered court. Consultations + free maintenance meds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: § 07 · EMERGENCY */}
      <section id="emergency" className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600">
              § 07 · Emergency
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-900 mt-1">
              May emergency? Dial the hotline first.
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-1 max-w-xl">
              File the concern here for record and follow-up — but for life-safety incidents, call the barangay tanod directly.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 font-mono text-xs">
            <div className="surface-card p-4 border border-zinc-200 bg-zinc-50 rounded-2xl space-y-1">
              <p className="font-bold text-zinc-900">24/7 barangay hotline</p>
              <p className="text-zinc-700 font-bold text-sm">+63 916-741-4383</p>
            </div>

            <div className="surface-card p-4 border border-zinc-200 bg-zinc-50 rounded-2xl space-y-1">
              <p className="font-bold text-zinc-900">Tanod dispatch</p>
              <p className="text-zinc-700 font-bold text-sm">1631</p>
            </div>

            <div className="surface-card p-4 border border-zinc-200 bg-zinc-50 rounded-2xl space-y-1">
              <p className="font-bold text-zinc-900">Health center</p>
              <p className="text-zinc-700 font-bold text-sm">0917-231-8842</p>
            </div>

            <div className="surface-card p-4 border border-zinc-200 bg-zinc-50 rounded-2xl space-y-1">
              <p className="font-bold text-zinc-900">Fire (BFP)</p>
              <p className="text-zinc-700 font-bold text-sm">911</p>
            </div>

            <div className="surface-card p-4 border border-zinc-200 bg-zinc-50 rounded-2xl space-y-1">
              <p className="font-bold text-zinc-900">Angeles PNP</p>
              <p className="text-zinc-700 font-bold text-sm">117</p>
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
