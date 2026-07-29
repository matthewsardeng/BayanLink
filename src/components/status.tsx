import { cn } from "@/lib/utils";
import { LIFECYCLE, type IssueStatus, type Severity } from "@/data/barangay";
import { Check } from "lucide-react";

const statusTone: Record<IssueStatus, string> = {
  Reported: "bg-muted text-muted-foreground",
  Verified: "bg-brand-soft text-brand",
  Assigned: "bg-brand-soft text-brand",
  Scheduled: "bg-warning/20 text-warning-foreground",
  "In Progress": "bg-signal/25 text-signal-foreground",
  Completed: "bg-success/20 text-success",
  "Resident Verified": "bg-success text-success-foreground",
};

export function StatusPill({ status, className }: { status: IssueStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap",
        statusTone[status],
        className,
      )}
    >
      {status === "Resident Verified" && <Check className="h-3 w-3" />}
      {status}
    </span>
  );
}

const sevTone: Record<Severity, string> = {
  Low: "bg-muted-foreground",
  Moderate: "bg-warning",
  High: "bg-signal",
  Critical: "bg-danger",
};

export function SeverityTag({ severity }: { severity: Severity }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
      <span className={cn("h-2 w-2 rounded-full", sevTone[severity])} />
      {severity}
    </span>
  );
}

export function LifecycleTrack({ status, compact }: { status: IssueStatus; compact?: boolean }) {
  const idx = LIFECYCLE.indexOf(status);
  return (
    <div className="flex items-center gap-1">
      {LIFECYCLE.map((s, i) => (
        <div key={s} className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span
            className={cn(
              "h-1.5 rounded-full transition-colors",
              i < idx ? "bg-primary" : i === idx ? "bg-signal" : "bg-border",
            )}
          />
          {!compact && (
            <span
              className={cn(
                "truncate text-[10px]",
                i === idx ? "font-semibold text-foreground" : "text-muted-foreground",
              )}
            >
              {s}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function ImpactMeter({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full"
          style={{
            width: `${score}%`,
            background:
              score > 80 ? "var(--danger)" : score > 60 ? "var(--signal)" : "var(--primary)",
          }}
        />
      </div>
      <span className="text-xs font-semibold tabular-nums">{score}</span>
    </div>
  );
}
