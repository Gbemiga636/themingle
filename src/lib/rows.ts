import { joinGuests, paymentStateOf } from "@/lib/store";
import { paymentLabel } from "@/lib/format";
import type { Store } from "@/types/domain";
import type { GuestRow } from "@/types/guest";

export function guestRows(store: Store): GuestRow[] {
  return joinGuests(store).map((guest) => ({
    id: guest.attendee.id,
    rsvpId: guest.rsvp.id,
    name: guest.attendee.fullName,
    email: guest.attendee.email,
    phone: guest.attendee.phone,
    age: guest.attendee.age,
    gender: guest.attendee.gender,
    relationship: guest.attendee.relationshipStatus,
    city: guest.attendee.city,
    status: guest.rsvp.status,
    payment: paymentLabel(paymentStateOf(guest, store.event.paymentEnabled)),
    source: guest.rsvp.source,
    ticket: guest.ticket?.name || "—",
    createdAt: guest.rsvp.createdAt,
    sample: guest.attendee.sample,
    reference: guest.rsvp.reference,
  }));
}
