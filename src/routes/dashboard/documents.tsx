import { createFileRoute } from "@tanstack/react-router";
import { BARANGAY_INFO, SERVICES } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { FileCheck, Download, Clock, Building2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/documents")({
  head: () => ({
    meta: [{ title: "Documents & Clearances — BayanLink Balibago" }],
  }),
  component: DocumentsView,
});

function DocumentsView() {
  const { serviceApplications } = useBayanStore();

  return (
    <div className="space-y-6 font-sans">
      <div className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl">
        <span className="text-xs font-mono text-zinc-500 font-semibold uppercase tracking-wider">
          Official Records & Forms
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
          Barangay Balibago Documents & Permits
        </h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">
          Download downloadable official clearance request forms and inspect active digital applications.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <div key={s.id} className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl space-y-3 shadow-sm">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">{s.group}</span>
            <h2 className="text-sm font-bold text-zinc-900">{s.name}</h2>
            <p className="text-xs font-mono text-zinc-600 bg-zinc-50 p-2 rounded-xl border border-zinc-200">
              Processing: <strong>{s.time}</strong> · Fee: <strong>{s.fee}</strong>
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-bold text-zinc-500 uppercase font-mono block mb-1">Requirements:</span>
              <ul className="text-xs space-y-1 text-zinc-700 font-medium">
                {s.requirements.map((r) => (
                  <li key={r}>• {r}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
