"use server";

import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { clearSession, readSession, setSession, verifyAdmin } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { addAudit, getStore, makeId, removeSample, restoreSample, updateStore } from "@/lib/store";
import type { FieldConfig, PaymentProviderId, RsvpStatus, SiteContent } from "@/types/domain";

async function actor() {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  return session;
}

function touch() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/rsvp");
}

export async function loginAction(formData: FormData) {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(`login:${ip}`, 8, 15 * 60 * 1000).ok) return { error: "Too many attempts. Wait a few minutes." };
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  if (!verifyAdmin(email, password)) return { error: "Those details are not recognised." };
  await setSession(email.trim().toLowerCase());
  redirect("/admin");
}

export async function logoutAction() {
  await clearSession();
  redirect("/admin/login");
}

export async function updateEvent(formData: FormData) {
  const session = await actor();
  await updateStore((store) => {
    const capacity = String(formData.get("capacity") || "").trim();
    store.event = {
      ...store.event,
      name: String(formData.get("name") || "The Mingle"),
      date: String(formData.get("date") || ""),
      time: String(formData.get("time") || ""),
      venue: String(formData.get("venue") || ""),
      address: String(formData.get("address") || ""),
      city: String(formData.get("city") || ""),
      description: String(formData.get("description") || ""),
      capacity: capacity ? Number(capacity) : null,
      ageMin: Number(formData.get("ageMin") || 21),
      ageMax: Number(formData.get("ageMax") || 35),
      rsvpOpen: formData.get("rsvpOpen") === "on",
      paymentEnabled: formData.get("paymentEnabled") === "on",
      paymentProvider: String(formData.get("paymentProvider") || "") as PaymentProviderId,
      contactEmail: String(formData.get("contactEmail") || ""),
      contactPhone: String(formData.get("contactPhone") || ""),
      instagram: String(formData.get("instagram") || ""),
      organizer: String(formData.get("organizer") || ""),
    };
    addAudit(store, session.email, "event", "Updated event settings");
  });
  touch();
}

export async function saveContent(content: SiteContent) {
  const session = await actor();
  await updateStore((store) => {
    store.content = content;
    addAudit(store, session.email, "content", "Updated site content");
  });
  touch();
}

export async function saveFields(fields: FieldConfig[]) {
  const session = await actor();
  await updateStore((store) => {
    store.fields = fields;
    addAudit(store, session.email, "fields", "Updated RSVP questions");
  });
  touch();
}

export async function saveSessionItem(formData: FormData) {
  const session = await actor();
  await updateStore((store) => {
    const id = String(formData.get("id") || "");
    const item = {
      id: id || makeId("ses"),
      title: String(formData.get("title") || "Untitled"),
      description: String(formData.get("description") || ""),
      time: String(formData.get("time") || ""),
      sort: Number(formData.get("sort") || store.sessions.length + 1),
    };
    const index = store.sessions.findIndex((entry) => entry.id === id);
    if (index >= 0) store.sessions[index] = item;
    else store.sessions.push(item);
    addAudit(store, session.email, "schedule", item.title);
  });
  touch();
}

export async function deleteSessionItem(id: string) {
  const session = await actor();
  await updateStore((store) => {
    store.sessions = store.sessions.filter((item) => item.id !== id);
    addAudit(store, session.email, "schedule", `Removed ${id}`);
  });
  touch();
}

export async function saveFaqItem(formData: FormData) {
  const session = await actor();
  await updateStore((store) => {
    const id = String(formData.get("id") || "");
    const item = {
      id: id || makeId("faq"),
      question: String(formData.get("question") || "Question"),
      answer: String(formData.get("answer") || ""),
      sort: Number(formData.get("sort") || store.faqs.length + 1),
    };
    const index = store.faqs.findIndex((entry) => entry.id === id);
    if (index >= 0) store.faqs[index] = item;
    else store.faqs.push(item);
    addAudit(store, session.email, "faq", item.question);
  });
  touch();
}

export async function deleteFaqItem(id: string) {
  const session = await actor();
  await updateStore((store) => {
    store.faqs = store.faqs.filter((item) => item.id !== id);
    addAudit(store, session.email, "faq", `Removed ${id}`);
  });
  touch();
}

export async function addGalleryUrl(formData: FormData) {
  const session = await actor();
  await updateStore((store) => {
    store.gallery.push({
      id: makeId("gal"),
      src: String(formData.get("src") || ""),
      alt: String(formData.get("alt") || "Photograph"),
      caption: String(formData.get("caption") || ""),
      credit: String(formData.get("credit") || ""),
      sort: store.gallery.length + 1,
    });
    addAudit(store, session.email, "gallery", "Added an image");
  });
  touch();
}

export async function uploadGallery(formData: FormData) {
  const session = await actor();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;
  if (!file.type.startsWith("image/") || file.size > 6_000_000) return;
  const ext = file.type.includes("png") ? "png" : file.type.includes("webp") ? "webp" : "jpg";
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
  const directory = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, name), Buffer.from(await file.arrayBuffer()));
  await updateStore((store) => {
    store.gallery.push({
      id: makeId("gal"),
      src: `/uploads/${name}`,
      alt: String(formData.get("alt") || "Uploaded photograph"),
      caption: String(formData.get("caption") || "New photograph"),
      credit: "The Mingle",
      sort: store.gallery.length + 1,
    });
    addAudit(store, session.email, "gallery", `Uploaded ${name}`);
  });
  touch();
}

export async function deleteGalleryItem(id: string) {
  const session = await actor();
  await updateStore((store) => {
    store.gallery = store.gallery.filter((item) => item.id !== id);
    addAudit(store, session.email, "gallery", `Removed ${id}`);
  });
  touch();
}

