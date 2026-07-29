import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BARANGAY_INFO, ISSUES, SERVICES, PUROKS } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-store";
import { TRANSLATIONS } from "@/lib/i18n";
import { BarangayMap } from "@/components/barangay-map";
import { StatusPill, ImpactMeter } from "@/components/status";
import { BeforeAfter } from "@/components/before-after";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Map,
  ShieldCheck,
  ArrowRight,
  Phone,
  FileCheck,
  CheckCircle2,
  Lock,
  Building2,
  Users,
  Search,
  Globe,
  Clock,
  Sparkles,
  Vote,
  AlertTriangle,
  User,
  LogOut,
  X,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BayanLink Balibago — Live Barangay Map & Public Service Explorer" },
      {
        name: "description",
        content:
          "Official civic operating system for Barangay Balibago, Angeles City. Live issue map, resident-verified fixes, and online barangay clearance applications.",
      },
      { property: "og:title", content: "BayanLink Balibago — Live Barangay Map & Public Services" },
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

  const featuredProofIssue = issues.find((i) => i.proof) || issues[0];
  const totalOpenCount = mounted ? issues.filter((i) => i.status !== "Resident Verified").length : 8;

  const CIVIC_RULES = [
    {
      title: "Your neighbour already reported it",
      body: "Nearby duplicate reports get merged into one powerful ticket carrying all resident voices instead of unread duplicates.",
      icon: Users,
    },
    {
      title: "Loudest doesn't win",
      body: "Priority is calculated objectively by households affected, safety risk, and waiting time — not by political influence.",
      icon: ImpactMeter,
    },
    {
      title: "Twenty reports is a pattern, not twenty isolated issues",
      body: "The system highlights recurring seasonal drainage overflow along MacArthur Corridor with 8 months of historical telemetry.",
      icon: AlertTriangle,
    },
    {
      title: "Names & logs on every step",
      body: "Reported, Verified, Assigned, Scheduled, In Progress — transparent audit logs on every status transition.",
      icon: FileCheck,
    },
    {
      title: "Nothing closes until residents confirm it's fixed",
      body: "Barangay officials cannot self-close tickets. 5 nearby residents confirm the physical repair or it automatically reopens.",
      icon: ShieldCheck,
    },
  ];

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
      {/* Sticky Top Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-zinc-900 text-white font-bold text-sm shadow-sm">
              B
            </span>
            <div>
              <span className="block font-display text-base font-bold tracking-tight text-zinc-900 leading-none">
                BayanLink
              </span>
              <span className="block text-[10px] font-mono text-zinc-500 font-semibold mt-0.5">
                Barangay Balibago, Angeles City
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-600">
            <a href="#rules" className="hover:text-zinc-900 transition-colors">
              Civic Guarantees
            </a>
            <a href="#proof" className="hover:text-zinc-900 transition-colors">
              Proof of Work
            </a>
            <a href="#map" className="hover:text-zinc-900 transition-colors">
              Live Map
            </a>
            <a href="#services" className="hover:text-zinc-900 transition-colors">
              Public Services
            </a>
            <a href="#contacts" className="hover:text-zinc-900 transition-colors">
              Emergency Hotlines
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Language dropdown */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-600 bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-200">
              <Globe className="h-3.5 w-3.5 text-zinc-700" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent text-xs text-zinc-900 font-semibold outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="tl">Tagalog</option>
                <option value="pam">Kapampangan</option>
              </select>
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-700 hidden sm:inline font-bold">
                  {user.name} ({user.purok})
                </span>
                <Button size="sm" variant="outline" onClick={logout} className="rounded-full text-xs font-semibold border-zinc-300">
                  <LogOut className="h-3.5 w-3.5 mr-1" /> Sign Out
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
                className="rounded-full text-xs font-semibold border-zinc-300"
              >
                <User className="h-3.5 w-3.5 mr-1 text-zinc-900" /> Resident Sign In
              </Button>
            )}

            <Button asChild size="sm" className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold px-4">
              <Link to="/report">{t.reportAnIssue} ↗</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-1.5 text-xs font-mono font-semibold text-zinc-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {BARANGAY_INFO.name} · {totalOpenCount} issues open right now
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 leading-[1.08]">
                Nothing closes until <span className="underline underline-offset-8 decoration-zinc-900">you</span> say it's fixed.
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">
                Say it the way you'd tell a neighbour — <em>"baha na naman sa Fields Ave."</em> It lands on the live Balibago map, your street confirms it, and crews cannot mark it done without 5 resident votes.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button asChild size="lg" className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold px-7 text-sm">
                  <Link to="/report">File a Concern Now <ArrowRight className="h-4 w-4 ml-1.5" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-zinc-300 font-semibold px-7 text-sm">
                  <Link to="/dashboard">Explore Operations Desk</Link>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-100 text-xs font-mono text-zinc-500">
                <div>
                  <span className="block font-bold text-base text-zinc-900">42,274</span>
                  Residents Served
                </div>
                <div>
                  <span className="block font-bold text-base text-zinc-900">8 Puroks</span>
                  Complete Coverage
                </div>
                <div>
                  <span className="block font-bold text-base text-zinc-900">96.8%</span>
                  SLA Compliance
                </div>
              </div>
            </div>

            {/* Map Preview Card */}
            <div className="surface-card overflow-hidden border border-zinc-200 bg-white rounded-3xl shadow-lg relative h-[420px]">
              <div className="absolute top-3 left-3 z-10 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200 px-3 py-1 text-xs font-mono font-bold text-zinc-900 shadow-sm">
                Barangay Balibago GIS Map
              </div>
              <BarangayMap issues={issues} className="h-full w-full rounded-none border-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 5 CORE CIVIC GUARANTEES GRID */}
      <section id="rules" className="py-16 sm:py-20 border-b border-zinc-200 bg-[#fafafa]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
              Civic Operating Principles
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-900 mt-1">
              How BayanLink Protects Every Resident
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              Designed around transparency, resident confirmation, and objective priority metrics.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CIVIC_RULES.map((rule, idx) => (
              <div
                key={rule.title}
                className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl space-y-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-900 text-white font-bold text-xs font-mono">
                  0{idx + 1}
                </span>
                <h3 className="text-base font-bold text-zinc-900">{rule.title}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">{rule.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSPECTABLE PROOF OF WORK */}
      {featuredProofIssue && (
        <section id="proof" className="py-16 sm:py-20 border-b border-zinc-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] items-center">
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                  Inspectable Proof of Work
                </span>
                <h2 className="text-3xl font-extrabold text-zinc-900">
                  Real Physical Fixes, Resident Verified.
                </h2>
                <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
                  "{featuredProofIssue.summary}"
                </p>
                <div className="flex items-center gap-3">
                  <StatusPill status={featuredProofIssue.status} />
                  <span className="text-xs font-mono text-zinc-500">
                    {featuredProofIssue.confirmations} resident votes cast
                  </span>
                </div>
              </div>

              {featuredProofIssue.proof && (
                <div className="surface-card p-4 border border-zinc-200 bg-white rounded-3xl shadow-sm">
                  <p className="text-xs font-mono font-bold uppercase text-zinc-500 mb-3">
                    Drag slider to compare Before & After
                  </p>
                  <BeforeAfter before={featuredProofIssue.proof.before} after={featuredProofIssue.proof.after} />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* PUBLIC SERVICES DIRECTORY */}
      <section id="services" className="py-16 sm:py-20 border-b border-zinc-200 bg-[#fafafa]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                Barangay Hall Services
              </span>
              <h2 className="text-2xl font-extrabold text-zinc-900 mt-1">
                Official Clearances & Public Permits
              </h2>
            </div>
            <Button asChild size="sm" variant="outline" className="rounded-full text-xs font-semibold border-zinc-300">
              <Link to="/dashboard/services">View All Services ↗</Link>
            </Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <div key={s.id} className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl space-y-3 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">{s.group}</span>
                  <h3 className="text-sm font-bold text-zinc-900 mt-1">{s.name}</h3>
                  <p className="text-xs font-mono text-zinc-600 mt-2 bg-zinc-50 p-2 rounded-xl border border-zinc-200">
                    Processing: {s.time} · {s.fee}
                  </p>
                </div>
                <Button asChild size="sm" className="w-full rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-white text-xs mt-3">
                  <Link to="/dashboard/services">Apply Online</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMERGENCY HOTLINES DIRECTORY */}
      <section id="contacts" className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
              Emergency & Desk Hotlines
            </span>
            <h2 className="text-2xl font-extrabold text-zinc-900 mt-1">
              Barangay Balibago Emergency Contacts
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
            <div className="surface-card p-4 border border-zinc-200 bg-zinc-50 rounded-2xl space-y-1">
              <p className="font-bold text-zinc-900">Barangay Hall Desk</p>
              <p className="text-zinc-600">{BARANGAY_INFO.hotlineLandline}</p>
            </div>
            <div className="surface-card p-4 border border-zinc-200 bg-zinc-50 rounded-2xl space-y-1">
              <p className="font-bold text-zinc-900">24/7 Mobile Hotline</p>
              <p className="text-zinc-600">{BARANGAY_INFO.hotlineMobile}</p>
            </div>
            <div className="surface-card p-4 border border-zinc-200 bg-zinc-50 rounded-2xl space-y-1">
              <p className="font-bold text-zinc-900">Police Substation 4</p>
              <p className="text-zinc-600">{BARANGAY_INFO.policeStation}</p>
            </div>
            <div className="surface-card p-4 border border-zinc-200 bg-zinc-50 rounded-2xl space-y-1">
              <p className="font-bold text-zinc-900">BFP Fire Substation</p>
              <p className="text-zinc-600">{BARANGAY_INFO.fireStation}</p>
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
