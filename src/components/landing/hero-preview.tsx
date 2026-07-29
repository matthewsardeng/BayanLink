import { useEffect, useMemo, useState } from "react";
import { BarangayMap } from "@/components/barangay-map";
import { ISSUES } from "@/data/barangay";
import { LifecycleTrack, StatusPill } from "@/components/status";
import { Sparkles, MapPin, Users, ShieldCheck } from "lucide-react";

const SCRIPT = "Baha na naman sa Mabini corner Rizal, hanggang tuhod, di na madaanan ng tricycle.";

/**
 * Hero preview: a live "report → map → community → resolution" loop that plays
 * itself, so visitors see the whole civic pipeline in one glance.
 */
export function HeroPreview() {
  const [typed, setTyped] = useState("");
  const [stage, setStage] = useState(0);

  useEffect(() => {
    let i = 0;
    const type = setInterval(() => {
      i += 1;
      setTyped(SCRIPT.slice(0, i));
      if (i >= SCRIPT.length) clearInterval(type);
    }, 38);
    return () => clearInterval(type);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setStage((s) => (s + 1) % 3), 2600);
    return () => clearInterval(id);
  }, []);

  const issue = ISSUES[0];
  const shown = useMemo(() => ISSUES.slice(0, stage === 0 ? 4 : stage === 1 ? 6 : 8), [stage]);

  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-brand/10 blur-2xl" />
      <div className="grid gap-3 rounded-[1.75rem] border border-border bg-card/80 p-3 shadow-[var(--shadow-lift)] backdrop-blur md:grid-cols-[1.15fr_1fr] md:p-4">
        {/* live map panel */}
        <div className="relative overflow-hidden rounded-2xl border border-border">
          <BarangayMap
            issues={shown}
            className="h-[240px] sm:h-[300px] md:h-full md:min-h-[340px]"
          />
          <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-semibold shadow-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-danger" />
              Live · {shown.length} active issues
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-medium shadow-sm">
              <MapPin className="h-3 w-3" /> Purok 1–7
            </span>
          </div>
        </div>

        {/* right rail */}
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-border bg-surface-2 p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-brand">
              <Sparkles className="h-3.5 w-3.5" /> Describe it your way
            </div>
            <p className="mt-2 min-h-[3.25rem] text-sm leading-snug">
              {typed}
              <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-foreground" />
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[
                { k: "Category", v: "Flooding" },
                { k: "Severity", v: "Critical" },
                { k: "Location", v: "Mabini × Rizal" },
                { k: "Risk", v: "Impassable route" },
              ].map((chip) => (
                <span
                  key={chip.k}
                  className="rounded-full border border-border bg-card px-2 py-1 text-[10px] font-medium"
                >
                  <span className="text-muted-foreground">{chip.k}: </span>
                  {chip.v}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{issue.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {issue.code} · {issue.purok}
                </p>
              </div>
              <StatusPill status={issue.status} />
            </div>
            <div className="mt-3">
              <LifecycleTrack status={issue.status} compact />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-xl bg-surface-2 p-2">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-3 w-3" /> Confirmed by
                </div>
                <p className="text-sm font-semibold">{issue.confirmations} residents</p>
              </div>
              <div className="rounded-xl bg-surface-2 p-2">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <ShieldCheck className="h-3 w-3" /> Impact score
                </div>
                <p className="text-sm font-semibold">{issue.impact}/100</p>
              </div>
            </div>
            <p className="mt-2 rounded-xl bg-signal/15 p-2 text-[11px] leading-snug">
              <span className="font-semibold">Next: </span>
              {issue.nextAction}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-3">
            <p className="text-[11px] font-semibold text-muted-foreground">
              Recurring pattern detected
            </p>
            <p className="mt-1 text-sm">
              <span className="font-semibold">20 flooding reports</span> in 8 months grouped into
              one community problem.
            </p>
            <div className="mt-2 flex h-8 items-end gap-1">
              {[4, 7, 5, 9, 12, 15, 18, 20].map((v, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-sm bg-brand/70"
                  style={{ height: `${(v / 20) * 100}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
