import { providerStatus } from "@/lib/payments";
import { formatMoney, formatStamp, paymentLabel } from "@/lib/format";
import { getStore, joinGuests } from "@/lib/store";
import { saveTicket, updateEvent } from "@/server/actions";

export default async function PaymentsPage() {
  const store = await getStore();
  const providers = providerStatus();
  const guests = joinGuests(store);
  const real = store.payments.filter((payment) => !payment.sample);
  const sample = store.payments.filter((payment) => payment.sample);
  return (
    <div>
      <div className="admin-top"><h1>Payments</h1></div>
      <div className="banner">
        No payment provider is taking money unless a secret key is configured on the server. Sample rows below are layout data, not charges.
        Paystack: {providers.find((item) => item.id === "paystack")?.configured ? "configured" : "not configured"}.
        Flutterwave: {providers.find((item) => item.id === "flutterwave")?.configured ? "configured" : "not configured"}.
      </div>
      <form className="panel form" action={updateEvent} style={{ marginBottom: "1rem" }}>
        <input type="hidden" name="name" value={store.event.name} />
        <input type="hidden" name="description" value={store.event.description} />
        <input type="hidden" name="date" value={store.event.date} />
        <input type="hidden" name="time" value={store.event.time} />
        <input type="hidden" name="venue" value={store.event.venue} />
        <input type="hidden" name="address" value={store.event.address} />
        <input type="hidden" name="city" value={store.event.city} />
        <input type="hidden" name="capacity" value={store.event.capacity ?? ""} />
        <input type="hidden" name="ageMin" value={store.event.ageMin} />
        <input type="hidden" name="ageMax" value={store.event.ageMax} />
        <input type="hidden" name="contactEmail" value={store.event.contactEmail} />
        <input type="hidden" name="contactPhone" value={store.event.contactPhone} />
        <input type="hidden" name="instagram" value={store.event.instagram} />
        <input type="hidden" name="organizer" value={store.event.organizer} />
        {store.event.rsvpOpen ? <input type="hidden" name="rsvpOpen" value="on" /> : null}
        <label className="check"><input type="checkbox" name="paymentEnabled" defaultChecked={store.event.paymentEnabled} /> Payment enabled</label>
        <label>
          Provider
          <select name="paymentProvider" defaultValue={store.event.paymentProvider}>
            <option value="">Choose later</option>
            <option value="paystack">Paystack</option>
            <option value="flutterwave">Flutterwave</option>
          </select>
        </label>
        <button className="btn-fill" type="submit" style={{ color: "#0c0b0a" }}>Save payment settings</button>
      </form>
      <h2>Ticket types</h2>
      {store.ticketTypes.map((ticket) => (
        <form key={ticket.id} className="panel form" action={saveTicket} style={{ marginBottom: "0.8rem" }}>
          <input type="hidden" name="id" value={ticket.id} />
          <label>Name<input name="name" defaultValue={ticket.name} /></label>
          <label>Description<input name="description" defaultValue={ticket.description} /></label>
          <label>Price in NGN, blank if not set<input name="price" defaultValue={ticket.price ?? ""} placeholder="Not set" /></label>
          <label>Limit<input name="limit" defaultValue={ticket.limit ?? ""} /></label>
          <label className="check"><input type="checkbox" name="active" defaultChecked={ticket.active} /> Active</label>
          <button type="submit">Save ticket</button>
        </form>
      ))}
      <form className="panel form" action={saveTicket}>
        <h2>New ticket</h2>
        <label>Name<input name="name" placeholder="Guest" /></label>
        <label>Price<input name="price" placeholder="Leave blank until you set one" /></label>
        <label className="check"><input type="checkbox" name="active" defaultChecked /> Active</label>
        <button type="submit">Add ticket</button>
      </form>
      <h2 style={{ marginTop: "1.5rem" }}>Transactions</h2>
      {real.length === 0 ? (
        <div className="empty">
          <h2>No payments yet.</h2>
          <p>When a provider is connected and a price is set, successful, pending and failed payments will appear here.</p>
        </div>
      ) : (
        <PaymentTable payments={real} guests={guests} />
      )}
      {sample.length ? (
        <>
          <h2>Sample rows</h2>
          <p>Amounts are intentionally unset. These statuses show how the desk will read once payments exist.</p>
          <PaymentTable payments={sample} guests={guests} />
        </>
      ) : null}
    </div>
  );
}

function PaymentTable({ payments, guests }: { payments: Awaited<ReturnType<typeof getStore>>["payments"]; guests: ReturnType<typeof joinGuests> }) {
  return (
    <table>
      <thead><tr><th>Guest</th><th>Status</th><th>Amount</th><th>Provider</th><th>When</th></tr></thead>
      <tbody>
        {payments.map((payment) => {
          const guest = guests.find((item) => item.rsvp.id === payment.rsvpId);
          return (
            <tr key={payment.id}>
              <td>{guest?.attendee.fullName || "—"}</td>
              <td>{paymentLabel(payment.status)}</td>
              <td>{formatMoney(payment.amount)}</td>
              <td>{payment.provider || "—"}</td>
              <td>{formatStamp(payment.createdAt)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
