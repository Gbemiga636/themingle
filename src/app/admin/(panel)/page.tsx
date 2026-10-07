import { AgeChart, SourceChart, TrendChart } from "@/components/admin/charts";
import { buildStats } from "@/lib/stats";
import { getStore } from "@/lib/store";

export default async function OverviewPage() {
  const store = await getStore();
  const stats = buildStats(store);
  const cards = [
    ["Total RSVPs", stats.total],
    ["Confirmed", stats.confirmed],
    ["Pending", stats.pending],
    ["Paid", stats.paid],
    ["Unpaid", stats.unpaid],
    ["Capacity", stats.capacity ?? "Not set"],
    ["Remaining", stats.remaining ?? "Not set"],
    ["Attendance", `${stats.attendanceRate}%`],
  ];
  return (
    <div>
      {store.meta.demo ? (
        <div className="banner">Demonstration data is loaded. These guests are not real. Clear them in Settings when you are ready for the live list.</div>
      ) : null}
      {!store.event.paymentEnabled ? (
        <div className="banner">Payments are turned off. RSVP works on its own. Paid and unpaid counts use sample records where they exist, and no provider is charging anyone.</div>
      ) : null}
      <div className="admin-top">
        <h1>Overview</h1>
      </div>
      <div className="stats">
        {cards.map(([label, value]) => (
          <article className="stat" key={label}>
            <b>{value}</b>
            <span>{label}</span>
          </article>
        ))}
      </div>
      <div className="stats" style={{ marginTop: "0.8rem" }}>
        {stats.gender.map((item) => (
          <article className="stat" key={item.name}>
            <b>{item.value}</b>
            <span>{item.name}</span>
          </article>
        ))}
      </div>
      <div className="admin-split">
        <TrendChart data={stats.trend} />
        <SourceChart data={stats.sources} />
      </div>
      <div style={{ marginTop: "0.8rem" }}>
        <AgeChart data={stats.ages} />
      </div>
    </div>
  );
}
