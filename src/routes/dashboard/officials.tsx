import { createFileRoute } from "@tanstack/react-router";
import { BARANGAY_INFO } from "@/data/barangay";
import { Users, Phone, Building2, Shield, Mail } from "lucide-react";

export const Route = createFileRoute("/dashboard/officials")({
  head: () => ({
    meta: [{ title: "Barangay Officials — BayanLink Balibago" }],
  }),
  component: OfficialsView,
});

function OfficialsView() {
  const officials = [
    { name: 'Hon. Joseph "PG" Ponce', title: "Punong Barangay", committee: "Executive & Administration", contact: BARANGAY_INFO.hotlineMobile },
    { name: "Hon. Kagawad Mark Reyes", title: "Barangay Kagawad", committee: "Public Works & Infrastructure", contact: "(045) 624-5801" },
    { name: "Hon. Kagawad Elena Santos", title: "Barangay Kagawad", committee: "Health & Sanitation", contact: "(045) 624-5802" },
    { name: "Hon. Kagawad Ramon Dizon", title: "Barangay Kagawad", committee: "Peace & Order / Public Safety", contact: "(045) 624-5803" },
    { name: "Hon. Kagawad Sofia Mendoza", title: "Barangay Kagawad", committee: "Finance & Budgeting", contact: "(045) 624-5804" },
    { name: "Hon. Kagawad Carlos Tan", title: "Barangay Kagawad", committee: "Environment & Drainage", contact: "(045) 624-5805" },
    { name: "Hon. SK Chairperson Gabriel Castro", title: "SK Chairperson", committee: "Youth & Sports Development", contact: "(045) 624-5806" },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl">
        <span className="text-xs font-mono text-zinc-500 font-semibold uppercase tracking-wider">
          Governance & Leadership
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
          Barangay Balibago Officials Directory
        </h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">
          Elected officials, committee assignments, and contact channels for {BARANGAY_INFO.name}.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {officials.map((o) => (
          <div key={o.name} className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl space-y-3 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-zinc-900 text-white font-bold text-xs">
                {o.name.charAt(5) || "O"}
              </span>
              <div>
                <h2 className="text-sm font-bold text-zinc-900">{o.name}</h2>
                <p className="text-xs font-mono text-zinc-500">{o.title}</p>
              </div>
            </div>
            <div className="text-xs font-mono text-zinc-600 space-y-1.5 pt-3 border-t border-zinc-100">
              <p>Committee: <strong className="text-zinc-900">{o.committee}</strong></p>
              <p className="flex items-center gap-1">
                <Phone className="h-3 w-3 text-zinc-900" /> {o.contact}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
