import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BARANGAY_INFO, SERVICES, PUROKS, type ServiceItem } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Search, Building2, Clock, FileText, CheckCircle2, ArrowRight, X, FileCheck, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/dashboard/services")({
  head: () => ({
    meta: [
      { title: "Barangay Balibago Public Service Explorer — BayanLink" },
      {
        name: "description",
        content:
          "Browse official Barangay Balibago public services, clearances, certificates, fees, requirements, and submit online applications.",
      },
      { property: "og:title", content: "Barangay Balibago Public Service Explorer — BayanLink" },
      {
        property: "og:description",
        content: "Requirements, fees, processing times and online application for Barangay Balibago public services.",
      },
    ],
  }),
  component: Services,
});

const GROUPS: string[] = ["All", ...Array.from(new Set(SERVICES.map((s: ServiceItem) => s.group)))];

function Services() {
  const { serviceApplications, applyForService } = useBayanStore();
  const { user } = useAuth();
  const [group, setGroup] = useState<string>("All");
  const [q, setQ] = useState<string>("");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Application Modal State
  const [applicantName, setApplicantName] = useState(user?.name || "");
  const [purpose, setPurpose] = useState("Employment Requirement");
  const [selectedPurok, setSelectedPurok] = useState(user?.purok || PUROKS[0]);
  const [submittedAppCode, setSubmittedAppCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const list = SERVICES.filter(
    (s: ServiceItem) =>
      (group === "All" || s.group === group) &&
      (s.name + s.group + s.requirements.join(" ")).toLowerCase().includes(q.toLowerCase())
  );

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !applicantName) return;
    setIsSubmitting(true);

    const app = await applyForService({
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      applicantName,
      purpose,
      purok: selectedPurok,
    });

    setSubmittedAppCode(app.code);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Standardized Header */}
      <div className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-zinc-500 font-semibold uppercase tracking-wider">
              Municipal Services & Clearances
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
              Barangay Balibago Public Service Explorer
            </h1>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              Requirements, processing windows, fees, and window desk locations for {BARANGAY_INFO.name}, {BARANGAY_INFO.city}.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-zinc-600 bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-200">
            <ClipboardList className="h-4 w-4 text-zinc-900" />
            <span>Active Applications: <strong>{serviceApplications.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="surface-card flex flex-wrap items-center gap-3 p-4 border border-zinc-200 rounded-3xl bg-white shadow-sm">
        <span className="flex min-w-[240px] flex-1 items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-sm">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search e.g. clearance, indigency, cedula, blotter..."
            aria-label="Search services"
            className="min-w-0 flex-1 bg-transparent outline-none text-xs font-medium text-zinc-900"
          />
        </span>
        {GROUPS.map((g: string) => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all font-mono",
              group === g
                ? "border-transparent bg-zinc-900 text-white"
                : "border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600"
            )}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Grid: Service Catalog Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((s: ServiceItem) => (
          <article
            key={s.id}
            className="surface-card flex flex-col justify-between gap-4 p-5 border border-zinc-200 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold tracking-wide text-zinc-900 uppercase">
                  {s.group}
                </span>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-800">
                  OFFICIAL SERVICE
                </span>
              </div>
              <h2 className="text-base font-bold text-zinc-900 leading-snug">{s.name}</h2>
              <p className="text-xs font-mono font-semibold text-zinc-600 flex items-center gap-1.5 bg-zinc-50 p-2 rounded-xl border border-zinc-200">
                <Clock className="h-3.5 w-3.5 text-zinc-900" /> {s.time} ·{" "}
                <span className="text-zinc-900 font-bold">{s.fee}</span>
              </p>
              <div className="pt-1">
                <p className="text-[11px] font-bold text-zinc-500 uppercase font-mono tracking-wider">
                  Requirements Checklist:
                </p>
                <ul className="mt-2 space-y-1.5 text-xs">
                  {s.requirements.map((r: string) => (
                    <li key={r} className="flex items-center gap-2 text-zinc-800 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-2 border-t border-zinc-100 pt-3">
              <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-zinc-900 shrink-0" /> {s.location}
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedService(s);
                  setSubmittedAppCode(null);
                }}
                className="w-full text-xs font-semibold rounded-full bg-zinc-900 hover:bg-zinc-800 text-white"
              >
                Apply Online <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </article>
        ))}
      </div>

      {/* Tracked Applications Table Section */}
      <div className="surface-card p-5 border border-zinc-200 rounded-3xl bg-white space-y-4">
        <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <FileCheck className="h-4 w-4 text-zinc-900" /> Submitted Service Applications ({serviceApplications.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-zinc-200 font-mono text-[11px] uppercase text-zinc-500">
                <th className="pb-2 font-bold">App Code</th>
                <th className="pb-2 font-bold">Service</th>
                <th className="pb-2 font-bold">Applicant</th>
                <th className="pb-2 font-bold">Purok</th>
                <th className="pb-2 font-bold">Status</th>
                <th className="pb-2 font-bold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {serviceApplications.map((app) => (
                <tr key={app.id} className="hover:bg-zinc-50/50">
                  <td className="py-2.5 font-mono font-bold text-zinc-900">{app.code}</td>
                  <td className="py-2.5 font-semibold text-zinc-900">{app.serviceName}</td>
                  <td className="py-2.5 text-zinc-700">{app.applicantName}</td>
                  <td className="py-2.5 text-zinc-600 font-mono">{app.purok}</td>
                  <td className="py-2.5">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase",
                        app.status === "Ready for Pickup"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      )}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-zinc-500 font-mono text-[11px]">{app.submittedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clearance Application Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="surface-card w-full max-w-md p-6 border border-zinc-200 bg-white rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">
                  {selectedService.group}
                </span>
                <h3 className="text-base font-bold text-zinc-900">{selectedService.name}</h3>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!submittedAppCode ? (
              <form onSubmit={handleApplySubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-zinc-500 uppercase tracking-wider text-[10px] mb-1">
                    Applicant Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Maria Santos"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 font-medium outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-500 uppercase tracking-wider text-[10px] mb-1">
                    Purpose of Application
                  </label>
                  <input
                    type="text"
                    required
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g. Employment Requirement, School Enrollment, Business Permit"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 font-medium outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-500 uppercase tracking-wider text-[10px] mb-1">
                    Resident Zone / Purok
                  </label>
                  <select
                    value={selectedPurok}
                    onChange={(e) => setSelectedPurok(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 font-medium outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900"
                  >
                    {PUROKS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-3 border border-zinc-200 space-y-1 font-mono text-[11px] text-zinc-600">
                  <p className="font-bold text-zinc-900">Processing Window: {selectedService.time}</p>
                  <p>Fee Schedule: {selectedService.fee}</p>
                  <p>Desk Location: {selectedService.location}</p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-white text-xs"
                >
                  Submit Service Application
                </Button>
              </form>
            ) : (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900 space-y-3">
                <p className="font-bold flex items-center gap-1.5 text-sm text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Application Submitted
                </p>
                <p className="font-mono text-zinc-700">
                  Tracking Application Code: <strong>{submittedAppCode}</strong>
                </p>
                <p className="text-zinc-600 leading-relaxed">
                  Your application has been logged at Window 1, Barangay Hall Complex. Please present this tracking code upon pickup.
                </p>
                <Button
                  size="sm"
                  className="w-full rounded-full font-semibold bg-emerald-800 text-white"
                  onClick={() => setSelectedService(null)}
                >
                  Close Receipt
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
