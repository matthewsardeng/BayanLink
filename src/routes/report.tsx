import { useState, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BARANGAY_INFO, PUROKS, type IssueCategory } from "@/data/barangay";
import { useBayanStore } from "@/lib/store";
import { TRANSLATIONS } from "@/lib/i18n";
import { BarangayMap } from "@/components/barangay-map";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { StatusPill } from "@/components/status";
import {
  ArrowLeft,
  ShieldCheck,
  PhoneCall,
  UploadCloud,
  X,
  CheckCircle2,
  Building2,
  MapPin,
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
  const t = TRANSLATIONS[language];

  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [pickedCoords, setPickedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      purok: PUROKS[0],
      street: "",
      summary: "",
      anonymous: true,
    },
  });

  const text = watch("summary") || "";
  const selectedPurok = watch("purok");
  const anon = watch("anonymous");

  const urgent = /wire|sunog|fire|kuryente|baha|flood|aksidente|accident|kriminal|sakuna/i.test(
    text
  );
  const detectedCat = text.trim().length > 3 ? detectCategory(text) : "Safety Hazard";
  const near = issues.slice(0, 2);

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
    const formatted = `Point near ${selectedPurok} (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`;
    setValue("street", formatted);
  };

  const onSubmit = async (data: ReportFormValues) => {
    const created = await addIssue({
      title: `${detectedCat} report in ${data.purok}`,
      category: detectedCat,
      purok: data.purok,
      street: data.street,
      summary: data.summary,
      anonymous: data.anonymous,
      imageUrl: photoPreview || undefined,
    });

    setSubmittedCode(created.code);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans">
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
              {t.reportTitle}
            </h1>
            <p className="mt-1 text-sm text-zinc-600">{t.reportSubtitle}</p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMapPicker(!showMapPicker)}
            className="rounded-full text-xs font-semibold border-zinc-300"
          >
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {showMapPicker ? "Hide Map Picker" : "Select Location on Map"}
          </Button>
        </div>

        {/* Location Picker Map */}
        {showMapPicker && (
          <div className="mt-6 surface-card p-4 border border-zinc-200 bg-white rounded-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 mb-3">
              <span className="font-mono text-xs font-bold text-zinc-900">
                Click map to select location point
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                {pickedCoords ? `${pickedCoords.lat.toFixed(4)}°, ${pickedCoords.lng.toFixed(4)}°` : "No point selected"}
              </span>
            </div>
            <BarangayMap
              issues={issues}
              onPick={handlePickLocation}
              pickedCoords={pickedCoords}
              className="h-[300px]"
            />
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="surface-card p-6 space-y-5 border border-zinc-200 bg-white rounded-3xl"
          >
            <div>
              <label
                htmlFor="zone-select"
                className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5"
              >
                {t.zoneLabel}
              </label>
              <select
                id="zone-select"
                {...register("purok")}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900"
              >
                {PUROKS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.purok && <p className="mt-1 text-xs text-rose-600">{errors.purok.message}</p>}
            </div>

            <div>
              <label
                htmlFor="street-input"
                className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5"
              >
                Street Address / Landmark (Optional)
              </label>
              <input
                id="street-input"
                type="text"
                placeholder="e.g. Near Astro Park / Fields Ave cor. MacArthur"
                {...register("street")}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900"
              />
            </div>

            <div>
              <label
                htmlFor="issue-textarea"
                className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5"
              >
                {t.describeIssueLabel}
              </label>
              <textarea
                id="issue-textarea"
                {...register("summary")}
                rows={4}
                maxLength={1000}
                placeholder={t.describePlaceholder}
                className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900 text-zinc-900 leading-relaxed"
              />
              {errors.summary && (
                <p className="mt-1 text-xs text-rose-600">{errors.summary.message}</p>
              )}
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
                  <p className="text-[11px] text-zinc-500 mt-0.5">Faces and license plates automatically blurred</p>
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

            <Button
              type="submit"
              size="lg"
              className="w-full font-semibold rounded-full bg-zinc-900 hover:bg-zinc-800 text-white"
              disabled={isSubmitting || text.trim().length < 10}
            >
              {t.submitReport}
            </Button>

            {submittedCode && (
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-900 space-y-2">
                <p className="font-bold flex items-center gap-1.5 text-sm text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Report Registered
                </p>
                <p className="font-mono text-zinc-700">
                  Tracking Code: <strong>{submittedCode}</strong>
                </p>
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    className="rounded-full text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white"
                    onClick={() => navigate({ to: "/dashboard/issues" })}
                  >
                    View in Queue
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setSubmittedCode(null)}>
                    Report Another
                  </Button>
                </div>
              </div>
            )}
          </form>

          <div className="space-y-4">
            {urgent && (
              <section className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs">
                <p className="font-bold text-rose-800 flex items-center gap-1.5">
                  Emergency Notice Detected
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
              {near.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {near.map((i) => (
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
                <div className="py-4 text-center text-xs text-zinc-500">
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
