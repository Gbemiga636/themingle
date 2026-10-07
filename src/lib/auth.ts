import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "mingle_admin";
const DAY = 60 * 60 * 14;

export type Session = { email: string; role: "owner"; exp: number };

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "dev-only-insecure-secret";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function expectedAdmin() {
  const email = process.env.ADMIN_EMAIL || (process.env.NODE_ENV === "production" ? "" : "admin@themingle.local");
  const password = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "mingle-admin");
  if (!email || !password) return null;
  return { email, password };
}

export function verifyAdmin(email: string, password: string) {
  const expected = expectedAdmin();
  if (!expected) return false;
  const emailOk = email.trim().toLowerCase() === expected.email.toLowerCase();
  const a = Buffer.from(password);
  const b = Buffer.from(expected.password);
  const lengthOk = a.length === b.length;
  const passwordOk = lengthOk && timingSafeEqual(a, b);
  return emailOk && passwordOk;
}

export async function setSession(email: string) {
  const exp = Date.now() + DAY * 1000;
  const payload = Buffer.from(JSON.stringify({ email, role: "owner", exp } satisfies Session)).toString("base64url");
  const token = `${payload}.${sign(payload)}`;
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DAY,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function readSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Session;
    if (!session.exp || session.exp < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  return session;
}
