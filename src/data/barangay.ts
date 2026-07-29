export type IssueCategory =
  | "Flooding"
  | "Road Damage"
  | "Streetlight"
  | "Garbage"
  | "Stray Animals"
  | "Safety Hazard"
  | "Water Supply";

export type IssueStatus =
  | "Reported"
  | "Verified"
  | "Assigned"
  | "Scheduled"
  | "In Progress"
  | "Completed"
  | "Resident Verified";

export type Severity = "Low" | "Moderate" | "High" | "Critical";

export const LIFECYCLE: IssueStatus[] = [
  "Reported",
  "Verified",
  "Assigned",
  "Scheduled",
  "In Progress",
  "Completed",
  "Resident Verified",
];

export const CATEGORIES: { name: IssueCategory; color: string; iconName: string }[] = [
  { name: "Flooding", color: "oklch(0.58 0.16 230)", iconName: "Waves" },
  { name: "Road Damage", color: "oklch(0.62 0.16 45)", iconName: "Construction" },
  { name: "Streetlight", color: "oklch(0.78 0.16 85)", iconName: "Lightbulb" },
  { name: "Garbage", color: "oklch(0.6 0.14 155)", iconName: "Trash2" },
  { name: "Stray Animals", color: "oklch(0.65 0.12 310)", iconName: "PawPrint" },
  { name: "Safety Hazard", color: "oklch(0.58 0.2 25)", iconName: "AlertTriangle" },
  { name: "Water Supply", color: "oklch(0.64 0.14 200)", iconName: "Droplets" },
];

export const categoryColor = (c: IssueCategory) =>
  CATEGORIES.find((x) => x.name === c)?.color ?? "oklch(0.5 0.05 210)";

/** Verified official information for Barangay Balibago, Angeles City, Pampanga */
export const BARANGAY_INFO = {
  name: "Barangay Balibago",
  city: "Angeles City",
  province: "Pampanga",
  region: "Central Luzon (Region III)",
  zipCode: "2009",
  captain: 'Hon. Joseph "PG" Ponce',
  captainTitle: "Punong Barangay",
  address: "Barangay Hall, MacArthur Highway, Balibago, Angeles City, Pampanga",
  coordinates: { lat: 15.1663, lng: 120.5901 },
  hotlineLandline: "(045) 624-5800 / (045) 322-4038",
  hotlineMobile: "+63 916-741-4383",
  officialFacebook: "https://www.facebook.com/BALIBAGOHOTLINE",
  policeStation: "Police Station 4 (Balibago): (045) 893-0931 / (045) 322-2146",
  fireStation: "BFP Angeles City - Balibago Fire Station: (045) 322-0671 / 0995-822-3620",
  acdrmmo: "Angeles City DRRMO: 0917-851-9581 (Globe) / 0998-842-7746 (Smart)",
  lastAuditDate: "Jul 29, 2026, 06:00 PST",
  population: [
    { year: 2000, value: 27914 },
    { year: 2010, value: 32291 },
    { year: 2015, value: 40087 },
    { year: 2020, value: 42274 },
  ],
};

export const PUROKS = [
  "Fields Avenue District",
  "Bayanihan Astro Park Area",
  "Mt. View Subdivision",
  "Sta. Maria Village",
  "Don Pepe Subdivision",
  "Manuela Compound",
  "Diamond Subdivision",
  "MacArthur Highway Corridor",
];

export type TimelineEntry = {
  status: IssueStatus;
  at: string;
  by: string;
  note: string;
};

export type Issue = {
  id: string;
  code: string;
  title: string;
  category: IssueCategory;
  severity: Severity;
  status: IssueStatus;
  purok: string;
  street: string;
  reportedAt: string;
  confirmations: number;
  households: number;
  impact: number;
  lat: number;
  lng: number;
  x: number; // 0-100 map coords relative to Balibago SVG basemap
  y: number;
  summary: string;
  nextAction: string;
  eta: string;
  department: string;
  timeline: TimelineEntry[];
  proof?: { before: string; after?: string };
  recurring?: { count: number; sinceMonths: number };
  anonymous?: boolean;
};

