import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { buildRsvpSchema } from "@/lib/validators";
import { createGuest, getStore, updateStore } from "@/lib/store";
import { rateLimit } from "@/lib/rate-limit";
import { getPaymentProvider } from "@/lib/payments";
import { siteUrl } from "@/lib/format";

export async function POST(request: Request) {
  const headerList = await headers();
  const origin = headerList.get("origin");
  const host = headerList.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return NextResponse.json({ error: "Rejected." }, { status: 403 });
    } catch {
      return NextResponse.json({ error: "Rejected." }, { status: 403 });
    }
  }
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(`rsvp:${ip}`, 8, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const current = await getStore();
  const parsed = buildRsvpSchema(current.fields, current.event.ageMin, current.event.ageMax).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Check the form." }, { status: 400 });
  }
  if (parsed.data.company) return NextResponse.json({ error: "Could not save this RSVP." }, { status: 400 });

  const { company: _company, ...input } = parsed.data;
  const result = await updateStore((store) => createGuest(store, input));
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  const fresh = await getStore();
  const ticket = fresh.ticketTypes.find((item) => item.active && item.price);
  const provider = getPaymentProvider(fresh.event.paymentProvider);
  if (fresh.event.paymentEnabled && provider?.isConfigured() && ticket?.price) {
    const checkout = await provider.createCheckout({
      email: input.email,
      amount: ticket.price,
      currency: "NGN",
      reference: result.reference,
      callbackUrl: `${siteUrl()}/rsvp/confirmation/${result.reference}`,
    });
    if (checkout.ok) return NextResponse.json({ reference: result.reference, paymentUrl: checkout.authorizationUrl });
  }

  return NextResponse.json({ reference: result.reference });
}
