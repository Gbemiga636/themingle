import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicFrame } from "@/components/site/frame";
import { TicketQr } from "@/components/rsvp/qr";
import { ShareInvite } from "@/components/rsvp/share";
import { findGuestByReference, getStore } from "@/lib/store";
import { formatVenue, formatWhen, paymentLabel, siteUrl } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ConfirmationPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const store = await getStore();
  const guest = findGuestByReference(store, ref);
  if (!guest) notFound();
  const confirmed = guest.rsvp.status === "confirmed";
  return (
    <PublicFrame>
      <main className="ticket-page">
        <div>
          <p className="eyebrow">{confirmed ? "You’re on the list" : "We have your name"}</p>
          <h1 className="display">{confirmed ? "Welcome to The Mingle." : "Hold this place."}</h1>
          <p style={{ maxWidth: "36ch", lineHeight: 1.6 }}>
            {confirmed
              ? "This is your invitation. Keep the reference. We’ll use it when the evening is announced."
              : "Your RSVP is pending. If payment is required, confirmation follows a successful payment."}
          </p>
        </div>
        <article className="ticket-card">
          <p className="eyebrow">Invitation</p>
          <b>{guest.attendee.fullName}</b>
          <p>RSVP {guest.rsvp.reference}</p>
          <p>Status · {paymentLabel(guest.rsvp.status)}</p>
          <p>{formatWhen(store.event.date, store.event.time)}</p>
          <p>{formatVenue(store.event.venue, store.event.city)}</p>
          {store.event.address ? <p>{store.event.address}</p> : null}
          <TicketQr value={`${siteUrl()}/ticket/${guest.rsvp.reference}`} />
          <div className="row-actions">
            {store.event.date ? (
              <a className="btn-fill" href={`/api/calendar/${guest.rsvp.reference}`}>
                Add to calendar
              </a>
            ) : (
              <span className="btn-line">Calendar opens when the date is set</span>
            )}
            <ShareInvite title={store.event.name || "The Mingle"} />
          </div>
          <p style={{ color: "rgba(243,238,230,0.65)" }}>See you on the other side.</p>
          <Link href="/">Back to The Mingle</Link>
        </article>
      </main>
    </PublicFrame>
  );
}