export const ISSUES: Issue[] = [
  {
    id: "blb-101",
    code: "BAL-2026-01",
    title: "Fields Ave Drainage Blockage Near Corner Salakot Park",
    category: "Flooding",
    severity: "High",
    status: "In Progress",
    purok: "Fields Avenue District",
    street: "Fields Avenue cor. Astro Park Access",
    reportedAt: "2026-07-28",
    confirmations: 24,
    households: 35,
    impact: 82,
    lat: 15.1672,
    lng: 120.5912,
    x: 24,
    y: 36,
    summary: "Heavy rainfall causes knee-deep water accumulation due to clogged storm inlet along main commercial strip.",
    nextAction: "DPWH & Barangay Maintenance Crew clearing main culvert",
    eta: "Today, 5:00 PM",
    department: "Barangay Public Works & Drainage Unit",
    timeline: [
      { status: "Reported", at: "2026-07-28 08:30", by: "Fields Ave Merchant", note: "Storm drain inlet blocked by debris." },
      { status: "Verified", at: "2026-07-28 10:15", by: "Insp. R. Santos", note: "Confirmed heavy siltation on 24-inch pipe." },
      { status: "In Progress", at: "2026-07-29 07:00", by: "Dispatch Team A", note: "Vacuum truck and manual declogging deployed." }
    ]
  },
  {
    id: "blb-102",
    code: "BAL-2026-02",
    title: "Unlit Streetlights Along Sta. Maria Village Perimeter Road",
    category: "Streetlight",
    severity: "Moderate",
    status: "Scheduled",
    purok: "Sta. Maria Village",
    street: "St. Jude Street",
    reportedAt: "2026-07-27",
    confirmations: 18,
    households: 22,
    impact: 64,
    lat: 15.1695,
    lng: 120.5948,
    x: 75,
    y: 22,
    summary: "Four consecutive LED streetlights are out, creating safety concerns for nocturnal pedestrians.",
    nextAction: "Replacement of LED ballast and photo sensors",
    eta: "Jul 30, 2026",
    department: "Barangay Electrical Maintenance",
    timeline: [
      { status: "Reported", at: "2026-07-27 19:40", by: "Resident Watch", note: "Dark section behind school wall." },
      { status: "Verified", at: "2026-07-28 09:00", by: "Tanod Captain", note: "Verified 4 fixtures non-functional." },
      { status: "Scheduled", at: "2026-07-28 14:00", by: "Electrical Desk", note: "Parts requested from Angeles City Hall stock." }
    ]
  },
  {
    id: "blb-103",
    code: "BAL-2026-03",
    title: "Asphalt Pothole on MacArthur Highway Southbound Lane",
    category: "Road Damage",
    severity: "Critical",
    status: "Verified",
    purok: "MacArthur Highway Corridor",
    street: "MacArthur Highway near Astro Park Gate",
    reportedAt: "2026-07-29",
    confirmations: 31,
    households: 50,
    impact: 91,
    lat: 15.1654,
    lng: 120.5894,
    x: 52,
    y: 50,
    summary: "Deep 1.2-meter wide asphalt crater causing vehicle slowdowns and motorcycle hazard near pedestrian crosswalk.",
    nextAction: "Cold-mix asphalt patch team dispatch",
    eta: "Within 12 hours",
    department: "Angeles City Engineering Office",
    timeline: [
      { status: "Reported", at: "2026-07-29 06:15", by: "Commuter Hotline", note: "Pothole widened after heavy morning downpour." },
      { status: "Verified", at: "2026-07-29 07:30", by: "Traffic Tanod Patrol", note: "Warning cone placed on site." }
    ]
  },
  {
    id: "blb-104",
    code: "BAL-2026-04",
    title: "Uncollected Commercial Waste in Don Pepe Subdivision",
    category: "Garbage",
    severity: "Low",
    status: "Completed",
    purok: "Don Pepe Subdivision",
    street: "Bougainvillea St.",
    reportedAt: "2026-07-26",
    confirmations: 12,
    households: 15,
    impact: 38,
    lat: 15.1638,
    lng: 120.5875,
    x: 28,
    y: 72,
    summary: "Accumulated yard clippings and discarded furniture placed near sidewalk block passage.",
    nextAction: "Resident verification confirmation",
    eta: "Completed",
    department: "Barangay Solid Waste Unit",
    timeline: [
      { status: "Reported", at: "2026-07-26 11:00", by: "Homeowners Officer", note: "Dumped garden waste needs truck pickup." },
      { status: "Completed", at: "2026-07-27 16:30", by: "Eco-Waste Truck #2", note: "Debris cleared and area disinfected." }
    ]
  },
  {
    id: "blb-105",
    code: "BAL-2026-05",
    title: "Low Water Pressure reported in Diamond Subdivision Phase 2",
    category: "Water Supply",
    severity: "Moderate",
    status: "Assigned",
    purok: "Diamond Subdivision",
    street: "Emerald Avenue",
    reportedAt: "2026-07-29",
    confirmations: 19,
    households: 28,
    impact: 58,
    lat: 15.1622,
    lng: 120.5962,
    x: 82,
    y: 74,
    summary: "Fluctuating water head during peak morning hours reported by multiple residential blocks.",
    nextAction: "Coordination with PrimeWater Angeles for booster pump check",
    eta: "Jul 30, 2026",
    department: "Public Utilities Liaison Desk",
    timeline: [
      { status: "Reported", at: "2026-07-29 07:45", by: "Subdivision Admin", note: "Water pressure drops below 10 PSI." },
      { status: "Assigned", at: "2026-07-29 09:30", by: "Engr. M. Cruz", note: "Liaison ticket submitted to PrimeWater AC." }
    ]
  }
];

export type Proposal = {
  id: string;
  title: string;
  purok: string;
  blurb: string;
  votes: number;
  goal: number;
  submittedBy: string;
};

