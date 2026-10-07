import { deleteSessionItem, saveSessionItem } from "@/server/actions";
import { getStore } from "@/lib/store";

export default async function SchedulePage() {
  const sessions = [...(await getStore()).sessions].sort((a, b) => a.sort - b.sort);
  return (
    <div>
      <div className="admin-top"><h1>Schedule</h1></div>
      {sessions.length === 0 ? <div className="empty"><h2>The evening is still blank.</h2><p>Add the shape of the night. Leave the time empty until it is real.</p></div> : null}
      {sessions.map((session) => (
        <form key={session.id} className="panel form" action={saveSessionItem} style={{ marginBottom: "0.8rem" }}>
          <input type="hidden" name="id" value={session.id} />
          <label>Title<input name="title" defaultValue={session.title} /></label>
          <label>Time<input name="time" defaultValue={session.time} placeholder="To be announced" /></label>
          <label>Order<input name="sort" type="number" defaultValue={session.sort} /></label>
          <label>Description<textarea name="description" rows={3} defaultValue={session.description} /></label>
          <div className="row-actions">
            <button type="submit">Save</button>
            <button type="submit" formAction={deleteSessionItem.bind(null, session.id)}>Delete</button>
          </div>
        </form>
      ))}
      <form className="panel form" action={saveSessionItem}>
        <h2>Add a moment</h2>
        <label>Title<input name="title" /></label>
        <label>Time<input name="time" placeholder="Optional" /></label>
        <label>Description<textarea name="description" rows={3} /></label>
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
