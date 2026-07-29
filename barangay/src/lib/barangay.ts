/**
 * Verified public information about Barangay Balibago, Angeles City, Pampanga.
 *
 * ONLY add entries here that can be traced to a public, verifiable source.
 * Anything unverified must stay `null` so the UI renders an honest empty state
 * instead of fabricated content.
 */

export const UNAVAILABLE = "Information is currently unavailable.";

export const barangay = {
  name: "Barangay Balibago",
  city: "Angeles City",
  province: "Pampanga",
  region: "Central Luzon (Region III)",
  postalCode: "2009",
  classification: "Urban",
  hall: {
    name: "Balibago Barangay Hall",
    address: "T. Aguas St., Balibago, Angeles City, Pampanga 2009",
    source: "OpenStreetMap / public business listings for Balibago Barangay Hall",
  },
  contact: {
    hotline: "(045) 624-5800",
    email: null as string | null,
    facebook: "https://www.facebook.com/barangay.balibago.ac/",
  },
  officeHours: [
    { days: "Monday – Friday", hours: "8:00 AM – 5:00 PM" },
    { days: "Saturday – Sunday", hours: "Closed" },
  ],
  coordinates: { lat: 15.1663, lng: 120.5901 },
  elevationMeters: 103.4,
  /** Philippine Statistics Authority census counts, via PhilAtlas. */
  population: [
    { year: 2000, value: 27914 },
    { year: 2010, value: 32291 },
    { year: 2015, value: 40087 },
    { year: 2020, value: 42274 },
  ],
  /** Publicly documented officials could not be verified — keep empty. */
  officials: [] as Array<{ name: string; position: string; source: string }>,
  sources: [
    { label: "PhilAtlas — Balibago, Angeles profile (PSA census data)", url: "https://www.philatlas.com/luzon/r03/angeles/balibago.html" },
    { label: "Lungsod ng Angeles — Official City Government website", url: "https://angelescity.gov.ph/" },
    { label: "Barangay Balibago Lungsod Angeles — official Facebook page", url: "https://www.facebook.com/barangay.balibago.ac/" },
    { label: "Philippine Statistics Authority", url: "https://psa.gov.ph/" },
  ],
} as const;

export const latestPopulation = barangay.population[barangay.population.length - 1];

/**
 * Hero background image. Replace the import target below (or swap in any
 * public URL) to change the landing page hero without touching layout code.
 */
export const heroImage = {
  /** Set to null to render the neutral placeholder state instead of a photo. */
  enabled: true,
  alt: "Aerial view of a Central Luzon neighbourhood at golden hour",
  credit:
    "Illustrative photograph of a Central Luzon neighbourhood — not a documented photo of Barangay Balibago.",
};
