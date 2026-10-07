import { AgeChart, SourceChart, TrendChart } from "@/components/admin/charts";
import { buildStats } from "@/lib/stats";
import { getStore } from "@/lib/store";

export default async function AnalyticsPage() {
  const store = await getStore();
  const stats = buildStats(store);
  const holding = stats.confirmed + stats.pending + stats.waitlist;
  const conversion = stats.total ? Math.round((stats.confirmed / stats.total) * 100) : 0;
  return (
    <div>
      <div className="admin-top"><h1>Analytics</h1></div>
      <div className="stats">
        <article className="stat"><b>{conversion}%</b><span>Confirmed rate</span></article>
        <article className="stat"><b>{stats.attendanceRate}%</b><span>Attendance of confirmed</span></article>
        <article className="stat"><b>{stats.cancelled}</b><span>Cancelled</span></article>
        <article className="stat"><b>{stats.capacity ? `${holding}/${stats.capacity}` : "Not set"}</b><span>Capacity</span></article>
      </div>
      <div style={{ display: "grid", gap: "0.8rem", marginTop: "0.8rem" }}>
        <TrendChart data={stats.trend} />
        <div className="panel">
          <p className="eyebrow">By week</p>
          <table>
            <tbody>
              {stats.weeks.map((week) => (
                <tr key={week.week}><td>{week.week}</td><td>{week.rsvps}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin-split even">
          <AgeChart data={stats.ages} />
          <SourceChart data={stats.sources} />
        </div>
        <div className="panel">
          <p className="eyebrow">Tickets</p>
          {stats.tickets.map((ticket) => (
            <p key={ticket.name}>{ticket.name} · {ticket.value}</p>
          ))}
          <p>Revenue {store.event.paymentEnabled ? "follows connected payments." : "is not being collected."} Failed {stats.failed}. Refunded {stats.refunded}.</p>
        </div>
      </div>
    </div>
  );
}
