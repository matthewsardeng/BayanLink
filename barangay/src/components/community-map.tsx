import { useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { barangay } from "@/lib/barangay";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TILE = 256;

function lngToWorldX(lng: number, z: number) {
  return ((lng + 180) / 360) * TILE * 2 ** z;
}
function latToWorldY(lat: number, z: number) {
  const s = Math.sin((lat * Math.PI) / 180);
  return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * TILE * 2 ** z;
}

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  status: string;
  active?: boolean;
};

/**
 * Lightweight slippy map built on OpenStreetMap raster tiles.
 * Marker coordinates are rounded by the reporting flow so exact private
 * addresses are never plotted.
 */
export function CommunityMap({
  markers,
  onSelect,
  onPick,
  height = 460,
  className,
}: {
  markers: MapMarker[];
  onSelect?: (id: string) => void;
  onPick?: (lat: number, lng: number) => void;
  height?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: height });
  const [zoom, setZoom] = useState(15);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: barangay.coordinates.lat,
    lng: barangay.coordinates.lng,
  });
  const drag = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const cx = lngToWorldX(center.lng, zoom);
  const cy = latToWorldY(center.lat, zoom);
  const left = cx - size.w / 2;
  const top = cy - size.h / 2;

  const max = 2 ** zoom;

  const move = (dx: number, dy: number) => {
    const nx = cx - dx;
    const ny = cy - dy;
    const worldSize = TILE * 2 ** zoom;
    const lng = (nx / worldSize) * 360 - 180;
    const n = Math.PI - (2 * Math.PI * ny) / worldSize;
    const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    setCenter({ lat, lng });
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-border bg-secondary select-none",
        className,
      )}
      style={{ height }}
      ref={ref}
      onPointerDown={(e) => {
        drag.current = { x: e.clientX, y: e.clientY };
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const dx = e.clientX - drag.current.x;
        const dy = e.clientY - drag.current.y;
        drag.current = { x: e.clientX, y: e.clientY };
        move(dx, dy);
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerLeave={() => (drag.current = null)}
      onClick={(e) => {
        if (!onPick) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const px = left + (e.clientX - rect.left);
        const py = top + (e.clientY - rect.top);
        const worldSize = TILE * 2 ** zoom;
        const lng = (px / worldSize) * 360 - 180;
        const n = Math.PI - (2 * Math.PI * py) / worldSize;
        const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
        onPick(lat, lng);
      }}
    >
      <div className={cn("absolute inset-0", onPick && "cursor-crosshair")}>

        {(() => {
          const x0 = Math.floor(left / TILE);
          const y0 = Math.floor(top / TILE);
          const cols = Math.ceil(size.w / TILE) + 1;
          const rows = Math.ceil(size.h / TILE) + 1;
          const out = [];
          for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
              const tx = x0 + i;
              const ty = y0 + j;
              if (ty < 0 || ty >= max) continue;
              const wx = ((tx % max) + max) % max;
              out.push(
                <img
                  key={`${tx}_${ty}`}
                  src={`https://tile.openstreetmap.org/${zoom}/${wx}/${ty}.png`}
                  alt=""
                  aria-hidden
                  draggable={false}
                  width={TILE}
                  height={TILE}
                  className="absolute opacity-95"
                  style={{ left: tx * TILE - left, top: ty * TILE - top }}
                />,
              );
            }
          }
          return out;
        })()}
      </div>

      {markers.map((m) => {
        const mx = lngToWorldX(m.lng, zoom) - left;
        const my = latToWorldY(m.lat, zoom) - top;
        if (mx < -40 || my < -40 || mx > size.w + 40 || my > size.h + 40) return null;
        return (
          <button
            key={m.id}
            onClick={() => onSelect?.(m.id)}
            style={{ left: mx, top: my }}
            className="absolute -translate-x-1/2 -translate-y-full"
            title={m.label}
          >
            <span
              className={cn(
                "block size-4 rounded-full border-2 border-background shadow-lift",
                m.status === "completed" ? "bg-primary" : "bg-accent",
                m.active && "ring-2 ring-foreground",
              )}
            />
          </button>
        );
      })}

      <div className="absolute top-3 right-3 flex flex-col gap-1">
        <Button
          size="icon"
          variant="secondary"
          onClick={() => setZoom((z) => Math.min(18, z + 1))}
          aria-label="Zoom in"
        >
          <Plus className="size-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={() => setZoom((z) => Math.max(12, z - 1))}
          aria-label="Zoom out"
        >
          <Minus className="size-4" />
        </Button>
      </div>

      <p className="absolute right-0 bottom-0 bg-background/80 px-2 py-0.5 text-[10px] text-muted-foreground">
        © OpenStreetMap contributors
      </p>
    </div>
  );
}
