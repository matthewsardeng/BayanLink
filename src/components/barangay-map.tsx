import { useState } from "react";
import { cn } from "@/lib/utils";
import { BARANGAY_INFO, categoryColor, CATEGORIES, type Issue, type IssueCategory } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { StatusPill } from "@/components/status";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  ShieldCheck,
  MapPin,
  Waves,
  Construction,
  Lightbulb,
  Trash2,
  PawPrint,
  AlertTriangle,
  Droplets,
  Crosshair,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  issues: Issue[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onPick?: (lat: number, lng: number) => void;
  className?: string;
  compact?: boolean;
  pickedCoords?: { lat: number; lng: number } | null;
};

export function CategoryIcon({
  category,
  className = "h-3.5 w-3.5",
}: {
  category: IssueCategory;
  className?: string;
}) {
  switch (category) {
    case "Flooding":
      return <Waves className={className} />;
    case "Road Damage":
      return <Construction className={className} />;
    case "Streetlight":
      return <Lightbulb className={className} />;
    case "Garbage":
      return <Trash2 className={className} />;
    case "Stray Animals":
      return <PawPrint className={className} />;
    case "Water Supply":
      return <Droplets className={className} />;
    case "Safety Hazard":
    default:
      return <AlertTriangle className={className} />;
  }
}

/**
 * Ultra-clean, minimal schematic vector map for Barangay Balibago.
 * Replaces detailed raster map clutter with a sleek, minimalist land schema,
 * clean road lines, category filters, and pin-point reporting.
 */
