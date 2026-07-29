import { createFileRoute } from "@tanstack/react-router";
import { BARANGAY_INFO } from "@/data/barangay";
import { CalendarDays, Clock, Truck, Stethoscope, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/dashboard/schedules")({
  head: () => ({
    meta: [{ title: "Schedules & Operations — BayanLink Balibago" }],
  }),
  component: SchedulesView,
});

function SchedulesView() {
  const schedules = [
    { service: "Garbage & Solid Waste Collection", frequency: "Mon, Wed, Fri (6:00 AM - 10:00 AM)", location: "All 8 Balibago Puroks", icon: Truck },
    { service: "Barangay Health Center Consultation", frequency: "Monday - Friday (8:00 AM - 4:00 PM)", location: "Health Desk, Barangay Hall Complex", icon: Stethoscope },
    { service: "BPAT Peacekeeping Patrol Shifts", frequency: "Daily Nightly Shifts (10:00 PM - 5:00 AM)", location: "Fields Ave & Residential Corridors", icon: ShieldCheck },
    { service: "Lupong Tagapamayapa Mediation Hearings", frequency: "Tuesday & Thursday (1:00 PM - 4:00 PM)", location: "Lupon Office, Barangay Hall", icon: CalendarDays },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl">
        <span className="text-xs font-mono text-zinc-500 font-semibold uppercase tracking-wider">
          Operations Timetable
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
          Barangay Balibago Operational Schedules
        </h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">
          Public service hours, garbage collection routes, and patrol schedules for {BARANGAY_INFO.name}.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {schedules.map((s) => (
          <div key={s.service} className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl space-y-3 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-100 text-zinc-900">
                <s.icon className="h-5 w-5 text-zinc-900" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-zinc-900">{s.service}</h2>
                <p className="text-xs font-mono text-zinc-500">{s.location}</p>
              </div>
            </div>
            <p className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-2xl border border-emerald-200">
              {s.frequency}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
