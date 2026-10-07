import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { guestRows } from "@/lib/rows";
import { getStore } from "@/lib/store";

export async function GET() {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const rows = guestRows(await getStore());
  const headers = ["Name", "Email", "Phone", "Age", "Gender", "Relationship", "City", "RSVP", "Payment", "Source", "Ticket", "Registered", "Reference", "Sample"];
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      [row.name, row.email, row.phone, row.age, row.gender, row.relationship, row.city, row.status, row.payment, row.source, row.ticket, row.createdAt, row.reference, row.sample ? "yes" : "no"]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(","),
    ),
  ];
  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=the-mingle-guests.csv",
    },
  });
}