export function BarangayMap({
  issues,
  selectedId: externalSelectedId,
  onSelect,
  onPick,
  className,
  compact = false,
  pickedCoords = null,
}: Props) {
  const { confirmIssue } = useBayanStore();
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | "All">("All");
  const [zoom, setZoom] = useState(1);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  const activeSelectedId = externalSelectedId ?? internalSelectedId;

  const filteredIssues = issues.filter(
    (i) => categoryFilter === "All" || i.category === categoryFilter
  );

  const selectedIssue = issues.find((i) => i.id === activeSelectedId);

  const handlePinClick = (id: string) => {
    setInternalSelectedId(id);
    onSelect?.(id);
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onPick) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Convert SVG 0-100 coords to lat/lng centered on Barangay Balibago
    const lat = BARANGAY_INFO.coordinates.lat + (0.5 - clickY / 100) * 0.015;
    const lng = BARANGAY_INFO.coordinates.lng + (clickX / 100 - 0.5) * 0.02;
    onPick(lat, lng);
  };

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-zinc-50 border border-zinc-200 font-sans rounded-2xl text-zinc-900 shadow-sm",
        className
      )}
    >
      {/* Category Filter Pills Bar */}
      {!compact && (
        <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-full border border-zinc-200 pointer-events-auto shadow-sm text-xs">
            <button
              onClick={() => setCategoryFilter("All")}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-full transition-colors",
                categoryFilter === "All"
                  ? "bg-zinc-900 text-white font-bold"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
              )}
            >
              All ({issues.length})
            </button>
            {CATEGORIES.map((c) => {
              const count = issues.filter((i) => i.category === c.name).length;
              return (
                <button
                  key={c.name}
                  onClick={() => setCategoryFilter(c.name)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-full transition-colors flex items-center gap-1.5",
                    categoryFilter === c.name
                      ? "bg-zinc-900 text-white font-bold"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                  )}
                >
                  <CategoryIcon category={c.name} className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{c.name}</span>
                  <span className="text-[11px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1.5 rounded-full border border-zinc-200 pointer-events-auto shadow-sm">
            {onPick && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-700 px-2.5 py-0.5 bg-zinc-100 rounded-full mr-1">
                <Crosshair className="h-3.5 w-3.5 text-zinc-900" /> Click map to select location
              </span>
            )}
            <button
              onClick={() => setZoom((z) => Math.min(1.6, z + 0.2))}
              aria-label="Zoom In"
              className="p-1 rounded-full hover:bg-zinc-100 text-zinc-700"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
              aria-label="Zoom Out"
              className="p-1 rounded-full hover:bg-zinc-100 text-zinc-700"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={() => setZoom(1)}
              aria-label="Reset View"
              className="p-1 rounded-full hover:bg-zinc-100 text-zinc-700"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Schematic Vector Map Canvas */}
      <div
        className="h-full w-full transition-transform duration-300 origin-center flex items-center justify-center bg-zinc-50"
        style={{ transform: `scale(${zoom})` }}
      >
        <svg
          viewBox="0 0 160 100"
          preserveAspectRatio="xMidYMid meet"
          className={cn(
            "h-full w-full select-none",
            onPick ? "cursor-crosshair" : "cursor-default"
          )}
          onClick={handleCanvasClick}
        >
          <defs>
            <linearGradient id="bgLightGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fafafa" />
              <stop offset="100%" stopColor="#f4f4f5" />
            </linearGradient>
          </defs>

          {/* Map Base Surface */}
          <rect width="160" height="100" fill="url(#bgLightGrad)" />

          {/* Abacan River Channel */}
          <path
            d="M 0 92 Q 40 84 80 88 T 160 82"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="4"
          />
          <text x="120" y="87" fill="#0284c7" fontSize="2.2" fontWeight="600" opacity="0.8">
            Abacan River
          </text>

          {/* Clark Freeport Boundary */}
          <line
            x1="0"
            y1="6"
            x2="100"
            y2="0"
            stroke="#a1a1aa"
            strokeWidth="0.6"
            strokeDasharray="2 2"
          />
          <text x="15" y="4.5" fill="#71717a" fontSize="2" fontWeight="600">
            CLARK FREEPORT BOUNDARY
          </text>

          {/* Minimal Schematic Land Zones */}
          {[
            { x: 8, y: 10, w: 42, h: 18, name: "Mt. View Subd." },
            { x: 56, y: 8, w: 48, h: 18, name: "Bayanihan Astro Park" },
            { x: 110, y: 10, w: 42, h: 22, name: "Sta. Maria Village" },
            { x: 8, y: 34, w: 34, h: 22, name: "Fields Ave District" },
            { x: 48, y: 30, w: 38, h: 22, name: "Barangay Hall Complex" },
            { x: 92, y: 38, w: 26, h: 18, name: "Manuela Compound" },
            { x: 8, y: 62, w: 38, h: 22, name: "Don Pepe Subd." },
            { x: 52, y: 64, w: 38, h: 20, name: "Commercial Corridor" },
            { x: 104, y: 66, w: 46, h: 20, name: "Diamond Subd." },
          ].map((zone, i) => {
            const isZoneHovered = hoveredZone === zone.name;
            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredZone(zone.name)}
                onMouseLeave={() => setHoveredZone(null)}
                className="cursor-pointer transition-all duration-200"
              >
                <rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.w}
                  height={zone.h}
                  rx="3"
                  fill={
                    isZoneHovered
                      ? "#f4f4f5"
                      : zone.name.includes("Astro Park")
                      ? "#ecfdf5"
                      : "#ffffff"
                  }
                  stroke={isZoneHovered ? "#18181b" : "#e4e4e7"}
                  strokeWidth={isZoneHovered ? "0.8" : "0.5"}
                />
                {!compact && (
                  <text
                    x={zone.x + zone.w / 2}
                    y={zone.y + zone.h / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={cn(
                      "text-[2.5px] font-sans tracking-wide uppercase pointer-events-none transition-all duration-200",
                      isZoneHovered
                        ? "fill-zinc-900 font-bold"
                        : "fill-zinc-400 font-semibold"
                    )}
                  >
                    {zone.name}
                  </text>
                )}
              </g>
            );
          })}

          {/* Main Road Network */}
          <g opacity="0.9">
            {/* MacArthur Highway */}
            <line x1="52" y1="0" x2="52" y2="100" stroke="#18181b" strokeWidth="2" />
            <line
              x1="52"
              y1="0"
              x2="52"
              y2="100"
              stroke="#ffffff"
              strokeWidth="0.4"
              strokeDasharray="2 2"
            />
            <text x="54" y="52" fill="#18181b" fontSize="2.2" fontWeight="700">
              MacArthur Hwy
            </text>

            {/* Fields Avenue */}
            <line x1="0" y1="28" x2="160" y2="28" stroke="#d4d4d8" strokeWidth="1.6" />
            <text x="12" y="26.5" fill="#52525b" fontSize="2" fontWeight="600">
              Fields Ave
            </text>

            {/* Don Juico Avenue */}
            <line x1="0" y1="58" x2="160" y2="58" stroke="#d4d4d8" strokeWidth="1.6" />
            <text x="12" y="56.5" fill="#52525b" fontSize="2" fontWeight="600">
              Don Juico Ave
            </text>
          </g>

          {/* Landmarks */}
          <g transform="translate(80, 10)">
            <rect
              x="-13"
              y="-3.5"
              width="26"
              height="7"
              rx="2"
              fill="#ffffff"
              stroke="#f59e0b"
              strokeWidth="0.5"
            />
            <text x="0" y="0.5" textAnchor="middle" fill="#d97706" fontSize="2.1" fontWeight="700">
              📍 Salakot Landmark
            </text>
          </g>

          <g transform="translate(67, 41)">
            <rect
              x="-13"
              y="-3.5"
              width="26"
              height="7"
              rx="2"
              fill="#ffffff"
              stroke="#18181b"
              strokeWidth="0.5"
            />
            <text x="0" y="0.5" textAnchor="middle" fill="#18181b" fontSize="2.1" fontWeight="700">
              🏢 Barangay Hall
            </text>
          </g>

          {/* Interactive Pin Markers */}
          {filteredIssues.map((it) => {
            const isSelected = activeSelectedId === it.id;
            const isHovered = hoveredPin === it.id;
            const active = isSelected || isHovered;

            return (
              <g
                key={it.id}
                transform={`translate(${(it.x / 100) * 160}, ${it.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePinClick(it.id);
                }}
                onMouseEnter={() => setHoveredPin(it.id)}
                onMouseLeave={() => setHoveredPin(null)}
                className="cursor-pointer transition-transform duration-200"
              >
                <circle
                  r={active ? 3.5 : 2.5}
                  fill={categoryColor(it.category)}
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  className={cn(
                    "shadow-sm transition-all",
                    active ? "stroke-zinc-900 stroke-[1.2]" : ""
                  )}
                />
                {active && (
                  <text
                    y="-4.5"
                    textAnchor="middle"
                    fill="#18181b"
                    fontSize="2.4"
                    fontWeight="800"
                    className="font-mono"
                  >
                    {it.code}
                  </text>
                )}
              </g>
            );
          })}

          {/* Picked Coordinates Pin */}
          {pickedCoords && (
            <g transform="translate(80, 50)">
              <circle r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
              <text y="-5" textAnchor="middle" fill="#10b981" fontSize="2.4" fontWeight="800">
                Selected Point
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Selected Issue Drawer */}
      {selectedIssue && !compact && (
        <div className="absolute bottom-3 left-3 right-3 z-30 rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-md backdrop-blur-md text-zinc-900">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-zinc-900">{selectedIssue.code}</span>
                <StatusPill status={selectedIssue.status} />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 mt-1">{selectedIssue.title}</h3>
              <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5 font-mono">
                <MapPin className="h-3.5 w-3.5 text-zinc-900" /> {selectedIssue.purok} · {selectedIssue.street}
              </p>
            </div>
            <button
              onClick={() => setInternalSelectedId(null)}
              className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-zinc-600 mt-2.5 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200 leading-relaxed">
            {selectedIssue.summary}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-zinc-500 font-mono text-[11px]">
              Impact: <strong className="text-zinc-900">{selectedIssue.impact}/100</strong> · {selectedIssue.confirmations} confirmations
            </span>

            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1.5 font-semibold rounded-full border-zinc-300"
              onClick={() => confirmIssue(selectedIssue.id)}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Confirm Affected Resident ({selectedIssue.confirmations})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
