import type { PublicSite } from "@/types/domain";

export function Schedule({ site }: { site: PublicSite }) {
  return (
    <section className="section schedule" id="schedule">
      <p className="eyebrow">The shape of the evening</p>
      <h2 className="display">What to expect.</h2>
      {site.sessions.length === 0 ? <p>The evening will be announced.</p> : null}
      {site.sessions.map((session, index) => (
        <article className="session" key={session.id}>
          <p className="time">{session.time || "Time to be announced"}</p>
          <div>
            <strong>
              {String(index + 1).padStart(2, "0")} — {session.title}
            </strong>
            <p>{session.description}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
