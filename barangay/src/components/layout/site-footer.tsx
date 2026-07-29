import { Link } from "@tanstack/react-router";
import { barangay } from "@/lib/barangay";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary font-display text-lg text-primary-foreground">
              B
            </span>
            <span className="font-display text-lg">Barangay Balibago</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            A community platform for the residents of Barangay Balibago, {barangay.city},{" "}
            {barangay.province}. Official information is published by barangay personnel; posts,
            suggestions and reports are submitted by residents.
          </p>
          <div className="mt-5 space-y-1 text-sm text-muted-foreground">
            <p>{barangay.hall.address}</p>
            <p>Hotline: {barangay.contact.hotline}</p>
            {barangay.officeHours.map((o) => (
              <p key={o.days}>
                {o.days}: {o.hours}
              </p>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-wider text-foreground uppercase">Community</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/community" className="hover:text-foreground">
                Community feed
              </Link>
            </li>
            <li>
              <Link to="/community/updates" className="hover:text-foreground">
                Community updates
              </Link>
            </li>
            <li>
              <Link to="/community/suggestions" className="hover:text-foreground">
                Suggestions
              </Link>
            </li>
            <li>
              <Link to="/issues" className="hover:text-foreground">
                Community issues
              </Link>
            </li>
            <li>
              <Link to="/map" className="hover:text-foreground">
                Community map
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-wider text-foreground uppercase">
            Public sources
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {barangay.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-foreground"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-muted-foreground">
          This is a community platform. Information shown here is drawn from public sources and from
          residents. For official transactions and confirmations, contact the Barangay Balibago hall
          directly at {barangay.contact.hotline}.
        </p>
      </div>
    </footer>
  );
}
