import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { BARANGAY_INFO } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { BarangayMap } from "@/components/barangay-map";
import {
  ArrowUpRight,
  ShieldCheck,
  PhoneCall,
  Building2,
  Flame,
  Shield,
  FileText,
  CheckCircle2,
  MapPin,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BayanLink Balibago — Barangay Balibago Public Service Portal" },
      {
        name: "description",
        content:
          "Official public portal for Barangay Balibago, Angeles City, Pampanga. Report issues, view active map reports, and track community service resolutions.",
      },
      { property: "og:title", content: "BayanLink Balibago — Live Issue Map & Public Services" },
      {
        property: "og:description",
        content:
          "Public service portal for Barangay Balibago, Angeles City: live issue map, community confirmations, and emergency directory.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { issues } = useBayanStore();

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-[#18181b]">
      {/* Top Banner */}
      <div className="border-b border-zinc-200/80 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>
              <strong className="text-white">{BARANGAY_INFO.name}</strong>, {BARANGAY_INFO.city}, {BARANGAY_INFO.province}
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Audit: {BARANGAY_INFO.lastAuditDate}</span>
            <a href={`tel:${BARANGAY_INFO.hotlineMobile}`} className="text-sky-400 font-semibold hover:underline">
              Hotline: {BARANGAY_INFO.hotlineMobile}
            </a>
          </div>
        </div>
      </div>

      {/* Header Bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-[#fafafa]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-zinc-900 text-white font-bold text-sm">
              B
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-zinc-900">
              BayanLink
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex">
            <a href="#live-map" className="transition-colors hover:text-zinc-900">
              Issue Map
            </a>
            <a href="#verification" className="transition-colors hover:text-zinc-900">
              Verification
            </a>
            <a href="#directory" className="transition-colors hover:text-zinc-900">
              Hotlines
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex rounded-full text-xs font-semibold">
              <Link to="/dashboard">Operations Desk</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white px-4">
              <Link to="/report">File a concern</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - MolKit Inspired Minimalist Design */}
      <section className="pt-16 pb-14 text-center px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex justify-center mb-4">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-zinc-100 text-zinc-900 font-bold border border-zinc-200">
              <Building2 className="h-5 w-5" />
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-zinc-900 leading-[1.1]">
            Civic reports, tracking, and public services.
          </h1>

          <p className="mt-4 text-base text-zinc-600 sm:text-lg max-w-xl mx-auto font-normal">
            A simple, transparent portal for Barangay Balibago, Angeles City. Report concerns, track resolution progress, and access municipal services.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-white px-6">
              <Link to="/report">
                File a concern <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full font-semibold border-zinc-300 text-zinc-800 px-6">
              <Link to="/dashboard/map">Explore map</Link>
            </Button>
          </div>

          {/* Minimal Stat Pills */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-600 border-t border-zinc-200 pt-8">
            <span className="bg-white px-4 py-2 rounded-full border border-zinc-200">
              <strong className="text-zinc-900">{issues.length}</strong> Active Reports
            </span>
            <span className="bg-white px-4 py-2 rounded-full border border-zinc-200">
              <strong className="text-zinc-900">8</strong> Covered Puroks
            </span>
            <span className="bg-white px-4 py-2 rounded-full border border-zinc-200">
              <strong className="text-emerald-700">100%</strong> Resident Verified
            </span>
          </div>
        </div>
      </section>

      {/* Clean Embedded Map Container */}
      <section id="live-map" className="py-10 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="surface-card p-4 border border-zinc-200 rounded-3xl bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-zinc-900">
                  Barangay Balibago Schematic Map
                </span>
              </div>
              <span className="text-xs text-zinc-500 font-mono">Angeles City</span>
            </div>

            <div className="mt-3 overflow-hidden rounded-2xl border border-zinc-200">
              <BarangayMap issues={issues} compact={false} className="h-[340px] sm:h-[400px]" />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-zinc-600">
              <span className="flex items-center gap-1 font-mono">
                <MapPin className="h-3.5 w-3.5 text-zinc-900" /> MacArthur Hwy & Fields Ave Corridor
              </span>
              <Link to="/dashboard/map" className="font-semibold text-zinc-900 hover:underline flex items-center gap-0.5">
                Full map view <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Section */}
      <section id="verification" className="py-16 px-4 sm:px-6 border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-bold sm:text-3xl tracking-tight text-zinc-900">
              Resident Resolution Verification
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Public reports require confirmation by local residents before ticket resolution is finalized.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="surface-card p-5 border border-zinc-200 bg-zinc-50/50 rounded-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-zinc-900 text-white font-bold text-xs mb-3">
                1
              </span>
              <h3 className="text-sm font-bold text-zinc-900">Public Report Intake</h3>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                Residents log municipal issues with photo evidence and optional anonymous tracking codes.
              </p>
            </div>

            <div className="surface-card p-5 border border-zinc-200 bg-zinc-50/50 rounded-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-zinc-900 text-white font-bold text-xs mb-3">
                2
              </span>
              <h3 className="text-sm font-bold text-zinc-900">Inspector Dispatch</h3>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                Barangay engineering and public works crews are assigned to physical repair sites.
              </p>
            </div>

            <div className="surface-card p-5 border border-zinc-200 bg-zinc-50/50 rounded-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-600 text-white font-bold text-xs mb-3">
                3
              </span>
              <h3 className="text-sm font-bold text-zinc-900">Resident Confirmation</h3>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                Purok residents vote to verify the physical resolution before the ticket is closed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Directory */}
      <section id="directory" className="py-16 px-4 sm:px-6 bg-[#fafafa]">
        <div className="mx-auto max-w-4xl">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-bold sm:text-3xl tracking-tight text-zinc-900">
              Emergency Hotlines
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Direct emergency contact numbers for Barangay Balibago.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="surface-card p-5 border border-zinc-200 bg-white rounded-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">Barangay Hall</p>
              <a href={`tel:${BARANGAY_INFO.hotlineLandline.split("/")[0].trim()}`} className="mt-2 block font-mono text-sm font-bold text-zinc-900 hover:underline">
                {BARANGAY_INFO.hotlineLandline}
              </a>
            </div>

            <div className="surface-card p-5 border border-zinc-200 bg-white rounded-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">Police Substation 4</p>
              <a href="tel:0458930931" className="mt-2 block font-mono text-sm font-bold text-zinc-900 hover:underline">
                (045) 893-0931
              </a>
            </div>

            <div className="surface-card p-5 border border-zinc-200 bg-white rounded-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">Fire Substation</p>
              <a href="tel:0453220671" className="mt-2 block font-mono text-sm font-bold text-zinc-900 hover:underline">
                (045) 322-0671
              </a>
            </div>

            <div className="surface-card p-5 border border-zinc-200 bg-white rounded-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">ACDRRMO Disaster</p>
              <a href="tel:09178519581" className="mt-2 block font-mono text-sm font-bold text-zinc-900 hover:underline">
                0917-851-9581
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