export async function moveGalleryItem(id: string, direction: -1 | 1) {
  const session = await actor();
  await updateStore((store) => {
    const ordered = [...store.gallery].sort((a, b) => a.sort - b.sort);
    const index = ordered.findIndex((item) => item.id === id);
    const swap = index + direction;
    if (index < 0 || swap < 0 || swap >= ordered.length) return;
    const current = ordered[index];
    const other = ordered[swap];
    if (!current || !other) return;
    const sort = current.sort;
    current.sort = other.sort;
    other.sort = sort;
    store.gallery = ordered;
    addAudit(store, session.email, "gallery", "Reordered images");
  });
  touch();
}

export async function saveTicket(formData: FormData) {
  const session = await actor();
  await updateStore((store) => {
    const id = String(formData.get("id") || "");
    const price = String(formData.get("price") || "").trim();
    const limit = String(formData.get("limit") || "").trim();
    const item = {
      id: id || makeId("ticket"),
      name: String(formData.get("name") || "Guest"),
      description: String(formData.get("description") || ""),
      price: price ? Number(price) : null,
      currency: "NGN" as const,
      limit: limit ? Number(limit) : null,
      active: formData.get("active") === "on",
    };
    const index = store.ticketTypes.findIndex((entry) => entry.id === id);
    if (index >= 0) store.ticketTypes[index] = item;
    else store.ticketTypes.push(item);
    addAudit(store, session.email, "ticket", item.name);
  });
  touch();
}

export async function setRsvpStatus(id: string, status: RsvpStatus) {
  const session = await actor();
  await updateStore((store) => {
    const rsvp = store.rsvps.find((item) => item.id === id);
    if (!rsvp) return;
    rsvp.status = status;
    addAudit(store, session.email, "rsvp", `${rsvp.reference} → ${status}`);
  });
  touch();
}

export async function updateAttendee(formData: FormData) {
  const session = await actor();
  const id = String(formData.get("id") || "");
  await updateStore((store) => {
    const attendee = store.attendees.find((item) => item.id === id);
    if (!attendee) return;
    attendee.fullName = String(formData.get("fullName") || attendee.fullName);
    attendee.email = String(formData.get("email") || attendee.email);
    attendee.phone = String(formData.get("phone") || "");
    attendee.age = Number(formData.get("age") || attendee.age);
    attendee.gender = String(formData.get("gender") || "");
    attendee.relationshipStatus = String(formData.get("relationshipStatus") || "");
    attendee.profession = String(formData.get("profession") || "");
    attendee.city = String(formData.get("city") || "");
    attendee.dietary = String(formData.get("dietary") || "");
    attendee.interests = String(formData.get("interests") || "");
    const status = String(formData.get("status") || "") as RsvpStatus;
    const rsvp = store.rsvps.find((item) => item.attendeeId === id);
    if (rsvp && status) rsvp.status = status;
    addAudit(store, session.email, "attendee", `Edited ${attendee.fullName}`);
  });
  touch();
  redirect(`/admin/attendees/${id}`);
}

export async function deleteAttendee(id: string) {
  const session = await actor();
  await updateStore((store) => {
    const rsvpIds = new Set(store.rsvps.filter((item) => item.attendeeId === id).map((item) => item.id));
    const name = store.attendees.find((item) => item.id === id)?.fullName || id;
    store.attendees = store.attendees.filter((item) => item.id !== id);
    store.rsvps = store.rsvps.filter((item) => item.attendeeId !== id);
    store.payments = store.payments.filter((item) => !rsvpIds.has(item.rsvpId));
    store.attendance = store.attendance.filter((item) => !rsvpIds.has(item.rsvpId));
    store.notes = store.notes.filter((item) => item.attendeeId !== id);
    addAudit(store, session.email, "attendee", `Deleted ${name}`);
  });
  touch();
  redirect("/admin/attendees");
}

export async function markAttended(rsvpId: string, status: "attended" | "no_show") {
  const session = await actor();
  await updateStore((store) => {
    store.attendance = store.attendance.filter((item) => item.rsvpId !== rsvpId);
    store.attendance.unshift({ id: makeId("atd"), rsvpId, status, markedAt: new Date().toISOString() });
    addAudit(store, session.email, "attendance", `${rsvpId} ${status}`);
  });
  touch();
}

export async function addNote(formData: FormData) {
  const session = await actor();
  const attendeeId = String(formData.get("attendeeId") || "");
  await updateStore((store) => {
    store.notes.unshift({
      id: makeId("note"),
      attendeeId,
      body: String(formData.get("body") || "").slice(0, 2000),
      author: session.email,
      createdAt: new Date().toISOString(),
    });
    addAudit(store, session.email, "note", `Note on ${attendeeId}`);
  });
  touch();
}

export async function saveMessage(formData: FormData) {
  const session = await actor();
  await updateStore((store) => {
    store.communications.unshift({
      id: makeId("com"),
      attendeeId: String(formData.get("attendeeId") || "") || null,
      channel: (String(formData.get("channel") || "email") as "email" | "whatsapp" | "sms"),
      subject: String(formData.get("subject") || "The Mingle"),
      body: String(formData.get("body") || ""),
      status: "not_connected",
      sample: false,
      createdAt: new Date().toISOString(),
    });
    addAudit(store, session.email, "message", "Saved a message. Delivery is not connected.");
  });
  touch();
}

export async function clearSampleData() {
  const session = await actor();
  await updateStore((store) => {
    removeSample(store);
    addAudit(store, session.email, "demo", "Removed demonstration guests");
  });
  touch();
}

export async function restoreSampleData() {
  const session = await actor();
  await updateStore((store) => {
    restoreSample(store);
    addAudit(store, session.email, "demo", "Restored demonstration guests");
  });
  touch();
}

export async function ensureStore() {
  await getStore();
}
