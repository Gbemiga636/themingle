import { findGuestByReference, getStore } from "@/lib/store";

function stamp(value: string) {
  return value.replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
}

export async function GET(_request: Request, context: { params: Promise<{ ref: string }> }) {
  const { ref } = await context.params;
  const store = await getStore();
  const guest = findGuestByReference(store, ref);
  if (!guest) return new Response("Not found", { status: 404 });
  if (!store.event.date) return new Response("The date has not been announced.", { status: 409 });
  const start = store.event.time ? `${store.event.date.replaceAll("-", "")}T${store.event.time.replace(":", "")}00` : store.event.date.replaceAll("-", "");
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The Mingle//EN",
    "BEGIN:VEVENT",
    `UID:${guest.rsvp.reference}@themingle`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    store.event.time ? `DTSTART:${start}` : `DTSTART;VALUE=DATE:${start}`,
    "SUMMARY:The Mingle",
    "DESCRIPTION:Are you ready to mingle?",
    `LOCATION:${store.event.venue || "Venue to be announced"}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename=${guest.rsvp.reference}.ics`,
    },
  });
}
