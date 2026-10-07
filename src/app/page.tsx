import { PublicFrame } from "@/components/site/frame";
import { Hero } from "@/components/site/hero";
import { Story } from "@/components/site/story";
import { Dress } from "@/components/site/dress";
import { Matters } from "@/components/site/matters";
import { Experience } from "@/components/site/experience";
import { Play } from "@/components/site/play";
import { Mingle } from "@/components/site/mingle";
import { Gallery } from "@/components/site/gallery";
import { Schedule } from "@/components/site/schedule";
import { Faq } from "@/components/site/faq";
import { Finale } from "@/components/site/finale";
import { Footer } from "@/components/site/footer";
import { getPublicSite, getStore } from "@/lib/store";
import { siteUrl } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const site = getPublicSite(await getStore());
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: site.event.name || "The Mingle",
    description: site.content.hero.description,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    typicalAgeRange: `${site.event.ageMin}-${site.event.ageMax}`,
    url: siteUrl(),
    organizer: site.event.organizer ? { "@type": "Organization", name: site.event.organizer } : undefined,
  };
  if (site.event.date) jsonLd.startDate = site.event.time ? `${site.event.date}T${site.event.time}` : site.event.date;
  if (site.event.venue || site.event.address) {
    jsonLd.location = {
      "@type": "Place",
      name: site.event.venue || undefined,
      address: site.event.address || site.event.city || undefined,
    };
  }

  return (
    <PublicFrame>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main>
        <Hero site={site} />
        <Story site={site} />
        <Dress />
        <Matters site={site} />
        <Experience site={site} />
        <Play site={site} />
        <Mingle site={site} />
        <Gallery site={site} />
        <Schedule site={site} />
        <Faq site={site} />
        <Finale site={site} />
      </main>
      <Footer site={site} />
    </PublicFrame>
  );
}
