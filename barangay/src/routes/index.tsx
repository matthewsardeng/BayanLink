import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Clock,
  FileText,
  Lightbulb,
  MapPin,
  Megaphone,
  MessageSquare,
  Phone,
  TriangleAlert,
  Users,
} from "lucide-react";
import heroImage from "@/assets/bg.jpg";
import { supabase } from "@/integrations/supabase/client";
import { barangay, heroImage as heroConfig, latestPopulation } from "@/lib/barangay";
import { fetchAuthors, formatDate, timeAgo } from "@/lib/api";
import { announcementKinds, issueStatuses, labelFor, postCategories } from "@/lib/taxonomy";
import { CategoryChip, CommunityBadge, OfficialBadge, StatusPill } from "@/components/badges";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Barangay Balibago — Community Hub, Services & Issue Reporting" },
      {
        name: "description",
        content:
          "The digital community hub of Barangay Balibago, Angeles City, Pampanga. Browse barangay services, report community issues, share suggestions and follow official updates.",
      },
      { property: "og:title", content: "Barangay Balibago Community Hub" },
      {
        property: "og:description",
        content:
          "Services, community issues, resident discussions and official updates for Barangay Balibago, Angeles City.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { data } = useQuery({
    queryKey: ["landing"],
    queryFn: async () => {
      const [announcements, posts, suggestions, issues, services] = await Promise.all([
        supabase
          .from("announcements")
          .select("id, title, body, kind, published_at, created_at")
          .eq("is_published", true)
          .order("published_at", { ascending: false, nullsFirst: false })
          .limit(3),
        supabase
          .from("posts")
          .select("id, author_id, category, content, is_official, created_at")
          .eq("status", "visible")
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("suggestions")
          .select("id, title, description, status, created_at")
          .eq("content_status", "visible")
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("issues")
          .select("id, title, category, status, location_label, created_at")
          .eq("content_status", "visible")
          .order("created_at", { ascending: false })
          .limit(4),
        supabase
          .from("services")
          .select("id, slug, name, summary")
          .eq("is_active", true)
          .order("sort_order")
          .limit(6),
      ]);
      const authors = await fetchAuthors((posts.data ?? []).map((p) => p.author_id));
      return {
        announcements: announcements.data ?? [],
        posts: posts.data ?? [],
        authors,
        suggestions: suggestions.data ?? [],
        issues: issues.data ?? [],
        services: services.data ?? [],
      };
    },
  });

  return (
    <>
      <Hero />
      <QuickActions />
      <Services services={data?.services ?? []} />
      <Announcements items={data?.announcements ?? []} />
      <CommunityPreview posts={data?.posts ?? []} authors={data?.authors ?? {}} />
      <SuggestionsPreview items={data?.suggestions ?? []} />
      <IssuesPreview items={data?.issues ?? []} />
      <About />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate flex min-h-[78vh] items-center justify-center overflow-hidden">
      {heroConfig.enabled ? (
        <img
          src={heroImage}
          alt={heroConfig.alt}
          width={1920}
          height={1088}
          className="absolute inset-0 -z-10 size-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 -z-10 flex items-center justify-center bg-secondary">
          <span className="text-sm text-muted-foreground">Hero image not set</span>
        </div>
      )}
      <div className="absolute inset-0 -z-10 bg-foreground/60" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-background/90 to-transparent" />

      <div className="mx-auto max-w-3xl px-4 py-24 text-center animate-rise">
        <p className="inline-flex items-center gap-2 rounded-full border border-background/30 bg-background/10 px-3 py-1 text-xs font-medium tracking-wider text-background uppercase backdrop-blur">
          <MapPin className="size-3.5" /> {barangay.city}, {barangay.province}
        </p>
        <h1 className="mt-6 font-display text-5xl leading-[1.05] text-background text-balance-tight sm:text-7xl">
          Balibago, together.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/85 sm:text-lg">
          One place for barangay services, community issues and the everyday conversations that keep
          our neighbourhood moving.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/community">
              Explore the Community <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-background/50 bg-background/10 text-background backdrop-blur hover:bg-background hover:text-foreground"
          >
            <Link to="/services">Request a Service</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="text-background hover:bg-background/15 hover:text-background"
          >
            <Link to="/issues/new">Report an Issue</Link>
          </Button>
        </div>
      </div>

      <p className="absolute bottom-3 left-1/2 w-full max-w-2xl -translate-x-1/2 px-4 text-center text-[11px] text-background/60">
        {heroConfig.credit}
      </p>
    </section>
  );
}

