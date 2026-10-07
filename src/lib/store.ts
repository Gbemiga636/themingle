import { promises as fs } from "fs";
import path from "path";
import { serverEnv } from "@/lib/env";
import { createSeed } from "@/lib/seed";
import type { Attendance, Attendee, AuditLog, Communication, Guest, Payment, PublicSite, Rsvp, Store } from "@/types/domain";

const filePath = path.join(process.cwd(), "data", "store.json");
const TABLE = "mingle_app";

let queue: Promise<unknown> = Promise.resolve();

function remoteOn() {
  return Boolean(serverEnv("SUPABASE_URL") && serverEnv("SUPABASE_SERVICE_ROLE_KEY"));
}

async function remoteFetch(pathname: string, init?: RequestInit) {
  const response = await fetch(`${serverEnv("SUPABASE_URL")}/rest/v1/${pathname}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: serverEnv("SUPABASE_SERVICE_ROLE_KEY"),
      Authorization: `Bearer ${serverEnv("SUPABASE_SERVICE_ROLE_KEY")}`,
      "Content-Type": "application/json",
      ...(init?.headers as Record<string, string> | undefined),
    },
  });
  return response;
}

function liveStore(local: Store | null): Store {
  const seed = createSeed();
  const now = new Date().toISOString();
  const base: Store = {
    ...seed,
    meta: { demo: false, seededAt: now },
    attendees: [],
    rsvps: [],
    payments: [],
    attendance: [],
    notes: [],
    communications: [],
    auditLogs: [
      {
        id: "log-live",
        actor: "system",
        action: "connect",
        detail: "Supabase is connected. Sample guests were not copied, so the shared free database stays small.",
        createdAt: now,
      },
    ],
  };
  if (!local) return base;
  base.event = local.event;
  base.fields = local.fields;
  base.content = local.content;
  base.sessions = local.sessions;
  base.faqs = local.faqs;
  base.gallery = local.gallery;
  base.sponsors = local.sponsors;
  base.ticketTypes = local.ticketTypes;
  const people = local.attendees.filter((person) => !person.sample);
  const ids = new Set(people.map((person) => person.id));
  const rsvps = local.rsvps.filter((rsvp) => !rsvp.sample && ids.has(rsvp.attendeeId));
  const rsvpIds = new Set(rsvps.map((rsvp) => rsvp.id));
  base.attendees = people;
  base.rsvps = rsvps;
  base.payments = local.payments.filter((payment) => !payment.sample && rsvpIds.has(payment.rsvpId));
  base.attendance = local.attendance.filter((item) => rsvpIds.has(item.rsvpId));
  base.notes = local.notes.filter((note) => ids.has(note.attendeeId));
  base.communications = local.communications.filter((item) => !item.sample);
  return base;
}

async function writeRemote(store: Store) {
  const response = await remoteFetch(`${TABLE}?on_conflict=id`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ id: "main", document: store, updated_at: new Date().toISOString() }),
  });
  if (!response.ok) throw new Error(await response.text());
}

async function readFile(): Promise<Store | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as Store;
  } catch {
    return null;
  }
}

async function writeFile(store: Store) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(store, null, 2), "utf8");
}

async function readLocalOrSeed() {
  const existing = await readFile();
  if (existing) return existing;
  const seed = createSeed();
  await writeFile(seed);
  return seed;
}

export async function getStore(): Promise<Store> {
  if (!remoteOn()) return readLocalOrSeed();
  try {
    const response = await remoteFetch(`${TABLE}?id=eq.main&select=document`);
    if (response.ok) {
      const rows = (await response.json()) as { document: Store }[];
      if (rows[0]?.document) return rows[0].document;
      const fresh = liveStore(await readFile());
      await writeRemote(fresh);
      return fresh;
    }
    const detail = await response.text();
    console.error("Supabase read failed. Using the local store until mingle_app exists.", detail);
  } catch (error) {
    console.error("Supabase could not be reached. Using the local store.", error);
  }
  return readLocalOrSeed();
}

export async function updateStore<T>(mutator: (store: Store) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const store = await getStore();
    const result = await mutator(store);
    if (remoteOn()) {
      try {
        await writeRemote(store);
        return result;
      } catch (error) {
        console.error("Supabase write failed. Saved locally instead.", error);
      }
    }
    await writeFile(store);
    return result;
  });
  queue = run.then(() => undefined, () => undefined);
  return run;
}

export function activeCount(store: Store) {
  return store.rsvps.filter((rsvp) => rsvp.status === "confirmed" || rsvp.status === "pending" || rsvp.status === "waitlist").length;
}

export function roomIsFull(store: Store) {
  if (!store.event.capacity) return false;
  return activeCount(store) >= store.event.capacity;
}

export function getPublicSite(store: Store): PublicSite {
  return {
    event: store.event,
    fields: store.fields,
    content: store.content,
    sessions: [...store.sessions].sort((a, b) => a.sort - b.sort),
    faqs: [...store.faqs].sort((a, b) => a.sort - b.sort),
    gallery: [...store.gallery].sort((a, b) => a.sort - b.sort),
    sponsors: store.sponsors,
    ticketTypes: store.ticketTypes.filter((ticket) => ticket.active),
    rsvpOpen: store.event.rsvpOpen,
    roomFull: roomIsFull(store),
  };
}

export function joinGuests(store: Store): Guest[] {
  return store.rsvps
    .map((rsvp) => {
      const attendee = store.attendees.find((person) => person.id === rsvp.attendeeId);
      if (!attendee) return null;
      const payment = [...store.payments].reverse().find((item) => item.rsvpId === rsvp.id) ?? null;
      const attendance = [...store.attendance].reverse().find((item) => item.rsvpId === rsvp.id) ?? null;
      const ticket = store.ticketTypes.find((item) => item.id === rsvp.ticketTypeId) ?? null;
      return { attendee, rsvp, payment, attendance, ticket };
    })
    .filter((guest): guest is Guest => Boolean(guest))
    .sort((a, b) => (a.rsvp.createdAt < b.rsvp.createdAt ? 1 : -1));
}

export function findGuestByReference(store: Store, reference: string) {
  return joinGuests(store).find((guest) => guest.rsvp.reference.toLowerCase() === reference.toLowerCase()) ?? null;
}

export function findGuestById(store: Store, id: string) {
  return joinGuests(store).find((guest) => guest.attendee.id === id || guest.rsvp.id === id) ?? null;
}

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function makeReference(store: Store) {
  for (let attempt = 0; attempt < 8; attempt++) {
    let reference = "TM-";
    for (let i = 0; i < 6; i++) reference += alphabet[Math.floor(Math.random() * alphabet.length)];
    if (!store.rsvps.some((rsvp) => rsvp.reference === reference)) return reference;
  }
  return `TM-${Date.now().toString(36).toUpperCase()}`;
}

export function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

export function addAudit(store: Store, actor: string, action: string, detail: string) {
  const entry: AuditLog = { id: makeId("log"), actor, action, detail, createdAt: new Date().toISOString() };
  store.auditLogs.unshift(entry);
  store.auditLogs = store.auditLogs.slice(0, 200);
}

export type RsvpInput = {
  fullName: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  relationshipStatus: string;
  profession: string;
  city: string;
  source: string;
  dietary: string;
  interests: string;
  consent: boolean;
};

export function createGuest(store: Store, input: RsvpInput): { ok: true; reference: string } | { ok: false; error: string } {
  if (!store.event.rsvpOpen) return { ok: false, error: "The list is closed for now." };
  if (roomIsFull(store)) return { ok: false, error: "The room is full." };
  const email = input.email.trim().toLowerCase();
  const existing = store.attendees.find((person) => person.email.toLowerCase() === email);
  if (existing) {
    const rsvp = store.rsvps.find((item) => item.attendeeId === existing.id && item.status !== "cancelled");
    if (rsvp) return { ok: false, error: "This email is already on the list." };
  }
  if (input.age < store.event.ageMin || input.age > store.event.ageMax) {
    return { ok: false, error: `The Mingle is for young adults aged ${store.event.ageMin}–${store.event.ageMax}.` };
  }

  const now = new Date().toISOString();
  const attendee: Attendee = {
    id: makeId("att"),
    fullName: input.fullName.trim(),
    email,
    phone: input.phone.trim(),
    age: input.age,
    gender: input.gender,
    relationshipStatus: input.relationshipStatus,
    profession: input.profession.trim(),
    city: input.city.trim(),
    dietary: input.dietary.trim(),
    interests: input.interests.trim(),
    sample: false,
    createdAt: now,
  };
  const ticket = store.ticketTypes.find((item) => item.active) ?? store.ticketTypes[0];
  const rsvp: Rsvp = {
    id: makeId("rsvp"),
    attendeeId: attendee.id,
    reference: makeReference(store),
    status: store.event.paymentEnabled ? "pending" : "confirmed",
    source: input.source,
    consent: input.consent,
    ticketTypeId: ticket?.id ?? "",
    sample: false,
    createdAt: now,
  };
  store.attendees.unshift(attendee);
  store.rsvps.unshift(rsvp);
  if (store.event.paymentEnabled) {
    store.payments.unshift({
      id: makeId("pay"),
      rsvpId: rsvp.id,
      amount: ticket?.price ?? null,
      currency: "NGN",
      status: "pending",
      provider: store.event.paymentProvider,
      providerReference: rsvp.reference,
      sample: false,
      createdAt: now,
    });
  }
  if (!store.attendees.some((person) => person.sample) && !store.rsvps.some((item) => item.sample)) {
    store.meta.demo = false;
  }
  addAudit(store, "guest", "rsvp", `${attendee.fullName} · ${rsvp.reference}`);
  return { ok: true, reference: rsvp.reference };
}

export function paymentStateOf(guest: Guest, paymentEnabled: boolean) {
  if (guest.payment) return guest.payment.status;
  return paymentEnabled ? "unpaid" : "not_required";
}

export function removeSample(store: Store) {
  const sampleAttendees = new Set(store.attendees.filter((person) => person.sample).map((person) => person.id));
  const sampleRsvps = new Set(store.rsvps.filter((rsvp) => rsvp.sample || sampleAttendees.has(rsvp.attendeeId)).map((rsvp) => rsvp.id));
  store.attendees = store.attendees.filter((person) => !person.sample);
  store.rsvps = store.rsvps.filter((rsvp) => !sampleRsvps.has(rsvp.id));
  store.payments = store.payments.filter((payment) => !payment.sample && !sampleRsvps.has(payment.rsvpId));
  store.attendance = store.attendance.filter((item) => !sampleRsvps.has(item.rsvpId));
  store.notes = store.notes.filter((note) => !sampleAttendees.has(note.attendeeId));
  store.communications = store.communications.filter((item) => !item.sample);
  store.meta.demo = false;
}

export function restoreSample(store: Store) {
  const fresh = createSeed();
  const realAttendees = store.attendees.filter((person) => !person.sample);
  const realIds = new Set(realAttendees.map((person) => person.id));
  const realRsvps = store.rsvps.filter((rsvp) => !rsvp.sample && realIds.has(rsvp.attendeeId));
  const realRsvpIds = new Set(realRsvps.map((rsvp) => rsvp.id));
  store.attendees = [...realAttendees, ...fresh.attendees];
  store.rsvps = [...realRsvps, ...fresh.rsvps];
  store.payments = [...store.payments.filter((item) => realRsvpIds.has(item.rsvpId)), ...fresh.payments];
  store.attendance = [...store.attendance.filter((item) => realRsvpIds.has(item.rsvpId)), ...fresh.attendance];
  store.meta.demo = true;
}

export type { Payment, Attendance, Communication };
