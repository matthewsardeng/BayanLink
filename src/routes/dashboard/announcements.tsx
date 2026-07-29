import { createFileRoute } from "@tanstack/react-router";
import { BARANGAY_INFO } from "@/data/barangay";
import { Megaphone, Bell, Calendar, Pin } from "lucide-react";

export const Route = createFileRoute("/dashboard/announcements")({
  head: () => ({
    meta: [{ title: "Announcements — BayanLink Balibago" }],
  }),
  component: AnnouncementsView,
});

function AnnouncementsView() {
  const announcements = [
    {
      id: "a1",
      title: "Scheduled Drainage Maintenance & Flushing along MacArthur Highway",
      date: "Jul 30, 2026",
      category: "Infrastructure Notice",
      body: "Barangay Balibago Public Works crew will conduct preventive desilting and drainage flushing along MacArthur Highway starting 8:00 AM.",
      pinned: true,
    },
    {
      id: "a2",
      title: "Free Anti-Rabies Vaccination Drive at Balibago Covered Court",
      date: "Aug 02, 2026",
      category: "Health & Sanitation",
      body: "In partnership with Angeles City Veterinary Office, free anti-rabies vaccination will be conducted for pets of resident households.",
      pinned: true,
    },
    {
      id: "a3",
      title: "Katarungang Pambarangay Mediation Clinic Hours Updated",
      date: "Jul 25, 2026",
      category: "Administrative Notice",
      body: "Lupong Tagapamayapa dispute hearing desk now operates Monday through Saturday, 8:00 AM to 5:00 PM at Window 3.",
      pinned: false,
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="surface-card p-6 border border-zinc-200 bg-white rounded-3xl">
        <span className="text-xs font-mono text-zinc-500 font-semibold uppercase tracking-wider">
          Public Bulletins & Notices
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
          Barangay Balibago Announcements
        </h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">
          Official civic advisories, community news, and public health notices for {BARANGAY_INFO.name}.
        </p>
      </div>

      <div className="space-y-4">
        {announcements.map((a) => (
          <article key={a.id} className="surface-card p-5 border border-zinc-200 bg-white rounded-3xl space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="bg-zinc-100 text-zinc-800 px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px]">
                {a.category}
              </span>
              <span className="text-zinc-500">{a.date}</span>
            </div>
            <h2 className="text-base font-bold text-zinc-900">{a.title}</h2>
            <p className="text-xs text-zinc-600 leading-relaxed">{a.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