function QuickActions() {
  const items = [
    {
      to: "/services",
      icon: FileText,
      title: "Barangay services",
      body: "Clearances, certificates and mediation — with the requirements listed up front.",
    },
    {
      to: "/issues/new",
      icon: TriangleAlert,
      title: "Report an issue",
      body: "Flooding, road damage, streetlights or garbage. Track it with a reference number.",
    },
    {
      to: "/community",
      icon: MessageSquare,
      title: "Join the conversation",
      body: "Updates, questions and discussions from residents of Barangay Balibago.",
    },
  ];
  return (
    <section className="mx-auto -mt-14 max-w-6xl px-4">
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((i) => (
          <Link
            key={i.to}
            to={i.to}
            className="group rounded-lg border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span className="flex size-11 items-center justify-center rounded-md bg-primary-soft text-primary">
              <i.icon className="size-5" />
            </span>
            <h3 className="mt-4 font-display text-lg">{i.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.body}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: { to: string; label: string };
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">{eyebrow}</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">{title}</h2>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? (
        <Button asChild variant="outline" size="sm">
          <Link to={action.to}>
            {action.label} <ArrowRight className="size-4" />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}

function Services({ services }: { services: Array<{ id: string; slug: string; name: string; summary: string | null }> }) {
  return (
    <section className="mx-auto mt-24 max-w-6xl px-4">
      <SectionHeading
        eyebrow="Official"
        title="Barangay services"
        description="Services documented from public government sources. Fees and processing times are shown only once verified with the barangay hall."
        action={{ to: "/services", label: "All services" }}
      />
      {services.length === 0 ? (
        <EmptyState
          icon={<FileText className="size-5" />}
          title="No public information is currently available."
          description="Verified barangay services will appear here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.id}
              to="/services"
              className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center gap-2">
                <OfficialBadge />
              </div>
              <h3 className="mt-3 font-display text-lg leading-snug">{s.name}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {s.summary}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function Announcements({
  items,
}: {
  items: Array<{ id: string; title: string; body: string; kind: string; published_at: string | null; created_at: string }>;
}) {
  return (
    <section className="mx-auto mt-24 max-w-6xl px-4">
      <SectionHeading
        eyebrow="Official"
        title="Announcements and advisories"
        description="Published by authorised Barangay Balibago personnel."
        action={{ to: "/community/updates", label: "All updates" }}
      />
      {items.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="size-5" />}
          title="No announcements available at this time."
          description="Official announcements will appear here when available."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((a) => (
            <article
              key={a.id}
              className="rounded-lg border border-official/35 bg-official-soft/30 p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <OfficialBadge />
                <CategoryChip label={labelFor(announcementKinds, a.kind)} />
              </div>
              <h3 className="mt-3 font-display text-lg leading-snug">{a.title}</h3>
              <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                {a.body}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                {formatDate(a.published_at ?? a.created_at)}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function CommunityPreview({
  posts,
  authors,
}: {
  posts: Array<{ id: string; author_id: string; category: string; content: string; is_official: boolean; created_at: string }>;
  authors: Record<string, { full_name: string }>;
}) {
  return (
    <section className="mt-24 border-y border-border bg-secondary/40 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Community"
          title="What neighbours are talking about"
          description="Posts written by residents. Community content is not official barangay information."
          action={{ to: "/community", label: "Open the feed" }}
        />
        {posts.length === 0 ? (
          <EmptyState
            icon={<Users className="size-5" />}
            title="No community posts yet."
            description="Be the first to share something with your neighbours."
            action={
              <Button asChild>
                <Link to="/community">Create a Post</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.id}
                to="/community/$postId"
                params={{ postId: p.id }}
                className="rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-lift"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {p.is_official ? <OfficialBadge /> : <CommunityBadge />}
                  <CategoryChip label={labelFor(postCategories, p.category)} />
                </div>
                <p className="mt-3 line-clamp-5 text-sm leading-relaxed">{p.content}</p>
                <p className="mt-4 text-xs text-muted-foreground">
                  {p.is_official
                    ? "Barangay Balibago Official"
                    : (authors[p.author_id]?.full_name ?? "Resident")}{" "}
                  · {timeAgo(p.created_at)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SuggestionsPreview({
  items,
}: {
  items: Array<{ id: string; title: string; description: string; status: string; created_at: string }>;
}) {
  return (
    <section className="mx-auto mt-24 max-w-6xl px-4">
      <SectionHeading
        eyebrow="Community"
        title="Ideas from residents"
        description="Suggestions submitted by residents, with clearly separated official responses."
        action={{ to: "/community/suggestions", label: "All suggestions" }}
      />
      {items.length === 0 ? (
        <EmptyState
          icon={<Lightbulb className="size-5" />}
          title="No suggestions yet."
          description="Have an idea that could improve the community?"
          action={
            <Button asChild>
              <Link to="/community/suggestions">Share a suggestion</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((s) => (
            <Link
              key={s.id}
              to="/community/suggestions/$suggestionId"
              params={{ suggestionId: s.id }}
              className="rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-lift"
            >
              <CommunityBadge />
              <h3 className="mt-3 font-display text-lg leading-snug">{s.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{s.description}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function IssuesPreview({
  items,
}: {
  items: Array<{ id: string; title: string; category: string; status: string; location_label: string; created_at: string }>;
}) {
  return (
    <section className="mx-auto mt-24 max-w-6xl px-4">
      <SectionHeading
        eyebrow="Community reports"
        title="Issues around the barangay"
        description="Reported by residents and tracked through a transparent status timeline."
        action={{ to: "/issues", label: "All issues" }}
      />
      {items.length === 0 ? (
        <EmptyState
          icon={<TriangleAlert className="size-5" />}
          title="No community issues have been reported."
          description="Spotted flooding, road damage or a broken streetlight? Let the barangay know."
          action={
            <Button asChild>
              <Link to="/issues/new">Report an Issue</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3">
          {items.map((i) => (
            <Link
              key={i.id}
              to="/issues/$issueId"
              params={{ issueId: i.id }}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-5 py-4 transition-colors hover:border-primary/40"
            >
              <StatusPill status={i.status} label={labelFor(issueStatuses, i.status)} />
              <span className="font-medium">{i.title}</span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" /> {i.location_label}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">{timeAgo(i.created_at)}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function About() {
  return (
    <section className="mt-24 border-t border-border bg-card py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            About the barangay
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">Barangay Balibago</h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Balibago is an urban barangay of {barangay.city}, {barangay.province}, in{" "}
            {barangay.region}. The figures below come from Philippine Statistics Authority census
            data published through PhilAtlas.
          </p>

          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border p-4">
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                Population ({latestPopulation.year} census)
              </dt>
              <dd className="mt-1 font-display text-2xl">
                {latestPopulation.value.toLocaleString("en-PH")}
              </dd>
            </div>
            <div className="rounded-lg border border-border p-4">
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                Classification
              </dt>
              <dd className="mt-1 font-display text-2xl">{barangay.classification}</dd>
            </div>
            <div className="rounded-lg border border-border p-4">
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">Postal code</dt>
              <dd className="mt-1 font-display text-2xl">{barangay.postalCode}</dd>
            </div>
          </dl>

          <div className="mt-8">
            <h3 className="text-sm font-semibold">Barangay officials</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No publicly verified list of current officials is available. Information is currently
              unavailable and will be published here once confirmed through official channels.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-background p-6">
          <div className="flex items-center gap-2">
            <BadgeCheck className="size-4 text-official" />
            <h3 className="font-display text-lg">Contact the barangay</h3>
          </div>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <Building2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span>
                <span className="block font-medium">{barangay.hall.name}</span>
                <span className="text-muted-foreground">{barangay.hall.address}</span>
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span>
                <span className="block font-medium">{barangay.contact.hotline}</span>
                <span className="text-muted-foreground">Barangay hotline</span>
              </span>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span>
                {barangay.officeHours.map((o) => (
                  <span key={o.days} className="block">
                    <span className="font-medium">{o.days}</span>{" "}
                    <span className="text-muted-foreground">{o.hours}</span>
                  </span>
                ))}
              </span>
            </li>
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Email address: information is currently unavailable. For the barangay's public updates,
            see its{" "}
            <a
              href={barangay.contact.facebook}
              target="_blank"
              rel="noreferrer noopener"
              className="underline"
            >
              official Facebook page
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
