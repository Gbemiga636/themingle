import { setRsvpStatus } from "@/server/actions";
import { guestRows } from "@/lib/rows";
import { getStore } from "@/lib/store";
import Link from "next/link";

export default async function RsvpsPage() {
  const rows = guestRows(await getStore());
  return (
    <div>
      <div className="admin-top"><h1>RSVPs</h1></div>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr><th>Guest</th><th>Reference</th><th>Status</th><th>When</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.rsvpId}>
                <td><Link href={`/admin/attendees/${row.id}`}>{row.name}</Link></td>
                <td>{row.reference}</td>
                <td>{row.status}</td>
                <td>{row.createdAt.slice(0, 10)}</td>
                <td className="row-actions">
                  <form action={setRsvpStatus.bind(null, row.rsvpId, "confirmed")}><button type="submit">Confirm</button></form>
                  <form action={setRsvpStatus.bind(null, row.rsvpId, "waitlist")}><button type="submit">Waitlist</button></form>
                  <form action={setRsvpStatus.bind(null, row.rsvpId, "cancelled")}><button type="submit">Cancel</button></form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
