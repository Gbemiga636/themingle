export type CheckoutInput = {
  email: string;
  amount: number;
  currency: "NGN";
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, string>;
};

export type CheckoutResult =
  | { ok: true; authorizationUrl: string; reference: string }
  | { ok: false; reason: "disabled" | "not_configured" | "provider_error"; message: string };

export type VerifyResult =
  | { ok: true; status: "paid" | "failed" | "pending"; reference: string; amount: number | null }
  | { ok: false; reason: "not_configured" | "provider_error"; message: string };

export interface PaymentProvider {
  id: "paystack" | "flutterwave";
  label: string;
  isConfigured(): boolean;
  createCheckout(input: CheckoutInput): Promise<CheckoutResult>;
  verify(reference: string): Promise<VerifyResult>;
  refund(reference: string): Promise<{ ok: boolean; message: string }>;
}

function missing(label: string): CheckoutResult {
  return {
    ok: false,
    reason: "not_configured",
    message: `${label} is not configured. Add the secret key on the server before taking payment.`,
  };
}

export const paystack: PaymentProvider = {
  id: "paystack",
  label: "Paystack",
  isConfigured() {
    return Boolean(process.env.PAYSTACK_SECRET_KEY);
  },
  async createCheckout(input) {
    if (!this.isConfigured()) return missing("Paystack");
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
        amount: Math.round(input.amount * 100),
        currency: input.currency,
        reference: input.reference,
        callback_url: input.callbackUrl,
        metadata: input.metadata,
      }),
    });
    const json = (await response.json()) as { status?: boolean; data?: { authorization_url?: string; reference?: string }; message?: string };
    if (!json.status || !json.data?.authorization_url) {
      return { ok: false, reason: "provider_error", message: json.message || "Paystack did not start a checkout." };
    }
    return { ok: true, authorizationUrl: json.data.authorization_url, reference: json.data.reference || input.reference };
  },
  async verify(reference) {
    if (!this.isConfigured()) return { ok: false, reason: "not_configured", message: "Paystack is not configured." };
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    const json = (await response.json()) as { status?: boolean; data?: { status?: string; amount?: number; reference?: string } };
    const state = json.data?.status;
    const status = state === "success" ? "paid" : state === "failed" ? "failed" : "pending";
    return { ok: true, status, reference: json.data?.reference || reference, amount: json.data?.amount ? json.data.amount / 100 : null };
  },
  async refund(reference) {
    if (!this.isConfigured()) return { ok: false, message: "Paystack is not configured." };
    const response = await fetch("https://api.paystack.co/refund", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transaction: reference }),
    });
    const json = (await response.json()) as { status?: boolean; message?: string };
    return { ok: Boolean(json.status), message: json.message || (json.status ? "Refund submitted." : "Refund failed.") };
  },
};

export const flutterwave: PaymentProvider = {
  id: "flutterwave",
  label: "Flutterwave",
  isConfigured() {
    return Boolean(process.env.FLUTTERWAVE_SECRET_KEY);
  },
  async createCheckout(input) {
    if (!this.isConfigured()) return missing("Flutterwave");
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: input.reference,
        amount: input.amount,
        currency: input.currency,
        redirect_url: input.callbackUrl,
        customer: { email: input.email },
        customizations: { title: "The Mingle", description: "Guest place" },
        meta: input.metadata,
      }),
    });
    const json = (await response.json()) as { status?: string; data?: { link?: string }; message?: string };
    if (json.status !== "success" || !json.data?.link) {
      return { ok: false, reason: "provider_error", message: json.message || "Flutterwave did not start a checkout." };
    }
    return { ok: true, authorizationUrl: json.data.link, reference: input.reference };
  },
  async verify(reference) {
    if (!this.isConfigured()) return { ok: false, reason: "not_configured", message: "Flutterwave is not configured." };
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` },
    });
    const json = (await response.json()) as { data?: { status?: string; amount?: number; tx_ref?: string } };
    const state = json.data?.status;
    const status = state === "successful" ? "paid" : state === "failed" ? "failed" : "pending";
    return { ok: true, status, reference: json.data?.tx_ref || reference, amount: json.data?.amount ?? null };
  },
  async refund() {
    return { ok: false, message: "Flutterwave refunds are started from the Flutterwave dashboard until a refund endpoint is switched on." };
  },
};

const providers = { paystack, flutterwave };

export function getPaymentProvider(id: string) {
  if (id === "paystack" || id === "flutterwave") return providers[id];
  return null;
}

export function providerStatus() {
  return [
    { id: "paystack" as const, label: "Paystack", configured: paystack.isConfigured() },
    { id: "flutterwave" as const, label: "Flutterwave", configured: flutterwave.isConfigured() },
  ];
}
