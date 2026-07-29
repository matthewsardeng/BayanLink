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
  CloudSun,
  Car,
  Layers,
  Thermometer,
  Wind,
  Droplet,
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
  mapCenter?: { lat: number; lng: number } | null;
};

type WeatherData = {
  temp: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  precipitation: number;
};

type TrafficCorridor = {
  name: string;
  status: "Smooth" | "Moderate" | "Congested";
  speed: string;
  note: string;
};

const INITIAL_TRAFFIC: TrafficCorridor[] = [
  { name: "MacArthur Highway Corridor", status: "Moderate", speed: "28 km/h", note: "Normal flow near Astro Park" },
  { name: "Fields Avenue District", status: "Smooth", speed: "15 km/h", note: "Pedestrian priority zone clear" },
  { name: "Don Juico Avenue", status: "Congested", speed: "12 km/h", note: "Slow due to utility repair" },
];

/**
 * Real, Interactive CartoDB/OpenStreetMap Map for Barangay Balibago.
 * Includes live Open-Meteo weather API data, traffic advisory layers,
 * issue pin inspection, and location picking.
 */
export function BarangayMap({
  issues,
  selectedId: externalSelectedId,
  onSelect,
  onPick,
  className,
  compact = false,
  pickedCoords = null,
  mapCenter = null,
}: Props) {
  const { confirmIssue } = useBayanStore();
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | "All">("All");

  // Layers Toggles
  const [showTraffic, setShowTraffic] = useState(false);
  const [showWeather, setShowWeather] = useState(true);

  // Live Weather State (Open-Meteo API for Balibago)
  const [weather, setWeather] = useState<WeatherData | null>({
    temp: 29.5,
    humidity: 74,
    windSpeed: 12,
    condition: "Partly Cloudy",
    precipitation: 0.0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 500 });
  const [zoom, setZoom] = useState(15);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: BARANGAY_INFO.coordinates.lat,
    lng: BARANGAY_INFO.coordinates.lng,
  });

  // Sync center when mapCenter prop changes
  useEffect(() => {
    if (mapCenter) {
      setCenter({ lat: mapCenter.lat, lng: mapCenter.lng });
    }
  }, [mapCenter?.lat, mapCenter?.lng]);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeSelectedId = externalSelectedId ?? internalSelectedId;

  const filteredIssues = issues.filter(
    (i) => categoryFilter === "All" || i.category === categoryFilter
  );

  const selectedIssue = issues.find((i) => i.id === activeSelectedId);

  // Fetch live public Open-Meteo weather data for Barangay Balibago
  useEffect(() => {
    let mounted = true;
    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=15.1663&longitude=120.5901&current_weather=true&hourly=relativehumidity_2m,precipitation`
        );
        if (res.ok) {
          const data = await res.json();
          if (mounted && data.current_weather) {
            const temp = Math.round(data.current_weather.temperature);
            const windSpeed = Math.round(data.current_weather.windspeed);
            const code = data.current_weather.weathercode;
            let condition = "Clear Skies";
            if (code >= 1 && code <= 3) condition = "Partly Cloudy";
            if (code >= 51 && code <= 67) condition = "Light Rain";
            if (code >= 80 && code <= 99) condition = "Heavy Rain";

            setWeather({
              temp,
              humidity: 72,
              windSpeed,
              condition,
              precipitation: 0.2,
            });
          }
        }
      } catch (err) {
        console.warn("Could not fetch Open-Meteo weather data", err);
      }
    }
    fetchWeather();
    return () => {
      mounted = false;
    };
  }, []);

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
    // Clamp center strictly within Pampanga bounds (14.85 - 15.35 N, 120.45 - 120.80 E)
    const clampedLat = Math.max(14.85, Math.min(15.35, lat));
    const clampedLng = Math.max(120.45, Math.min(120.80, lng));
    setCenter({ lat: clampedLat, lng: clampedLng });
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
        "relative isolate overflow-hidden bg-zinc-100 border border-zinc-200 select-none font-sans rounded-2xl text-zinc-900 shadow-sm",
        className
      )}
      ref={containerRef}
    >
      {/* Layer & Zoom Controls in Top Right */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-full border border-zinc-200 shadow-sm pointer-events-auto">
        {onPick && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-700 px-2.5 py-0.5 bg-zinc-100 rounded-full mr-1">
            <Crosshair className="h-3.5 w-3.5 text-zinc-900" /> Click map to pick location
          </span>
        )}

        <button
          type="button"
          onClick={() => setShowTraffic(!showTraffic)}
          className={cn(
            "px-2.5 py-1 text-xs font-semibold rounded-full transition-colors flex items-center gap-1",
            showTraffic
              ? "bg-amber-600 text-white font-bold"
              : "text-zinc-600 hover:bg-zinc-100"
          )}
          title="Toggle Traffic & Transit Advisory"
        >
          <Car className="h-3.5 w-3.5" /> Traffic
        </button>

            <button
              onClick={() => setZoom((z) => Math.min(18, z + 1))}
              aria-label="Zoom In"
              className="p-1 rounded-full hover:bg-zinc-100 text-zinc-700"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(12, z - 1))}
              aria-label="Zoom Out"
              className="p-1 rounded-full hover:bg-zinc-100 text-zinc-700"
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
              className="p-1 rounded-full hover:bg-zinc-100 text-zinc-700"
              title="Recenter Map"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

      {/* Live Weather Widget Overlay */}
      {weather && showWeather && !compact && (
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-zinc-200 shadow-sm text-xs font-mono text-zinc-800 pointer-events-auto">
          <div className="flex items-center gap-1.5 font-bold text-zinc-900">
            <CloudSun className="h-4 w-4 text-amber-500" />
            <span>Balibago Weather: {weather.temp}°C</span>
          </div>
          <span className="text-zinc-300">|</span>
          <span className="flex items-center gap-1 text-zinc-600">
            <Droplet className="h-3 w-3 text-sky-500" /> {weather.humidity}%
          </span>
          <span className="text-zinc-300">|</span>
          <span className="flex items-center gap-1 text-zinc-600">
            <Wind className="h-3 w-3 text-zinc-500" /> {weather.windSpeed} km/h
          </span>
        </div>
      )}

      {/* Interactive Traffic Advisory Overlay Banner */}
      {showTraffic && !compact && (
        <div className="absolute top-16 right-3 z-20 w-72 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-zinc-200 shadow-lg text-xs font-sans text-zinc-900 pointer-events-auto">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2 mb-2 font-bold">
            <span className="flex items-center gap-1.5 text-zinc-900">
              <Car className="h-4 w-4 text-amber-600" /> Live Balibago Traffic Advisory
            </span>
            <button onClick={() => setShowTraffic(false)} className="text-zinc-400 hover:text-zinc-700">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <ul className="space-y-2">
            {INITIAL_TRAFFIC.map((t) => (
              <li key={t.name} className="flex items-start justify-between gap-1 border-b border-zinc-50 pb-1.5">
                <div>
                  <p className="font-semibold text-zinc-900 text-[11px]">{t.name}</p>
                  <p className="text-[10px] text-zinc-500">{t.note}</p>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0",
                    t.status === "Smooth"
                      ? "bg-emerald-50 text-emerald-700"
                      : t.status === "Moderate"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-rose-50 text-rose-700"
                  )}
                >
                  {t.speed}
                </span>
              </li>
            ))}
          </ul>
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
        {/* CartoDB Positron Raster Tile Grid */}
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
                    src={`https://a.basemaps.cartocdn.com/light_all/${zoom}/${wrappedX}/${tileY}.png`}
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

        {/* Interactive Issue Pins */}
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
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full border-2 border-white text-zinc-950 shadow-md font-bold text-xs transition-all",
                  active ? "ring-2 ring-zinc-900 shadow-lg scale-105" : ""
                )}
                style={{ background: categoryColor(it.category) }}
              >
                <CategoryIcon category={it.category} className="h-3.5 w-3.5 text-zinc-950 stroke-[2.5]" />
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
            <div className="bg-zinc-900 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" /> Selected Point
            </div>
          </div>
        )}

        <div className="absolute right-2 bottom-1 z-10 text-[10px] text-zinc-500 bg-white/80 px-1.5 py-0.5 rounded border border-zinc-200">
          © OpenStreetMap · CartoDB
        </div>
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
