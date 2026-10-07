import Link from "next/link";
import type { PublicSite } from "@/types/domain";

export function Footer({ site }: { site: PublicSite }) {
  return (
    <footer className="footer">
      <span>The Mingle · Ages {site.event.ageMin}–{site.event.ageMax}</span>
      <span>Learn. Connect. Play. Grow.</span>
      <span>
        <Link href="/rsvp">RSVP</Link>
        {site.event.instagram ? (
          <>
            {" · "}
            <a href={site.event.instagram}>Instagram</a>
          </>
        ) : null}
        {site.event.contactEmail ? (
          <>
            {" · "}
            <a href={`mailto:${site.event.contactEmail}`}>{site.event.contactEmail}</a>
          </>
        ) : null}
      </span>
    </footer>
  );
}
