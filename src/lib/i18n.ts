import type { Language } from "./store";

export const TRANSLATIONS: Record<
  Language,
  {
    appName: string;
    subTitle: string;
    operations: string;
    overview: string;
    issueMap: string;
    issueQueue: string;
    analytics: string;
    communityHub: string;
    communityFeed: string;
    publicServices: string;
    reportAnIssue: string;
    languageName: string;
    reportTitle: string;
    reportSubtitle: string;
    zoneLabel: string;
    describeIssueLabel: string;
    describePlaceholder: string;
    attachPhoto: string;
    submitReport: string;
    reportAnonymous: string;
    emergencyWarning: string;
    confirmIssue: string;
    confirmedCount: string;
  }
> = {
  en: {
    appName: "BayanLink",
    subTitle: "Brgy. Balibago",
    operations: "Operations",
    overview: "Overview",
    issueMap: "Issue Map",
    issueQueue: "Issue Queue",
    analytics: "Analytics",
    communityHub: "Community Hub",
    communityFeed: "Community Feed",
    publicServices: "Public Services",
    reportAnIssue: "Report an Issue",
    languageName: "English",
    reportTitle: "Report a Concern in Barangay Balibago",
    reportSubtitle:
      "Describe the problem naturally (Kapampangan, Tagalog, or English). AI categorizes location and severity automatically.",
    zoneLabel: "Select Subdivision / Zone in Balibago",
    describeIssueLabel: "Describe the Issue",
    describePlaceholder:
      "e.g., Flooding along Fields Ave near Astro Park, difficult for jeepneys to pass...",
    attachPhoto: "Attach Photo",
    submitReport: "Submit Report to Barangay Balibago",
    reportAnonymous: "Report Anonymously",
    emergencyWarning: "Immediate Emergency Warning Detected",
    confirmIssue: "Confirm Same Issue",
    confirmedCount: "residents confirmed",
  },
  tl: {
    appName: "BayanLink",
    subTitle: "Brgy. Balibago",
    operations: "Mga Operasyon",
    overview: "Pangkalahatan",
    issueMap: "Mapa ng Isyu",
    issueQueue: "Talaan ng Isyu",
    analytics: "Analitika",
    communityHub: "Sentro ng Komunidad",
    communityFeed: "Balita ng Komunidad",
    publicServices: "Serbisyong Publiko",
    reportAnIssue: "Mag-ulat ng Isyu",
    languageName: "Tagalog",
    reportTitle: "Mag-ulat ng Alalahanin sa Barangay Balibago",
    reportSubtitle:
      "Ilarawan ang problema sa sariling wika (Kapampangan, Tagalog, o Ingles). Awtomatikong tinutukoy ng AI ang kategorya at antas.",
    zoneLabel: "Pumili ng Subdivision / Purok sa Balibago",
    describeIssueLabel: "Ilarawan ang Isyu",
    describePlaceholder:
      "Halimbawa: Baha sa Fields Ave malapit sa Astro Park, mahirap daanan ng jeepney...",
    attachPhoto: "Maglakip ng Larawan",
    submitReport: "Isumite ang Ulat sa Barangay Balibago",
    reportAnonymous: "I-ulat nang Anonimo (Lihim)",
    emergencyWarning: "Babala: Pang-emerhensyang Isyu ang Natukoy",
    confirmIssue: "Kumpirmahin ang Parehong Isyu",
    confirmedCount: "mga residenteng nagkumpirma",
  },
  pam: {
    appName: "BayanLink",
    subTitle: "Brgy. Balibago",
    operations: "Manga Operasyon",
    overview: "Pangkabilugan",
    issueMap: "Mapa ning Problema",
    issueQueue: "Talaan ning Problema",
    analytics: "Analitika",
    communityHub: "Sentru ning Komunidad",
    communityFeed: "Balita ning Komunidad",
    publicServices: "Serbisyung Publiku",
    reportAnIssue: "Mag-report ning Problema",
    languageName: "Kapampangan",
    reportTitle: "Mag-report ning Alalahanin king Barangay Balibago",
    reportSubtitle:
      "Sabyan ye ing problema king amanung Kapampangan, Tagalog, o English. Awtomatiku nang a-categorize ning AI.",
    zoneLabel: "Pumili kang Subdivision / Purok king Balibago",
    describeIssueLabel: "Sabyan ye ing Problema",
    describePlaceholder:
      "Alimbawa: Baha na naman king Fields Ave a-siping ning Astro Park, masakit dalanan...",
    attachPhoto: "Mag-lakip Larawan",
    submitReport: "I-submit ing Report king Barangay Balibago",
    reportAnonymous: "I-report nang Lihim / Anonymously",
    emergencyWarning: "Pang-emergency a Babala ing A-detect",
    confirmIssue: "Kumpirman ing Pareung Problema",
    confirmedCount: "residenteng nag-kumpirma",
  },
};
