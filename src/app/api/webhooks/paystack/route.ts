import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { serverEnv } from "@/lib/env";
import { addAudit, makeId, updateStore } from "@/lib/store";

export async function POST(request: Request) {
  const secret = serverEnv("PAYSTACK_SECRET_KEY");
  if (!secret) return NextResponse.json({ error: "Paystack is not configured." }, { status: 501 });
  const raw = await request.text();
  const signature = request.headers.get("x-paystack-signature") || "";
  const hash = createHmac("sha512", secret).update(raw).digest("hex");
  const left = Buffer.from(hash);
  const right = Buffer.from(signature);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }
  const event = JSON.parse(raw) as { event?: string; data?: { reference?: string; amount?: number; status?: string } };
  const reference = event.data?.reference;
  if (event.event === "charge.success" && reference) {
    await updateStore((store) => {
      const rsvp = store.rsvps.find((item) => item.reference === reference);
      const payment = store.payments.find((item) => item.providerReference === reference || item.rsvpId === rsvp?.id);
      if (rsvp) rsvp.status = "confirmed";
      if (payment) {
        payment.status = "paid";
        payment.provider = "paystack";
        payment.amount = event.data?.amount ? event.data.amount / 100 : payment.amount;
      } else if (rsvp) {
        store.payments.unshift({
          id: makeId("pay"),
          rsvpId: rsvp.id,
          amount: event.data?.amount ? event.data.amount / 100 : null,
          currency: "NGN",
          status: "paid",
          provider: "paystack",
          providerReference: reference,
          sample: false,
          createdAt: new Date().toISOString(),
        });
      }
      addAudit(store, "paystack", "payment", `Paid ${reference}`);
    });
  }
  return NextResponse.json({ received: true });
}
