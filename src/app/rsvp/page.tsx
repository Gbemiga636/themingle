import { PublicFrame } from "@/components/site/frame";
import { RsvpForm } from "@/components/rsvp/form";
import { getPublicSite, getStore } from "@/lib/store";
import { formatVenue, formatWhen } from "@/lib/format";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "RSVP" };

export default async function RsvpPage() {
  const site = getPublicSite(await getStore());
  return (
    <PublicFrame>
      <main className="rsvp-page">
        <div>
          <p className="eyebrow">The list</p>
          <h1 className="display">I’m ready to mingle.</h1>
          <p style={{ maxWidth: "36ch", lineHeight: 1.6, color: "rgba(243,238,230,0.75)" }}>
            {site.event.description}
          </p>
          <p className="hero-meta">
            <span>{formatWhen(site.event.date, site.event.time)}</span>
            <span>{formatVenue(site.event.venue, site.event.city)}</span>
          </p>
        </div>
        <RsvpForm site={site} />
      </main>
    </PublicFrame>
  );
}
