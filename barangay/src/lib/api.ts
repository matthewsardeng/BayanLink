import { supabase } from "@/integrations/supabase/client";

export type AuthorMap = Record<string, { full_name: string; avatar_url: string | null }>;

export async function fetchAuthors(ids: Array<string | null | undefined>): Promise<AuthorMap> {
  const unique = Array.from(new Set(ids.filter(Boolean) as string[]));
  if (unique.length === 0) return {};
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .in("id", unique);
  const map: AuthorMap = {};
  for (const p of data ?? []) map[p.id] = { full_name: p.full_name, avatar_url: p.avatar_url };
  return map;
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
