import { PublicFrame } from "@/components/site/frame";
import { RsvpForm } from "@/components/rsvp/form";
import { getPublicSite, getStore } from "@/lib/store";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "RSVP" };

export default async function RsvpPage() {
  const site = getPublicSite(await getStore());
  return (
    <PublicFrame>
      <main className="rsvp-page">
        <div className="rsvp-intro">
          <p className="eyebrow">The list</p>
          <h1 className="display">
            I’m ready
            <br />
            <em>to mingle.</em>
          </h1>
        </div>
        <div className="rsvp-card">
          <p className="eyebrow">Save your place</p>
          <h2>Tell us you’re coming.</h2>
          <RsvpForm site={site} />
        </div>
      </main>
    </PublicFrame>
  );
}
