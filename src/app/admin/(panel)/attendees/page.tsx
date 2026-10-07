import { GuestTable } from "@/components/admin/guests";
import { guestRows } from "@/lib/rows";
import { getStore } from "@/lib/store";

export default async function AttendeesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const rows = guestRows(await getStore());
  return (
    <div>
      <div className="admin-top">
        <h1>Attendees</h1>
      </div>
      <GuestTable rows={rows} initialQuery={q || ""} />
    </div>
  );
}