export const PROPOSALS: Proposal[] = [
  {
    id: "p1",
    title: "Solar-Powered Pedestrian Crosswalk Lights on MacArthur Hwy",
    purok: "MacArthur Highway Corridor",
    blurb: "Install illuminated solar warning studs and high-visibility flashing beacons for late-night commuters near Bayanihan Astro Park.",
    votes: 142,
    goal: 200,
    submittedBy: "Balibago Commuter Association",
  },
  {
    id: "p2",
    title: "Community Solar Composting Station in Mt. View Subd.",
    purok: "Mt. View Subdivision",
    blurb: "Establish a zero-smell organic composting facility to turn neighborhood food waste into urban garden fertilizer.",
    votes: 98,
    goal: 150,
    submittedBy: "Green Balibago Eco Council",
  },
  {
    id: "p3",
    title: "Free Public Wi-Fi & Digital Kiosk at Barangay Hall Complex",
    purok: "Barangay Hall Complex",
    blurb: "Provide high-speed fiber internet and touchscreen document filing assistance for senior citizens and students.",
    votes: 185,
    goal: 200,
    submittedBy: "SK Youth Council Balibago",
  },
];

export type FeedItem = {
  id: string;
  time: string;
  title: string;
  detail: string;
  kind: "Issues" | "Services" | "Events" | "Announcements" | "Alerts";
  distance: string;
};

export const FEED: FeedItem[] = [
  {
    id: "f-101",
    time: "10 mins ago",
    title: "Drainage Declogging Operations in Progress",
    detail: "Barangay Public Works crew active at Fields Ave cor Astro Park.",
    kind: "Alerts",
    distance: "Fields Avenue District",
  },
  {
    id: "f-102",
    time: "1 hour ago",
    title: "Barangay Medical & Dental Outreach Announced",
    detail: "Free health checkup and medicine distribution at Balibago Covered Court on Saturday, 8:00 AM.",
    kind: "Events",
    distance: "Barangay Hall Complex",
  },
  {
    id: "f-103",
    time: "3 hours ago",
    title: "Road Repair Crew Scheduled on MacArthur Hwy",
    detail: "DPWH maintenance squad arriving tonight for asphalt patch work.",
    kind: "Announcements",
    distance: "MacArthur Highway Corridor",
  },
];

export const BADGES = [
  {
    icon: "ShieldCheck",
    name: "Verified Civic Reporter",
    detail: "Filed 3+ verified reports that led to inspectable repairs in Balibago.",
  },
  {
    icon: "Users",
    name: "Neighborhood Inspector",
    detail: "Participated in 5+ resident resolution verification votes.",
  },
  {
    icon: "CheckCircle2",
    name: "Community Watch Leader",
    detail: "Helped confirm duplicate issues to streamline barangay dispatch.",
  },
];

export type ServiceItem = {
  id: string;
  name: string;
  group: string;
  fee: string;
  time: string;
  requirements: string[];
  location: string;
};

export const SERVICES: ServiceItem[] = [
  {
    id: "s1",
    name: "Barangay Clearance Certificate",
    group: "Clearances & Permits",
    fee: "₱100.00",
    time: "Same day (15-30 mins)",
    requirements: ["Valid Govt ID", "Community Tax Certificate (Cedula)", "2x2 ID Photo"],
    location: "Window 1, Barangay Hall Complex, MacArthur Highway",
  },
  {
    id: "s2",
    name: "Certificate of Indigency",
    group: "Social Services",
    fee: "Free of Charge",
    time: "Same day (10-20 mins)",
    requirements: ["Purok Chairman Certification", "Valid Govt ID"],
    location: "Social Welfare Desk, Barangay Hall Complex",
  },
  {
    id: "s3",
    name: "Business Permit Clearance (Balibago Commercial Zone)",
    group: "Clearances & Permits",
    fee: "₱500.00",
    time: "1 Business Day",
    requirements: [
      "DTI / SEC Registration",
      "Occupancy Permit",
      "Fire Safety Inspection Certificate",
    ],
    location: "Business Licensing Window, Barangay Hall Complex",
  },
  {
    id: "s4",
    name: "Barangay Blotter & Dispute Mediation (Katarungang Pambarangay)",
    group: "Justice & Security",
    fee: "Free of Charge",
    time: "Scheduled hearing within 3 days",
    requirements: ["Complainant Statement", "Valid Govt ID"],
    location: "Lupong Tagapamayapa Office, Barangay Hall Complex",
  },
];

export const TREND = [
  { month: "Jan", resolved: 24, reported: 28 },
  { month: "Feb", resolved: 31, reported: 35 },
  { month: "Mar", resolved: 42, reported: 40 },
  { month: "Apr", resolved: 38, reported: 45 },
  { month: "May", resolved: 50, reported: 48 },
  { month: "Jun", resolved: 58, reported: 54 },
  { month: "Jul", resolved: 62, reported: 60 },
];
