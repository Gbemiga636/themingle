import { FieldEditor } from "@/components/admin/field-editor";
import { providerStatus } from "@/lib/payments";
import { formatStamp } from "@/lib/format";
import { clearSampleData, restoreSampleData } from "@/server/actions";
import { getStore } from "@/lib/store";

export default async function SettingsPage() {
  const store = await getStore();
  const providers = providerStatus();
  return (
    <div>
      <div className="admin-top"><h1>Settings</h1></div>
      <section className="panel" style={{ marginBottom: "1rem" }}>
        <h2>RSVP questions</h2>
        <p>Age and consent stay on. Sensitive questions should stay optional.</p>
        <FieldEditor initial={store.fields} />
      </section>
      <section className="panel" style={{ marginBottom: "1rem" }}>
        <h2>Providers</h2>
        <p>Keys are read from the server environment. They are never shown here.</p>
        {providers.map((provider) => (
          <p key={provider.id}>{provider.label}: {provider.configured ? "Configured" : "Not configured"}</p>
        ))}
        <p>Email: {process.env.RESEND_API_KEY ? "Configured" : "Not configured"}</p>
      </section>
      <section className="panel" style={{ marginBottom: "1rem" }}>
        <h2>Demonstration data</h2>
        <p>{store.meta.demo ? "Sample guests are on the list." : "Sample guests are cleared."}</p>
        <div className="row-actions">
          <form action={clearSampleData}><button type="submit">Remove sample guests</button></form>
          <form action={restoreSampleData}><button type="submit">Restore sample guests</button></form>
        </div>
      </section>
      <section className="panel">
        <h2>Activity</h2>
        {store.auditLogs.length === 0 ? <p>No activity yet.</p> : (
          <table>
            <tbody>
              {store.auditLogs.slice(0, 20).map((log) => (
                <tr key={log.id}>
                  <td>{formatStamp(log.createdAt)}</td>
                  <td>{log.actor}</td>
                  <td>{log.action}</td>
                  <td>{log.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
