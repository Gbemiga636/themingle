import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteGuest } from "@/components/admin/guests";
import { addNote, markAttended, saveMessage, updateAttendee } from "@/server/actions";
import { formatStamp, paymentLabel } from "@/lib/format";
import { findGuestById, getStore, paymentStateOf } from "@/lib/store";

export default async function AttendeeProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = await getStore();
  const guest = findGuestById(store, id);
  if (!guest) notFound();
  const notes = store.notes.filter((note) => note.attendeeId === guest.attendee.id);
  const messages = store.communications.filter((item) => item.attendeeId === guest.attendee.id);
  const person = guest.attendee;

  return (
    <div>
      <p className="eyebrow">
        <Link href="/admin/attendees">Attendees</Link> · {guest.rsvp.reference}
      </p>
      <div className="admin-top">
        <h1>{person.fullName}</h1>
        <DeleteGuest id={person.id} name={person.fullName} />
      </div>
      {person.sample ? <div className="banner">This profile is demonstration data.</div> : null}
      <div className="stats">
        <article className="stat"><b style={{ fontSize: "1.3rem" }}>{paymentLabel(guest.rsvp.status)}</b><span>RSVP</span></article>
        <article className="stat"><b style={{ fontSize: "1.3rem" }}>{paymentLabel(paymentStateOf(guest, store.event.paymentEnabled))}</b><span>Payment</span></article>
        <article className="stat"><b>{person.age}</b><span>Age</span></article>
        <article className="stat"><b style={{ fontSize: "1.3rem" }}>{guest.attendance?.status === "attended" ? "In" : "—"}</b><span>Attendance</span></article>
      </div>
      <div className="admin-split" style={{ marginTop: "1rem" }}>
        <form className="panel form" action={updateAttendee}>
          <h2>Personal</h2>
          <input type="hidden" name="id" value={person.id} />
          <label>Name<input name="fullName" defaultValue={person.fullName} /></label>
          <label>Email<input name="email" defaultValue={person.email} /></label>
          <label>Phone<input name="phone" defaultValue={person.phone} /></label>
          <label>Age<input name="age" type="number" defaultValue={person.age} /></label>
          <label>Gender<input name="gender" defaultValue={person.gender} /></label>
          <label>Relationship<input name="relationshipStatus" defaultValue={person.relationshipStatus} /></label>
          <label>Profession<input name="profession" defaultValue={person.profession} /></label>
          <label>City<input name="city" defaultValue={person.city} /></label>
          <label>Dietary<input name="dietary" defaultValue={person.dietary} /></label>
          <label>Interests<input name="interests" defaultValue={person.interests} /></label>
          <label>
            RSVP status
            <select name="status" defaultValue={guest.rsvp.status}>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="waitlist">Waitlist</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          <button className="btn-fill" type="submit" style={{ color: "#0c0b0a" }}>Save profile</button>
        </form>
        <div style={{ display: "grid", gap: "1rem" }}>
          <section className="panel">
            <h2>RSVP</h2>
            <p>Reference {guest.rsvp.reference}</p>
            <p>Registered {formatStamp(guest.rsvp.createdAt)}</p>
            <p>Source {guest.rsvp.source || "—"}</p>
            <p>Ticket {guest.ticket?.name || "—"}</p>
            <p>Consent {guest.rsvp.consent ? "Yes" : "No"}</p>
            <div className="row-actions">
              <form action={markAttended.bind(null, guest.rsvp.id, "attended")}><button type="submit">Mark attended</button></form>
              <form action={markAttended.bind(null, guest.rsvp.id, "no_show")}><button type="submit">Mark no-show</button></form>
            </div>
          </section>
          <section className="panel">
            <h2>Payment</h2>
            {guest.payment ? (
              <p>{paymentLabel(guest.payment.status)} {guest.payment.sample ? "· sample, not a real charge" : ""}</p>
            ) : (
              <p>No payment yet. {store.event.paymentEnabled ? "Payment is enabled." : "Payment is turned off."}</p>
            )}
          </section>
          <section className="panel">
            <h2>Private notes</h2>
            {notes.length === 0 ? <p>No notes yet.</p> : notes.map((note) => (
              <p key={note.id}><strong>{note.author}</strong> · {formatStamp(note.createdAt)}<br />{note.body}</p>
            ))}
            <form action={addNote}>
              <input type="hidden" name="attendeeId" value={person.id} />
              <textarea name="body" rows={3} placeholder="A private note" />
              <button type="submit">Add note</button>
            </form>
          </section>
          <section className="panel">
            <h2>Message</h2>
            <p>Saved here. Email, WhatsApp and SMS are not connected, so nothing is sent.</p>
            <form action={saveMessage}>
              <input type="hidden" name="attendeeId" value={person.id} />
              <select name="channel" defaultValue="email">
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="sms">SMS</option>
              </select>
              <input name="subject" placeholder="Subject" defaultValue="The Mingle" />
              <textarea name="body" rows={3} placeholder="Write the note" />
              <button type="submit">Save message</button>
            </form>
            {messages.map((message) => (
              <p key={message.id}>{message.channel} · {message.status} · {formatStamp(message.createdAt)}</p>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
