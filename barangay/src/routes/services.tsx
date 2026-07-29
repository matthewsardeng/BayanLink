import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BadgeCheck, Building2, Clock, FileText, Phone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { barangay, UNAVAILABLE } from "@/lib/barangay";
import { OfficialBadge } from "@/components/badges";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Barangay Services & Requirements — Barangay Balibago" },
      {
        name: "description",
        content:
          "Barangay clearance, certificate of indigency, certificate of residency, business clearance and more — requirements and how to apply in Barangay Balibago, Angeles City.",
      },
      { property: "og:title", content: "Barangay Services — Barangay Balibago" },
      {
        property: "og:description",
        content: "Requirements and application steps for Barangay Balibago services.",
      },
    ],
  }),
  component: Services,
});

type ServiceRow = {
  id: string;
  slug: string;
  name: string;
  summary: string | null;
  description: string | null;
  requirements: string[];
  fee_info: string | null;
  processing_info: string | null;
  where_to_apply: string | null;
  where_to_claim: string | null;
  contact_info: string | null;
  source_note: string | null;
  online_request_enabled: boolean;
};

function Services() {
  const { data, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      return (data ?? []) as ServiceRow[];
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-10">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Official</p>
        <h1 className="mt-2 font-display text-4xl">Barangay services</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Service information documented from publicly available government sources. Where a fee or
          processing time has not been publicly confirmed for Barangay Balibago, this page says so
          rather than guessing — always confirm at the barangay hall.
        </p>
      </header>

      <div className="mb-10 rounded-lg border border-official/35 bg-official-soft/25 p-6">
        <div className="flex items-center gap-2">
          <BadgeCheck className="size-4 text-official" />
          <h2 className="font-display text-lg">Where to go</h2>
        </div>
        <ul className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <li className="flex gap-2">
            <Building2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span>{barangay.hall.address}</span>
          </li>
          <li className="flex gap-2">
            <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span>{barangay.contact.hotline}</span>
          </li>
          <li className="flex gap-2">
            <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span>
              {barangay.officeHours.map((o) => (
                <span key={o.days} className="block">
                  {o.days}: {o.hours}
                </span>
              ))}
            </span>
          </li>
        </ul>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-lg" />
      ) : (data?.length ?? 0) === 0 ? (
        <EmptyState
          icon={<FileText className="size-5" />}
          title="No public information is currently available."
          description="Verified barangay services will be published here."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {data?.map((s) => <ServiceCard key={s.id} service={s} />)}
        </div>
      )}
    </div>
  );
}

function ServiceCard({ service }: { service: ServiceRow }) {
  return (
    <article className="flex flex-col rounded-lg border border-border bg-card p-6">
      <OfficialBadge />
      <h2 className="mt-3 font-display text-xl leading-snug">{service.name}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.summary}</p>

      {service.description ? (
        <p className="mt-3 text-sm leading-relaxed">{service.description}</p>
      ) : null}

      <div className="mt-5">
        <h3 className="text-xs font-semibold tracking-wide uppercase">Requirements</h3>
        {service.requirements.length ? (
          <ul className="mt-2 grid gap-1.5 text-sm text-muted-foreground">
            {service.requirements.map((r) => (
              <li key={r} className="flex gap-2">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                {r}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">{UNAVAILABLE}</p>
        )}
      </div>

      <dl className="mt-5 grid gap-3 text-sm">
        <Field label="Fee" value={service.fee_info} />
        <Field label="Processing time" value={service.processing_info} />
        <Field label="Where to apply" value={service.where_to_apply} />
        <Field label="Where to claim" value={service.where_to_claim} />
      </dl>

      {service.source_note ? (
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{service.source_note}</p>
      ) : null}

      <div className="mt-6 pt-2">
        {service.online_request_enabled ? (
          <RequestDialog service={service} />
        ) : (
          <p className="text-xs text-muted-foreground">
            Online requests are not available for this service. Please visit the barangay hall.
          </p>
        )}
      </div>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex gap-2">
      <dt className="w-32 shrink-0 text-muted-foreground">{label}</dt>
      <dd>{value ?? UNAVAILABLE}</dd>
    </div>
  );
}

function RequestDialog({ service }: { service: ServiceRow }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [details, setDetails] = useState("");
  const [contact, setContact] = useState("");

  const submit = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in to request this service.");
      if (purpose.trim().length < 4) throw new Error("Please state the purpose of your request.");
      const { data, error } = await supabase
        .from("service_requests")
        .insert({
          requester_id: user.id,
          service_id: service.id,
          purpose: purpose.trim(),
          details: details.trim() || null,
          contact_number: contact.trim() || null,
        })
        .select("reference_no")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (d) => {
      toast.success(`Request submitted — reference ${d.reference_no}`);
      setOpen(false);
      setPurpose("");
      setDetails("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!user) {
    return (
      <p className="text-sm">
        <Link to="/auth" search={{ next: "/services" }} className="text-primary underline">
          Sign in
        </Link>{" "}
        to request this service online.
      </p>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Request this service</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{service.name}</DialogTitle>
          <DialogDescription>
            Submitting a request reserves your slot. Bring the listed requirements and claim your
            document at the barangay hall.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="r-purpose">Purpose</Label>
            <Input
              id="r-purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Employment requirement"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="r-contact">Contact number (optional)</Label>
            <Input id="r-contact" value={contact} onChange={(e) => setContact(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="r-details">Additional details (optional)</Label>
            <Textarea
              id="r-details"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => submit.mutate()} disabled={submit.isPending}>
            Submit request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
