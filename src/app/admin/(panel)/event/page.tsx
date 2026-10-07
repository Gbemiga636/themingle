import { updateEvent } from "@/server/actions";
import { getStore } from "@/lib/store";

export default async function EventPage() {
  const { event } = await getStore();
  return (
    <div>
      <div className="admin-top"><h1>Event</h1></div>
      <p>Leave date, venue and contact details blank until you know them. The site will say they are to be announced.</p>
      <form className="panel form" action={updateEvent}>
        <label>Name<input name="name" defaultValue={event.name} /></label>
        <label>Description<textarea name="description" rows={4} defaultValue={event.description} /></label>
        <label>Date<input type="date" name="date" defaultValue={event.date} /></label>
        <label>Time<input type="time" name="time" defaultValue={event.time} /></label>
        <label>Venue<input name="venue" defaultValue={event.venue} placeholder="Not announced" /></label>
        <label>Address<input name="address" defaultValue={event.address} /></label>
        <label>City<input name="city" defaultValue={event.city} /></label>
        <label>Capacity, blank if not set<input name="capacity" defaultValue={event.capacity ?? ""} /></label>
        <label>Minimum age<input name="ageMin" type="number" defaultValue={event.ageMin} /></label>
        <label>Maximum age<input name="ageMax" type="number" defaultValue={event.ageMax} /></label>
        <label>Organiser<input name="organizer" defaultValue={event.organizer} /></label>
        <label>Contact email<input name="contactEmail" defaultValue={event.contactEmail} /></label>
        <label>Contact phone<input name="contactPhone" defaultValue={event.contactPhone} /></label>
        <label>Instagram URL<input name="instagram" defaultValue={event.instagram} /></label>
        <label className="check"><input type="checkbox" name="rsvpOpen" defaultChecked={event.rsvpOpen} /> RSVP open</label>
        <label className="check"><input type="checkbox" name="paymentEnabled" defaultChecked={event.paymentEnabled} /> Payment enabled</label>
        <label>
          Payment provider
          <select name="paymentProvider" defaultValue={event.paymentProvider}>
            <option value="">Not chosen</option>
            <option value="paystack">Paystack</option>
            <option value="flutterwave">Flutterwave</option>
          </select>
        </label>
        <button className="btn-fill" type="submit" style={{ color: "#0c0b0a" }}>Save event</button>
      </form>
    </div>
  );
}
