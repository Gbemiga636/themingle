import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { addAudit, makeId, updateStore } from "@/lib/store";

export async function POST(request: Request) {
  const secret = process.env.FLUTTERWAVE_HASH;
  if (!secret || !process.env.FLUTTERWAVE_SECRET_KEY) {
    return NextResponse.json({ error: "Flutterwave is not configured." }, { status: 501 });
  }
  const signature = request.headers.get("verif-hash") || "";
  const left = Buffer.from(signature);
  const right = Buffer.from(secret);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }
  const event = (await request.json()) as { data?: { status?: string; tx_ref?: string; amount?: number } };
  const reference = event.data?.tx_ref;
  if (event.data?.status === "successful" && reference) {
    await updateStore((store) => {
      const rsvp = store.rsvps.find((item) => item.reference === reference);
      if (rsvp) rsvp.status = "confirmed";
      const payment = store.payments.find((item) => item.providerReference === reference);
      if (payment) {
        payment.status = "paid";
        payment.provider = "flutterwave";
        payment.amount = event.data?.amount ?? payment.amount;
      } else if (rsvp) {
        store.payments.unshift({
          id: makeId("pay"),
          rsvpId: rsvp.id,
          amount: event.data?.amount ?? null,
          currency: "NGN",
          status: "paid",
          provider: "flutterwave",
          providerReference: reference,
          sample: false,
          createdAt: new Date().toISOString(),
        });
      }
      addAudit(store, "flutterwave", "payment", `Paid ${reference}`);
    });
  }
  return NextResponse.json({ received: true });
}
