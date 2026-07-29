import { useState, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BARANGAY_INFO, PUROKS, PUROK_COORDINATES, findClosestPurok, CATEGORIES, type IssueCategory } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-store";
import { TRANSLATIONS } from "@/lib/i18n";
import { BarangayMap, CategoryIcon } from "@/components/barangay-map";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { StatusPill } from "@/components/status";
import {
  ArrowLeft,
  ShieldCheck,
  UploadCloud,
  X,
  CheckCircle2,
  Building2,
  MapPin,
  Search,
  ArrowRight,
  Sparkles,
  SearchCheck,
} from "lucide-react";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report an Issue — BayanLink Balibago" },
      {
        name: "description",
        content:
          "Report a community issue in Barangay Balibago, Angeles City. Pinpoint location on map, upload photo proof, and track resolution.",
      },
      { property: "og:title", content: "Report an Issue — BayanLink Balibago" },
      {
        property: "og:description",
        content:
          "Civic reporting for Barangay Balibago with automated category routing and resident verification.",
      },
    ],
  }),
  component: Report,
});

const reportSchema = z.object({
  purok: z.string().min(1, "Please select a zone or purok"),
  street: z.string().optional(),
  summary: z.string().min(10, "Please describe the issue in at least 10 characters"),
  anonymous: z.boolean(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

function detectCategory(text: string): IssueCategory {
  const lower = text.toLowerCase();
  if (/baha|flood|tubig|waterlog/i.test(lower)) return "Flooding";
  if (/kuryente|ilaw|lamp|light|poste|post/i.test(lower)) return "Streetlight";
  if (/kalsada|butas|pothole|road|asphalt|semento/i.test(lower)) return "Road Damage";
  if (/basura|garbage|trash|amoy|tapon/i.test(lower)) return "Garbage";
  if (/aso|pusa|dog|cat|stray|kalye/i.test(lower)) return "Stray Animals";
  if (/poso|gripo|water supply|wasa|tubig/i.test(lower)) return "Water Supply";
  return "Safety Hazard";
}

function Report() {
  const navigate = useNavigate();
  const { addIssue, confirmIssue, issues, language } = useBayanStore();
  const { user } = useAuth();
  const t = TRANSLATIONS[language];

  // Wizard Step State (1: Category -> 2: Location -> 3: Evidence -> 4: Receipt)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory>("Safety Hazard");
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pickedCoords, setPickedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ticket Lookup State
  const [lookupCode, setLookupCode] = useState("");
  const [foundTicket, setFoundTicket] = useState<(typeof issues)[0] | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      purok: user?.purok || PUROKS[0],
      street: "",
      summary: "",
      anonymous: true,
    },
  });

  const text = watch("summary") || "";
  const selectedPurok = watch("purok");
  const anon = watch("anonymous");

  const urgent = /wire|sunog|fire|kuryente|baha|flood|aksidente|accident|kriminal|sakuna/i.test(text);

  const handleFileDrop = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePickLocation = (lat: number, lng: number) => {
    setPickedCoords({ lat, lng });
    setMapCenter({ lat, lng });
    const autoPurok = findClosestPurok(lat, lng);
    setValue("purok", autoPurok);
    const formatted = `Point in ${autoPurok} (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`;
    setValue("street", formatted);
  };

  const onSubmit = async (data: ReportFormValues) => {
    const finalCat = selectedCategory || detectCategory(data.summary);
    const created = await addIssue({
      title: `${finalCat} report in ${data.purok}`,
      category: finalCat,
      purok: data.purok,
      street: data.street,
      summary: data.summary,
      anonymous: data.anonymous,
      imageUrl: photoPreview || undefined,
    });

    setSubmittedCode(created.code);
    setStep(4);
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const t = issues.find((i) => i.code.toLowerCase() === lookupCode.trim().toLowerCase());
    setFoundTicket(t || null);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans">
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <span className="text-xs font-mono text-zinc-500 font-bold">
            Step {step} of 4: {step === 1 ? "Category" : step === 2 ? "Location" : step === 3 ? "Details" : "Receipt"}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
              {t.reportTitle}
            </h1>
            <p className="mt-1 text-sm text-zinc-600">{t.reportSubtitle}</p>
          </div>

          {/* Quick Ticket Lookup Modal Bar */}
          <form onSubmit={handleLookup} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter Ticket Code (BAL-2026-01)..."
              value={lookupCode}
              onChange={(e) => setLookupCode(e.target.value)}
              className="rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-mono font-medium outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900"
            />
            <Button type="submit" size="sm" variant="outline" className="rounded-full text-xs font-semibold border-zinc-300">
              <SearchCheck className="h-3.5 w-3.5 mr-1" /> Lookup
            </Button>
          </form>
        </div>

        {/* Found Ticket Card */}
        {foundTicket && (
          <div className="mt-4 surface-card p-4 border border-zinc-200 bg-white rounded-2xl space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <span className="font-mono text-xs font-bold text-zinc-900">{foundTicket.code}</span>
              <StatusPill status={foundTicket.status} />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">{foundTicket.title}</h3>
            <p className="text-xs text-zinc-600 font-mono">{foundTicket.purok} · {foundTicket.summary}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => confirmIssue(foundTicket.id)}
              className="rounded-full text-xs font-semibold border-zinc-300"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 mr-1" /> Confirm Resident ({foundTicket.confirmations})
            </Button>
          </div>
        )}

        {/* Wizard Steps Layout */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="surface-card p-6 space-y-6 border border-zinc-200 bg-white rounded-3xl"
          >
            {/* Step 1: Category Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-zinc-900">Select Concern Category</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedCategory(c.name)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all text-xs font-semibold text-center ${
                        selectedCategory === c.name
                          ? "border-zinc-900 bg-zinc-900 text-white font-bold"
                          : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800"
                      }`}
                    >
                      <CategoryIcon category={c.name} className="h-5 w-5 mb-1.5" />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>

                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-white text-xs mt-4"
                >
                  Continue to Location <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}

            {/* Step 2: Location Selection */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-zinc-900">Select Barangay Balibago Zone & Location</h2>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                    {t.zoneLabel}
                  </label>
                  <select
                    {...register("purok")}
                    onChange={(e) => {
                      const val = e.target.value;
                      setValue("purok", val);
                      const coords = PUROK_COORDINATES[val];
                      if (coords) {
                        setMapCenter(coords);
                        setPickedCoords(coords);
                        setValue("street", `Center of ${val} (${coords.lat.toFixed(4)}°, ${coords.lng.toFixed(4)}°)`);
                      }
                    }}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm font-medium outline-none text-zinc-900"
                  >
                    {PUROKS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Street / Landmark Coordinates
                  </label>
                  <input
                    type="text"
                    placeholder="Click map below or type landmark..."
                    {...register("street")}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm outline-none text-zinc-900"
                  />
                </div>

                <div className="overflow-hidden rounded-2xl border border-zinc-200">
                  <BarangayMap
                    issues={issues}
                    onPick={handlePickLocation}
                    pickedCoords={pickedCoords}
                    mapCenter={mapCenter}
                    className="h-[260px]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="rounded-full text-xs font-semibold">
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-white text-xs"
                  >
                    Continue to Details <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Description & Evidence */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-zinc-900">Describe Issue & Attach Evidence</h2>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                    {t.describeIssueLabel}
                  </label>
                  <textarea
                    {...register("summary")}
                    rows={4}
                    maxLength={1000}
                    placeholder={t.describePlaceholder}
                    className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm outline-none text-zinc-900 leading-relaxed"
                  />
                  {errors.summary && <p className="mt-1 text-xs text-rose-600">{errors.summary.message}</p>}
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Photo Evidence (Optional)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileDrop(file);
                    }}
                  />

                  {!photoPreview ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-5 text-center cursor-pointer hover:bg-zinc-50 transition-colors"
                    >
                      <UploadCloud className="h-6 w-6 text-zinc-400 mb-1" />
                      <p className="text-xs font-semibold text-zinc-900">Click to upload photo evidence</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Faces & license plates automatically blurred</p>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-zinc-200 max-w-[200px]">
                      <img src={photoPreview} alt="Preview" className="h-32 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotoPreview(null)}
                        className="absolute top-1.5 right-1.5 rounded-full bg-zinc-900/80 p-1 text-white hover:bg-zinc-900"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <label className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 p-3.5 bg-zinc-50">
                  <span className="min-w-0 text-xs">
                    <span className="block font-bold text-zinc-900">{t.reportAnonymous}</span>
                    <span className="block text-zinc-500 mt-0.5">Receive a tracking code to check status</span>
                  </span>
                  <Switch checked={anon} onCheckedChange={(val) => setValue("anonymous", val)} />
                </label>

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="rounded-full text-xs font-semibold">
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || text.trim().length < 10}
                    className="flex-1 rounded-full font-semibold bg-zinc-900 hover:bg-zinc-800 text-white text-xs"
                  >
                    Submit Report & Generate Code
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation Receipt */}
            {step === 4 && submittedCode && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-xs text-emerald-900 space-y-4 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-600 text-white mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h2 className="text-base font-bold text-emerald-900">Report Successfully Registered</h2>
                <p className="font-mono text-zinc-800 text-sm">
                  Tracking Code: <strong>{submittedCode}</strong>
                </p>
                <p className="text-zinc-600 max-w-xs mx-auto leading-relaxed">
                  Your report has been logged and assigned to Barangay Public Works. Nearby residents can now confirm resolution.
                </p>
                <div className="flex gap-2 justify-center pt-2">
                  <Button
                    size="sm"
                    className="rounded-full text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white px-6"
                    onClick={() => navigate({ to: "/dashboard/issues" })}
                  >
                    View in Queue
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setStep(1);
                      setSubmittedCode(null);
                    }}
                  >
                    Report Another
                  </Button>
                </div>
              </div>
            )}
          </form>

          {/* Sidebar Guidelines */}
          <div className="space-y-4">
            {urgent && (
              <section className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs">
                <p className="font-bold text-rose-800 flex items-center gap-1.5">
                  Emergency Alert Triggered
                </p>
                <p className="text-rose-700 mt-1">
                  For immediate fire, crime, or medical emergencies, call direct hotlines:
                </p>
                <ul className="mt-2 space-y-1 font-mono text-[11px] text-rose-800">
                  <li>ACDRRMO: 0917-851-9581</li>
                  <li>Police Substation 4: (045) 893-0931</li>
                  <li>Fire Substation: (045) 322-0671</li>
                </ul>
              </section>
            )}

            <section className="surface-card p-4 border border-zinc-200 bg-white rounded-2xl">
              <p className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-zinc-900" /> Active Reports in {selectedPurok}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Confirming existing reports accelerates repair dispatch.
              </p>
              {issues.filter((i) => i.purok === selectedPurok).length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {issues
                    .filter((i) => i.purok === selectedPurok)
                    .slice(0, 2)
                    .map((i) => (
                      <li key={i.id} className="rounded-xl border border-zinc-200 p-3 bg-zinc-50/50 space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-zinc-900">{i.title}</span>
                          <StatusPill status={i.status} />
                        </div>
                        <p className="text-[11px] text-zinc-500 font-mono">
                          {i.confirmations} resident confirmations
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs font-semibold rounded-full border-zinc-300"
                          onClick={() => confirmIssue(i.id)}
                        >
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 mr-1" /> Confirm Issue ({i.confirmations})
                        </Button>
                      </li>
                    ))}
                </ul>
              ) : (
                <div className="py-4 text-center text-xs text-zinc-500 font-mono">
                  No active reports in this zone.
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
