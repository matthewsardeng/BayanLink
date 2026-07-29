export const postCategories = [
  { value: "community_update", label: "Community Update" },
  { value: "suggestion", label: "Suggestion" },
  { value: "question", label: "Question" },
  { value: "discussion", label: "Discussion" },
  { value: "public_concern", label: "Public Concern" },
  { value: "announcement", label: "Announcement" },
  { value: "event", label: "Event" },
] as const;

export type PostCategory = (typeof postCategories)[number]["value"];

/** Categories a resident may choose in the composer. */
export const residentPostCategories = postCategories.filter(
  (c) => !["announcement", "event"].includes(c.value),
);

export const issueCategories = [
  { value: "road_damage", label: "Road damage" },
  { value: "flooding", label: "Flooding" },
  { value: "garbage", label: "Garbage" },
  { value: "drainage", label: "Drainage" },
  { value: "streetlights", label: "Streetlights" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "environment", label: "Environmental concern" },
  { value: "public_safety", label: "Public safety" },
  { value: "other", label: "Other" },
] as const;

export const issueStatuses = [
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under Review" },
  { value: "verified", label: "Verified" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "closed", label: "Closed" },
] as const;

export const suggestionCategories = [
  { value: "public_spaces", label: "Public spaces" },
  { value: "activities", label: "Community activities" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "environment", label: "Environment" },
  { value: "safety", label: "Safety" },
  { value: "community", label: "Other proposal" },
] as const;

export const suggestionStatuses = [
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under Review" },
  { value: "acknowledged", label: "Acknowledged" },
  { value: "in_progress", label: "In Progress" },
  { value: "implemented", label: "Implemented" },
  { value: "declined", label: "Not Feasible" },
] as const;

export const requestStatuses = [
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under Review" },
  { value: "processing", label: "Processing" },
  { value: "ready_for_claim", label: "Ready for Claim" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
] as const;

export const announcementKinds = [
  { value: "announcement", label: "Announcement" },
  { value: "advisory", label: "Advisory" },
  { value: "update", label: "Barangay Update" },
  { value: "event", label: "Public Event" },
  { value: "service_interruption", label: "Service Interruption" },
] as const;

export function labelFor(
  list: ReadonlyArray<{ value: string; label: string }>,
  value: string | null | undefined,
) {
  if (!value) return "—";
  return list.find((i) => i.value === value)?.label ?? value.replace(/_/g, " ");
}
