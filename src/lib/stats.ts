import type { Guest, Store } from "@/types/domain";
import { joinGuests, paymentStateOf } from "@/lib/store";

export type Stats = {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  waitlist: number;
  paid: number;
  unpaid: number;
  notRequired: number;
  failed: number;
  refunded: number;
  capacity: number | null;
  remaining: number | null;
  attended: number;
  attendanceRate: number;
  sampleGuests: number;
  gender: { name: string; value: number }[];
  ages: { age: string; value: number }[];
  sources: { name: string; value: number }[];
  trend: { date: string; rsvps: number }[];
  weeks: { week: string; rsvps: number }[];
  tickets: { name: string; value: number }[];
};

function countBy(guests: Guest[], value: (guest: Guest) => string) {
  const map = new Map<string, number>();
  for (const guest of guests) {
    const key = value(guest) || "Unspecified";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function buildStats(store: Store): Stats {
  const guests = joinGuests(store);
  const live = guests.filter((guest) => guest.rsvp.status !== "cancelled");
  const confirmed = guests.filter((guest) => guest.rsvp.status === "confirmed");
  const attended = confirmed.filter((guest) => guest.attendance?.status === "attended").length;
  const states = guests.map((guest) => paymentStateOf(guest, store.event.paymentEnabled));

  const trendMap = new Map<string, number>();
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(now.getDate() - i);
    trendMap.set(day.toISOString().slice(0, 10), 0);
  }
  for (const guest of guests) {
    const key = guest.rsvp.createdAt.slice(0, 10);
    if (trendMap.has(key)) trendMap.set(key, (trendMap.get(key) ?? 0) + 1);
  }

  const weekMap = new Map<string, number>();
  for (const [date, value] of trendMap) {
    const d = new Date(date);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().slice(0, 10);
    weekMap.set(key, (weekMap.get(key) ?? 0) + value);
  }

  const ageMap = new Map<string, number>();
  for (let age = store.event.ageMin; age <= store.event.ageMax; age++) ageMap.set(String(age), 0);
  for (const guest of live) {
    const key = String(guest.attendee.age);
    if (ageMap.has(key)) ageMap.set(key, (ageMap.get(key) ?? 0) + 1);
  }

  const capacity = store.event.capacity;
  const holding = guests.filter((guest) => ["confirmed", "pending", "waitlist"].includes(guest.rsvp.status)).length;

  return {
    total: guests.length,
    confirmed: confirmed.length,
    pending: guests.filter((guest) => guest.rsvp.status === "pending").length,
    cancelled: guests.filter((guest) => guest.rsvp.status === "cancelled").length,
    waitlist: guests.filter((guest) => guest.rsvp.status === "waitlist").length,
    paid: states.filter((state) => state === "paid").length,
    unpaid: states.filter((state) => state === "unpaid" || state === "pending").length,
    notRequired: states.filter((state) => state === "not_required").length,
    failed: states.filter((state) => state === "failed").length,
    refunded: states.filter((state) => state === "refunded").length,
    capacity,
    remaining: capacity ? Math.max(capacity - holding, 0) : null,
    attended,
    attendanceRate: confirmed.length ? Math.round((attended / confirmed.length) * 100) : 0,
    sampleGuests: guests.filter((guest) => guest.attendee.sample).length,
    gender: countBy(live, (guest) => guest.attendee.gender),
    ages: [...ageMap.entries()].map(([age, value]) => ({ age, value })),
    sources: countBy(guests, (guest) => guest.rsvp.source),
    trend: [...trendMap.entries()].map(([date, rsvps]) => ({ date: date.slice(5), rsvps })),
    weeks: [...weekMap.entries()].map(([week, rsvps]) => ({ week: week.slice(5), rsvps })),
    tickets: countBy(guests, (guest) => guest.ticket?.name || "Unset"),
  };
}
