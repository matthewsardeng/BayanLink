import { useEffect, useRef, useState } from "react";
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
  Plus,
  Minus,
  Crosshair,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const TILE_SIZE = 256;

// Mercator Projection Math
function lngToWorldX(lng: number, z: number) {
  return ((lng + 180) / 360) * TILE_SIZE * Math.pow(2, z);
}

function latToWorldY(lat: number, z: number) {
  const s = Math.sin((lat * Math.PI) / 180);
  return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * TILE_SIZE * Math.pow(2, z);
}

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

type Props = {
  issues: Issue[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onPick?: (lat: number, lng: number) => void;
  className?: string;
  compact?: boolean;
  pickedCoords?: { lat: number; lng: number } | null;
};

/**
 * Clean, lightweight, intuitive interactive map for Barangay Balibago.
 * Powered by OpenStreetMap raster tiles with drag panning, zoom controls,
 * category filtering, pin selection, and location picking.
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

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 500 });
  const [zoom, setZoom] = useState(15);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: BARANGAY_INFO.coordinates.lat,
    lng: BARANGAY_INFO.coordinates.lng,
  });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeSelectedId = externalSelectedId ?? internalSelectedId;

  const filteredIssues = issues.filter(
    (i) => categoryFilter === "All" || i.category === categoryFilter
  );

  const selectedIssue = issues.find((i) => i.id === activeSelectedId);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth && el.clientHeight) {
        setSize({ w: el.clientWidth, h: el.clientHeight });
      }
    });
    ro.observe(el);
    setSize({ w: el.clientWidth || 800, h: el.clientHeight || 500 });
    return () => ro.disconnect();
  }, []);

  const moveCenter = (dx: number, dy: number) => {
    const cx = lngToWorldX(center.lng, zoom);
    const cy = latToWorldY(center.lat, zoom);
    const nx = cx - dx;
    const ny = cy - dy;
    const worldSize = TILE_SIZE * Math.pow(2, zoom);
    const lng = (nx / worldSize) * 360 - 180;
    const n = Math.PI - (2 * Math.PI * ny) / worldSize;
    const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    setCenter({ lat, lng });
  };

  const handlePinClick = (id: string) => {
    setInternalSelectedId(id);
    onSelect?.(id);
  };

  const worldCx = lngToWorldX(center.lng, zoom);
  const worldCy = latToWorldY(center.lat, zoom);
  const left = worldCx - size.w / 2;
  const top = worldCy - size.h / 2;
  const maxTiles = Math.pow(2, zoom);

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-slate-100 border border-slate-200 select-none font-sans rounded-xl text-slate-900 shadow-sm",
        className
      )}
      ref={containerRef}
    >
      {/* Category Filter Chips Bar */}
      {!compact && (
        <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="flex flex-wrap items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-lg border border-slate-200 pointer-events-auto shadow-sm text-xs">
            <button
              onClick={() => setCategoryFilter("All")}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-md transition-colors",
                categoryFilter === "All"
                  ? "bg-slate-900 text-white font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
                    "px-2 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5",
                    categoryFilter === c.name
                      ? "bg-slate-900 text-white font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  <CategoryIcon category={c.name} className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{c.name}</span>
                  <span className="text-[11px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Map Controls */}
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-lg border border-slate-200 pointer-events-auto shadow-sm">
            {onPick && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 px-2 py-1 bg-sky-50 rounded mr-1">
                <Crosshair className="h-3.5 w-3.5" /> Click map to pick point
              </span>
            )}
            <button
              onClick={() => setZoom((z) => Math.min(18, z + 1))}
              aria-label="Zoom In"
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(12, z - 1))}
              aria-label="Zoom Out"
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setZoom(15);
                setCenter({
                  lat: BARANGAY_INFO.coordinates.lat,
                  lng: BARANGAY_INFO.coordinates.lng,
                });
              }}
              aria-label="Recenter"
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700"
              title="Recenter map"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Slippy Map Canvas */}
      <div
        className={cn(
          "relative h-full w-full overflow-hidden",
          onPick ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"
        )}
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, y: e.clientY };
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const dx = e.clientX - drag.current.x;
          const dy = e.clientY - drag.current.y;
          drag.current = { x: e.clientX, y: e.clientY };
          moveCenter(dx, dy);
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => (drag.current = null)}
        onClick={(e) => {
          if (!onPick) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const px = left + (e.clientX - rect.left);
          const py = top + (e.clientY - rect.top);
          const worldSize = TILE_SIZE * Math.pow(2, zoom);
          const lng = (px / worldSize) * 360 - 180;
          const n = Math.PI - (2 * Math.PI * py) / worldSize;
          const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
          onPick(lat, lng);
        }}
      >
        {/* OpenStreetMap Raster Tile Grid */}
        <div className="absolute inset-0 pointer-events-none">
          {(() => {
            const startCol = Math.floor(left / TILE_SIZE);
            const startRow = Math.floor(top / TILE_SIZE);
            const cols = Math.ceil(size.w / TILE_SIZE) + 1;
            const rows = Math.ceil(size.h / TILE_SIZE) + 1;
            const tiles = [];

            for (let c = 0; c < cols; c++) {
              for (let r = 0; r < rows; r++) {
                const tileX = startCol + c;
                const tileY = startRow + r;
                if (tileY < 0 || tileY >= maxTiles) continue;
                const wrappedX = ((tileX % maxTiles) + maxTiles) % maxTiles;

                tiles.push(
                  <img
                    key={`${tileX}_${tileY}`}
                    src={`https://tile.openstreetmap.org/${zoom}/${wrappedX}/${tileY}.png`}
                    alt=""
                    aria-hidden
                    draggable={false}
                    width={TILE_SIZE}
                    height={TILE_SIZE}
                    className="absolute opacity-95"
                    style={{
                      left: tileX * TILE_SIZE - left,
                      top: tileY * TILE_SIZE - top,
                    }}
                  />
                );
              }
            }
            return tiles;
          })()}
        </div>

        {/* Issue Pins */}
        {filteredIssues.map((it) => {
          const mx = lngToWorldX(it.lng || BARANGAY_INFO.coordinates.lng, zoom) - left;
          const my = latToWorldY(it.lat || BARANGAY_INFO.coordinates.lat, zoom) - top;
          const isSelected = activeSelectedId === it.id;
          const isHovered = hoveredId === it.id;
          const active = isSelected || isHovered;

          if (mx < -40 || my < -40 || mx > size.w + 40 || my > size.h + 40) {
            return null;
          }

          return (
            <button
              key={it.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePinClick(it.id);
              }}
              onMouseEnter={() => setHoveredId(it.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ left: mx, top: my }}
              aria-label={`${it.category}: ${it.title}`}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-full focus:outline-none transition-transform duration-150 pointer-events-auto",
                active ? "z-30 scale-110" : "z-10 hover:scale-105"
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-full border-2 border-white text-slate-900 shadow-md font-semibold text-xs transition-all",
                  active ? "ring-2 ring-sky-600 shadow-lg" : ""
                )}
                style={{ background: categoryColor(it.category) }}
              >
                <CategoryIcon category={it.category} className="h-3.5 w-3.5 text-slate-950 stroke-[2.5]" />
                {!compact && <span className="text-[11px] font-mono">{it.code}</span>}
              </div>
            </button>
          );
        })}

        {/* Temporary Location Pick Marker */}
        {pickedCoords && (
          <div
            style={{
              left: lngToWorldX(pickedCoords.lng, zoom) - left,
              top: latToWorldY(pickedCoords.lat, zoom) - top,
            }}
            className="absolute -translate-x-1/2 -translate-y-full pointer-events-none z-40"
          >
            <div className="bg-sky-600 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> Selected Point
            </div>
          </div>
        )}

        <div className="absolute right-2 bottom-1 z-10 text-[10px] text-slate-500 bg-white/80 px-1.5 py-0.5 rounded border border-slate-200">
          © OpenStreetMap contributors
        </div>
      </div>

      {/* Selected Issue Drawer */}
      {selectedIssue && !compact && (
        <div className="absolute bottom-3 left-3 right-3 z-30 rounded-xl border border-slate-200 bg-white/95 p-3.5 shadow-lg backdrop-blur-md text-slate-900">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-sky-700">{selectedIssue.code}</span>
                <StatusPill status={selectedIssue.status} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-1">{selectedIssue.title}</h3>
              <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5 font-mono">
                <MapPin className="h-3.5 w-3.5 text-sky-600" /> {selectedIssue.purok} · {selectedIssue.street}
              </p>
            </div>
            <button
              onClick={() => setInternalSelectedId(null)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-slate-700 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-200 leading-relaxed">
            {selectedIssue.summary}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-600 font-mono text-[11px]">
              Impact: <strong>{selectedIssue.impact}/100</strong> · {selectedIssue.confirmations} resident confirmations
            </span>

            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1.5 font-semibold"
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
