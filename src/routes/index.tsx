import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { BARANGAY_INFO } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { BarangayMap } from "@/components/barangay-map";
import {
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Building2,
  Flame,
  Shield,
  FileText,
  CheckCircle2,
  MapPin,
  Clock,
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
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Barangay Balibago Top Header */}
      <div className="border-b border-border bg-slate-900 px-4 py-2 text-xs font-medium text-slate-200">
        <div className="mx-auto flex max-w-[1300px] flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>
              <strong className="text-white">{BARANGAY_INFO.name}</strong>, {BARANGAY_INFO.city}, {BARANGAY_INFO.province}{" "}
              · {BARANGAY_INFO.captainTitle}: {BARANGAY_INFO.captain}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-mono text-[11px]">
            <span className="text-slate-400">Audit Date: {BARANGAY_INFO.lastAuditDate}</span>
            <a
              href={`tel:${BARANGAY_INFO.hotlineMobile}`}
              className="inline-flex items-center gap-1 font-semibold text-sky-400 hover:text-sky-300"
            >
              <PhoneCall className="h-3 w-3" /> Hotline: {BARANGAY_INFO.hotlineMobile}
            </a>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[1300px] items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-sky-600 text-white font-bold shadow-sm">
              <Building2 className="h-5 w-5" />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold leading-tight tracking-tight text-slate-900">
                BayanLink Balibago
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Angeles City · Region III
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#live-map" className="transition-colors hover:text-slate-900">
              Interactive Map
            </a>
            <a href="#verification" className="transition-colors hover:text-slate-900">
              Resident Verification
            </a>
            <a href="#directory" className="transition-colors hover:text-slate-900">
              Emergency Hotlines
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex font-semibold">
              <Link to="/dashboard">Operations Desk</Link>
            </Button>
            <Button asChild size="sm" className="font-semibold bg-sky-600 hover:bg-sky-500 text-white">
              <Link to="/report">File a Concern</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border bg-slate-50/60 py-12 sm:py-16">
        <div className="mx-auto grid w-full max-w-[1300px] items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 mb-4">
              Barangay Balibago Public Operations Desk
            </div>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl tracking-tight text-slate-900">
              Report & Track Community Concerns in Balibago
            </h1>
            <p className="mt-4 text-base text-slate-600 leading-relaxed sm:text-lg">
              Submit municipal concerns directly to{" "}
              <strong className="text-slate-900">Barangay Balibago</strong> — from drainage blockages on Fields Avenue to streetlights in Sta. Maria Village. Track repair progress on the interactive map.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="gap-2 font-semibold bg-sky-600 hover:bg-sky-500 text-white">
                <Link to="/report">
                  File a Concern <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-semibold">
                <Link to="/dashboard/map">Open Issue Map</Link>
              </Button>
            </div>

            {/* Quick Metrics */}
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-slate-200 pt-5 font-mono text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                <dt className="text-2xl font-bold text-slate-900">{issues.length}</dt>
                <dd className="text-[11px] text-slate-500 mt-0.5">Active Reports</dd>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                <dt className="text-2xl font-bold text-slate-900">8</dt>
                <dd className="text-[11px] text-slate-500 mt-0.5">Covered Puroks</dd>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                <dt className="text-2xl font-bold text-emerald-600">100%</dt>
                <dd className="text-[11px] text-slate-500 mt-0.5">Verified Protocol</dd>
              </div>
            </div>
          </div>

          {/* Interactive Map Preview */}
          <div
            id="live-map"
            className="surface-card p-4 border border-slate-200 shadow-md rounded-2xl bg-white"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-xs font-bold text-slate-900">
                  Barangay Balibago Issue Map
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">OpenStreetMap</span>
            </div>

            <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
              <BarangayMap issues={issues} compact={false} className="h-[320px] sm:h-[360px]" />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-sky-600" /> MacArthur Hwy & Fields Ave District
              </span>
              <Link
                to="/dashboard/map"
                className="font-semibold text-sky-600 hover:underline flex items-center gap-1"
              >
                Expand Full Map <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Protocol Section */}
      <section id="verification" className="py-14 sm:py-20 border-b border-border bg-white">
        <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold sm:text-3xl tracking-tight text-slate-900">
              Resident Resolution Verification
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Reports submitted to Barangay Balibago require local resident confirmation before being marked fully resolved.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <div className="surface-card p-6 lg:col-span-2 border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-600 text-white font-bold">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Community Resolution Protocol</h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Barangay Balibago Transparency Protocol
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-700 leading-relaxed">
                When maintenance work is completed by barangay staff or city engineers, nearby residents in that purok receive confirmation prompts. A ticket is permanently closed only when local residents confirm the physical repair.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-mono">
                <span className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 font-semibold text-slate-800 shadow-sm flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Photo Proof Required
                </span>
                <span className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 font-semibold text-slate-800 shadow-sm flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Resident Confirmation Vote
                </span>
                <span className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 font-semibold text-slate-800 shadow-sm flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Re-open if Unresolved
                </span>
              </div>
            </div>

            <div className="surface-card p-6 border border-slate-200 flex flex-col justify-between bg-white">
              <div>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">Submit a Concern</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Have a road defect, unlit lamp, or water issue in your neighborhood?
                </p>
              </div>
              <Button asChild className="mt-6 font-semibold bg-sky-600 hover:bg-sky-500 text-white">
                <Link to="/report">File a Concern Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Hotline Directory */}
      <section id="directory" className="py-14 sm:py-20 bg-slate-50/50">
        <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold sm:text-3xl tracking-tight text-slate-900">
              Emergency Contact Directory
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Direct hotlines for Barangay Balibago dispatch, police station, and disaster management.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="surface-card p-5 border border-slate-200 bg-white">
              <div className="flex items-center gap-2 text-sky-700 font-semibold text-sm">
                <Building2 className="h-4 w-4" /> Barangay Hall Desk
              </div>
              <p className="mt-2 text-xs font-mono text-slate-500">
                {BARANGAY_INFO.address}
              </p>
              <a
                href={`tel:${BARANGAY_INFO.hotlineLandline.split("/")[0].trim()}`}
                className="mt-3 block font-mono text-sm font-bold text-slate-900 hover:text-sky-600"
              >
                {BARANGAY_INFO.hotlineLandline}
              </a>
            </div>

            <div className="surface-card p-5 border border-slate-200 bg-white">
              <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
                <Shield className="h-4 w-4" /> Police Station 4 (Balibago)
              </div>
              <p className="mt-2 text-xs text-slate-500 font-mono">
                Balibago Police Substation
              </p>
              <a
                href="tel:0458930931"
                className="mt-3 block font-mono text-sm font-bold text-slate-900 hover:text-blue-600"
              >
                (045) 893-0931 / (045) 322-2146
              </a>
            </div>

            <div className="surface-card p-5 border border-slate-200 bg-white">
              <div className="flex items-center gap-2 text-rose-700 font-semibold text-sm">
                <Flame className="h-4 w-4" /> BFP Balibago Substation
              </div>
              <p className="mt-2 text-xs text-slate-500 font-mono">
                BFP Angeles City Fire Station
              </p>
              <a
                href="tel:0453220671"
                className="mt-3 block font-mono text-sm font-bold text-slate-900 hover:text-rose-600"
              >
                (045) 322-0671 / 0995-822-3620
              </a>
            </div>

            <div className="surface-card p-5 border border-slate-200 bg-white">
              <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm">
                <PhoneCall className="h-4 w-4" /> Angeles City DRRMO
              </div>
              <p className="mt-2 text-xs text-slate-500 font-mono">
                Disaster Risk Reduction Office
              </p>
              <a
                href="tel:09178519581"
                className="mt-3 block font-mono text-sm font-bold text-slate-900 hover:text-amber-600"
              >
                0917-851-9581 / 0998-842-7746
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
