import { useRef, useState } from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export function BeforeAfter({ before, after }: { before: string; after?: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const afterText = after || "Resolution completed and verified by Barangay Balibago Public Works.";

  return (
    <div
      ref={ref}
      className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border select-none bg-slate-900 shadow-md"
    >
      {/* Background Graphic Component (AFTER - Repaired Road) */}
      <div className="absolute inset-0 bg-slate-950 flex flex-col justify-between p-4">
        {/* SVG Drawing of Repaired Road */}
        <svg viewBox="0 0 400 225" className="absolute inset-0 h-full w-full opacity-60">
          <rect width="400" height="225" fill="#1e293b" />
          <rect y="0" width="400" height="20" fill="#475569" />
          <rect y="20" width="400" height="4" fill="#94a3b8" />
          <line
            x1="0"
            y1="112"
            x2="400"
            y2="112"
            stroke="#facc15"
            strokeWidth="6"
            strokeDasharray="24 16"
          />
          <polygon
            points="120,60 280,55 310,170 110,185"
            fill="#0f172a"
            stroke="#334155"
            strokeWidth="2"
          />
        </svg>

        <div className="relative z-10 flex items-center justify-between text-emerald-400 font-mono text-xs">
          <span className="inline-flex items-center gap-1.5 bg-emerald-950/90 border border-emerald-500/40 px-2.5 py-1 rounded-md font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" /> REPAIRED & VERIFIED
          </span>
          <span className="bg-slate-900/80 px-2 py-1 rounded text-[11px] text-slate-300">
            Jul 28, 2026 11:00 PST
          </span>
        </div>

        <div className="relative z-10 bg-slate-900/90 backdrop-blur border border-slate-800 p-3 rounded-xl max-w-[85%] ml-auto">
          <p className="text-xs font-semibold text-slate-100">{afterText}</p>
          <p className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1 font-mono">
            <ShieldCheck className="h-3 w-3" /> 12 Local Residents Voted Resolved
          </p>
        </div>
      </div>

      {/* Foreground Overlay (BEFORE - Damaged Road) */}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden bg-slate-900 border-r border-amber-500/60 shadow-2xl flex flex-col justify-between p-4"
        style={{ width: `${pos}%` }}
      >
        <div className="w-[400px] h-full absolute inset-0">
          <svg viewBox="0 0 400 225" className="h-full w-full opacity-70">
            <rect width="400" height="225" fill="#334155" />
            <rect y="0" width="400" height="20" fill="#64748b" />
            <path
              d="M50 40 L90 80 L130 70 L180 130 L220 120"
              stroke="#0f172a"
              strokeWidth="4"
              fill="none"
            />
            <path d="M120 140 L160 190 L210 180" stroke="#0f172a" strokeWidth="3" fill="none" />
            <polygon
              points="120,60 280,55 310,170 110,185"
              fill="#0f172a"
              stroke="#dc2626"
              strokeWidth="3"
              strokeDasharray="4 4"
            />
            <ellipse cx="200" cy="115" rx="70" ry="40" fill="#020617" />
            <text
              x="200"
              y="120"
              textAnchor="middle"
              fill="#ef4444"
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
            >
              INSPECTION SITE
            </text>
          </svg>
        </div>

        <div className="relative z-10 flex items-center justify-between text-amber-400 font-mono text-xs w-[350px]">
          <span className="inline-flex items-center gap-1.5 bg-amber-950/90 border border-amber-500/40 px-2.5 py-1 rounded-md font-semibold">
            <AlertTriangle className="h-3.5 w-3.5" /> INITIAL REPORT
          </span>
          <span className="bg-slate-900/80 px-2 py-1 rounded text-[11px] text-slate-300">
            Jul 20, 2026 10:00 PST
          </span>
        </div>

        <div className="relative z-10 bg-slate-900/90 backdrop-blur border border-slate-800 p-3 rounded-xl w-[320px]">
          <p className="text-xs font-semibold text-slate-100">{before}</p>
          <p className="text-[11px] text-amber-400 mt-0.5 font-mono">
            Reported by Barangay Resident
          </p>
        </div>
      </div>

      {/* Slider Divider Bar */}
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-amber-400 z-30"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute top-1/2 left-1/2 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-amber-400 text-slate-950 font-bold shadow-lg text-xs">
          ↔
        </span>
      </div>

      {/* Range Input Control */}
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        aria-label="Compare before and after infrastructure repair"
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0 z-40"
      />
    </div>
  );
}
