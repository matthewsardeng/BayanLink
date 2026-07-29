import { createFileRoute } from "@tanstack/react-router";
import { BARANGAY_INFO, BADGES } from "@/data/barangay";
import { UserCheck, ShieldCheck, Award, Users } from "lucide-react";

export const Route = createFileRoute("/dashboard/residents")({
  head: () => ({
    meta: [{ title: "Residents Directory — BayanLink Balibago" }],
  }),
  component: ResidentsView,
});

function ResidentsView() {
  const verifiedResidents = [
    { name: "Maria Santos", purok: "Fields Avenue District", confirmations: 18, badge: "Community Inspector", status: "Verified Resident" },
    { name: "Juan Dela Cruz", purok: "Sta. Maria Village", confirmations: 24, badge: "Master Reporter", status: "Verified Resident" },
    { name: "Ana Reyes", purok: "Mt. View Subdivision", confirmations: 12, badge: "Resolution Watcher", status: "Verified Resident" },
    { name: "Roberto Lim", purok: "Diamond Subdivision", confirmations: 31, badge: "Master Reporter", status: "Verified Resident" },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl">
        <span className="text-xs font-mono text-zinc-500 font-semibold uppercase tracking-wider">
          Resident Verification & Badges
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
          Barangay Balibago Verified Residents
        </h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">
          Participating verified households, confirmation badges, and civic statistics for {BARANGAY_INFO.name}.
        </p>
      </div>

      <div className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl space-y-4">
        <h2 className="text-sm font-bold text-zinc-900">Active Resident Verification Leaders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-zinc-200 font-mono text-[11px] uppercase text-zinc-500">
                <th className="pb-2 font-bold">Resident Name</th>
                <th className="pb-2 font-bold">Purok / Zone</th>
                <th className="pb-2 font-bold">Confirmations Cast</th>
                <th className="pb-2 font-bold">Civic Badge</th>
                <th className="pb-2 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {verifiedResidents.map((r) => (
                <tr key={r.name} className="hover:bg-zinc-50">
                  <td className="py-3 font-bold text-zinc-900">{r.name}</td>
                  <td className="py-3 font-mono text-zinc-600">{r.purok}</td>
                  <td className="py-3 font-mono text-zinc-900 font-bold">{r.confirmations} votes</td>
                  <td className="py-3 font-mono text-emerald-700 font-bold">{r.badge}</td>
                  <td className="py-3">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
