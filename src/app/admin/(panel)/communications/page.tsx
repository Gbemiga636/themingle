import { saveMessage } from "@/server/actions";
import { formatStamp } from "@/lib/format";
import { getStore } from "@/lib/store";

export default async function CommunicationsPage() {
  const store = await getStore();
  return (
    <div>
      <div className="admin-top"><h1>Communications</h1></div>
      <div className="banner">Email, WhatsApp and SMS are not connected. Messages are saved so the history is ready when a provider is. Nothing is sent.</div>
      <form className="panel form" action={saveMessage}>
        <label>
          Channel
          <select name="channel" defaultValue="email">
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="sms">SMS</option>
          </select>
        </label>
        <label>Subject<input name="subject" defaultValue="The Mingle" /></label>
        <label>Message<textarea name="body" rows={4} placeholder="A note for the list" /></label>
        <button className="btn-fill" type="submit" style={{ color: "#0c0b0a" }}>Save announcement</button>
      </form>
      {store.communications.length === 0 ? (
        <div className="empty"><h2>No messages yet.</h2><p>When you write to the room, the history will live here.</p></div>
      ) : (
        <table>
          <thead><tr><th>When</th><th>Channel</th><th>Subject</th><th>Status</th></tr></thead>
          <tbody>
            {store.communications.map((item) => (
              <tr key={item.id}>
                <td>{formatStamp(item.createdAt)}</td>
                <td>{item.channel}</td>
                <td>{item.subject}<div style={{ color: "#6d655c" }}>{item.body}</div></td>
                <td>{item.status === "not_connected" ? "Not sent" : item.status}{item.sample ? " · sample" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
