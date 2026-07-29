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
  Siren,
  ShieldCheck,
  PhoneCall,
  UploadCloud,
  X,
  CheckCircle2,
  Building2,
  FileCheck2,
  MapPin,
  Globe,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report an Issue — BayanLink Balibago" },
      {
        name: "description",
        content:
          "Report a community issue in Barangay Balibago, Angeles City. Pin-point location on OpenStreetMap, upload photo proof, and track resolution.",
      },
      { property: "og:title", content: "Report an Issue — BayanLink Balibago" },
      {
        property: "og:description",
        content:
          "Civic reporting for Barangay Balibago with automated category detection, map pin-pointing, and resident verification.",
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
  const [isDragging, setIsDragging] = useState(false);
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
  const streetAddress = watch("street");
  const anon = watch("anonymous");

  const urgent = /wire|sunog|fire|kuryente|baha|flood|aksidente|accident|kriminal|sakuna/i.test(
    text,
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
    const formatted = `GPS: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E near ${selectedPurok}`;
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
    <div className="min-h-screen bg-background text-foreground bg-mesh-light selection:bg-brand selection:text-white">
      {/* Top Banner */}
      <div className="border-b border-border bg-slate-900 px-4 py-2 text-xs font-medium text-slate-200">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-2">
          <span>
            Official Public Report Console for <strong className="text-white">{BARANGAY_INFO.name}</strong>,{" "}
            {BARANGAY_INFO.city}, {BARANGAY_INFO.province}
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            {BARANGAY_INFO.lastAuditDate}
          </span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6 lg:px-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-sky-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Balibago Operations Home
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl tracking-tight text-foreground flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-sky-500" /> {t.reportTitle}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{t.reportSubtitle}</p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMapPicker(!showMapPicker)}
            className="rounded-xl gap-2 font-semibold border-sky-500/30 text-sky-600 hover:bg-sky-500/10"
          >
            <Globe className="h-4 w-4 text-sky-500" />
            {showMapPicker ? "Hide Map Picker" : "📍 Interactive Map Location Picker"}
          </Button>
        </div>

        {/* Interactive Location Picker Map Collapsible */}
        {showMapPicker && (
          <div className="mt-6 surface-card p-4 border border-sky-500/30 bg-card rounded-2xl shadow-xl animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sky-500" />
                <span className="font-mono text-xs font-bold uppercase tracking-wide text-foreground">
                  OpenStreetMap Pin-point Location Picker
                </span>
              </div>
              <span className="text-xs text-emerald-600 font-semibold font-mono">
                {pickedCoords ? `Selected: ${pickedCoords.lat.toFixed(4)}°, ${pickedCoords.lng.toFixed(4)}°` : "Click anywhere on map to drop pin"}
              </span>
            </div>
            <BarangayMap
              issues={issues}
              onPick={handlePickLocation}
              pickedCoords={pickedCoords}
              className="h-[320px] rounded-xl"
            />
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="surface-card p-5 sm:p-7 space-y-5 border border-border bg-card rounded-3xl shadow-xl"
          >
            <div>
              <label
                htmlFor="zone-select"
                className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5"
              >
                {t.zoneLabel}
              </label>
              <select
                id="zone-select"
                {...register("purok")}
                className="w-full rounded-xl border border-border bg-surface-2 p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-ring text-foreground transition-all"
              >
                {PUROKS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.purok && <p className="mt-1 text-xs text-danger">{errors.purok.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="street-input"
                  className="block text-xs font-bold text-muted-foreground uppercase tracking-wider"
                >
                  Street Address / GPS Landmark
                </label>
                <button
                  type="button"
                  onClick={() => setShowMapPicker(true)}
                  className="text-[11px] font-bold text-sky-600 hover:underline flex items-center gap-1"
                >
                  <MapPin className="h-3 w-3" /> Select on Map
                </button>
              </div>
              <input
                id="street-input"
                type="text"
                placeholder="e.g. Near Astro Park / Fields Ave cor. MacArthur"
                {...register("street")}
                className="w-full rounded-xl border border-border bg-surface-2 p-3 text-sm outline-none focus:ring-2 focus:ring-ring text-foreground transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="issue-textarea"
                className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5"
              >
                {t.describeIssueLabel}
              </label>
              <textarea
                id="issue-textarea"
                {...register("summary")}
                rows={5}
                maxLength={1000}
                placeholder={t.describePlaceholder}
                className="w-full resize-none rounded-xl border border-border bg-surface-2 p-3.5 text-sm outline-none focus:ring-2 focus:ring-ring text-foreground transition-all leading-relaxed"
              />
              {errors.summary && (
                <p className="mt-1 text-xs text-danger">{errors.summary.message}</p>
              )}
            </div>

            {/* Drag & Drop Photo Upload */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
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
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileDrop(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-sky-500 bg-sky-500/10"
                      : "border-border hover:bg-surface-2"
                  }`}
                >
                  <UploadCloud className="h-7 w-7 text-sky-500 mb-1.5" />
                  <p className="text-xs font-bold text-foreground">Click or drag & drop photo evidence</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Faces & license plates automatically protected
                  </p>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-border max-w-[220px] shadow-md">
                  <img
                    src={photoPreview}
                    alt="Evidence Preview"
                    className="h-36 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="absolute top-2 right-2 rounded-full bg-slate-900/80 p-1.5 text-white hover:bg-slate-950 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <label className="flex items-center justify-between gap-3 rounded-2xl border border-border p-3.5 bg-surface-2/40">
              <span className="min-w-0 text-sm">
                <span className="block font-bold">{t.reportAnonymous}</span>
                <span className="block text-xs text-muted-foreground mt-0.5">
                  You will receive an official tracking code to follow resolution progress.
                </span>
              </span>
              <Switch checked={anon} onCheckedChange={(val) => setValue("anonymous", val)} />
            </label>

            <Button
              type="submit"
              size="lg"
              className="w-full font-bold rounded-xl bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-600/25"
              disabled={isSubmitting || text.trim().length < 10}
            >
              {t.submitReport}
            </Button>

            {submittedCode && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm text-emerald-950 dark:text-emerald-100 space-y-3 animate-in fade-in duration-300">
                <p className="font-bold flex items-center gap-2 text-base text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Ticket Logged & Dispatched
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  Official Ticket Code: <strong className="text-foreground text-sm">{submittedCode}</strong>
                </p>
                <div className="flex gap-2.5 pt-1">
                  <Button
                    size="sm"
                    className="font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl"
                    onClick={() => navigate({ to: "/dashboard/issues" })}
                  >
                    Track Ticket Queue
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setSubmittedCode(null)}>
                    File Another Report
                  </Button>
                </div>
              </div>
            )}
          </form>

          <div className="space-y-5">
            {urgent && (
              <section className="rounded-3xl border border-rose-500/40 bg-rose-500/10 p-5 shadow-lg">
                <p className="flex items-center gap-2 text-sm font-extrabold text-rose-600">
                  <Siren className="h-5 w-5 animate-bounce" /> Emergency Warning Detected
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  For active fire, flood, or safety emergencies, call dispatch immediately:
                </p>
                <ul className="mt-3 space-y-2 text-xs font-mono">
                  <li className="flex items-center gap-2 font-bold text-foreground">
                    <PhoneCall className="h-4 w-4 text-rose-600 shrink-0" />
                    ACDRRMO Hotline: 0917-851-9581 / 0998-842-7746
                  </li>
                  <li className="flex items-center gap-2 font-bold text-foreground">
                    <PhoneCall className="h-4 w-4 text-rose-600 shrink-0" />
                    Police Station 4 Balibago: (045) 893-0931
                  </li>
                  <li className="flex items-center gap-2 font-bold text-foreground">
                    <PhoneCall className="h-4 w-4 text-rose-600 shrink-0" />
                    BFP Fire Substation: (045) 322-0671
                  </li>
                </ul>
              </section>
            )}

            <section className="surface-card p-5 border border-border bg-card rounded-3xl shadow-lg">
              <p className="flex items-center gap-2 text-sm font-bold text-sky-600">
                <FileCheck2 className="h-4.5 w-4.5" /> Automated Routing & Priority Matrix
              </p>
              <div className="mt-3.5 flex flex-wrap gap-2 text-[11px] font-mono">
                {[
                  ["Category", text ? detectedCat : "—"],
                  ["Severity", text ? (urgent ? "Critical" : "Moderate") : "—"],
                  ["Zone", selectedPurok],
                  ["Routing", "Barangay Inspector Dispatch"],
                ].map(([k, v]) => (
                  <span
                    key={k}
                    className="rounded-xl border border-border bg-surface-2 px-3 py-1 font-semibold"
                  >
                    <span className="text-muted-foreground">{k}: </span>
                    <strong className="font-bold text-foreground">{v}</strong>
                  </span>
                ))}
              </div>
            </section>

            <section className="surface-card p-5 border border-border bg-card rounded-3xl shadow-lg">
              <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Building2 className="h-4.5 w-4.5 text-sky-500" /> Active Reports in {selectedPurok}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Confirming an existing issue increases priority without creating duplicate tickets.
              </p>
              {near.length > 0 ? (
                <ul className="mt-3.5 space-y-2.5">
                  {near.map((i) => (
                    <li key={i.id} className="rounded-2xl border border-border p-3.5 bg-surface-2/40 space-y-2">
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-bold text-foreground">{i.title}</span>
                          <span className="block text-[11px] text-muted-foreground font-mono mt-0.5">
                            {i.purok} · {i.confirmations} confirmations
                          </span>
                        </span>
                        <StatusPill status={i.status} />
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs font-semibold gap-1.5 border-border hover:bg-surface-2"
                        onClick={() => confirmIssue(i.id)}
                      >
                        <ShieldCheck className="h-4 w-4 text-emerald-500" /> Confirm Affected Resident (
                        {i.confirmations})
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No nearby active reports logged in this zone yet.
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
