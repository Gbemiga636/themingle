import { notFound } from "next/navigation";
import { PublicFrame } from "@/components/site/frame";
import { TicketQr } from "@/components/rsvp/qr";
import { findGuestByReference, getStore } from "@/lib/store";
import { formatVenue, formatWhen, paymentLabel, siteUrl } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function TicketPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const store = await getStore();
  const guest = findGuestByReference(store, decodeURIComponent(ref));
  if (!guest) notFound();
  return (
    <PublicFrame>
      <main className="ticket-page">
        <div>
          <p className="eyebrow">The Mingle</p>
          <h1 className="display">{guest.attendee.fullName.split(" ")[0]}</h1>
          <p>Your invitation.</p>
        </div>
        <article className="ticket-card">
          <p>RSVP {guest.rsvp.reference}</p>
          <p>Status · {paymentLabel(guest.rsvp.status)}</p>
          <p>{formatWhen(store.event.date, store.event.time)}</p>
          <p>{formatVenue(store.event.venue, store.event.city)}</p>
          <TicketQr value={`${siteUrl()}/ticket/${guest.rsvp.reference}`} />
        </article>
      </main>
    </PublicFrame>
  );
}
