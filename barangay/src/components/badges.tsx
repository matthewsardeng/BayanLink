import { BadgeCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function OfficialBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-official-soft px-2 py-0.5 text-[11px] font-semibold tracking-wide text-official uppercase",
        className,
      )}
    >
      <BadgeCheck className="size-3.5" aria-hidden />
      Official
    </span>
  );
}

export function CommunityBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase",
        className,
      )}
    >
      <Users className="size-3.5" aria-hidden />
      Community
    </span>
  );
}

export function CategoryChip({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground",
        className,
      )}
    >
      {label}
    </span>
  );
}

const TONE: Record<string, string> = {
  submitted: "bg-secondary text-secondary-foreground",
  under_review: "bg-warning/20 text-warning-foreground",
  verified: "bg-official-soft text-official",
  acknowledged: "bg-official-soft text-official",
  assigned: "bg-official-soft text-official",
  processing: "bg-official-soft text-official",
  in_progress: "bg-accent-soft text-accent",
  ready_for_claim: "bg-accent-soft text-accent",
  completed: "bg-primary-soft text-primary",
  implemented: "bg-primary-soft text-primary",
  closed: "bg-muted text-muted-foreground",
  declined: "bg-muted text-muted-foreground",
  rejected: "bg-destructive/15 text-destructive",
};

export function StatusPill({ status, label }: { status: string; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        TONE[status] ?? "bg-secondary text-secondary-foreground",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {label}
    </span>
  );
}

export function CommunityContentNotice({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)}>
      Community content is posted by residents and is not official barangay information.
    </p>
  );
}
