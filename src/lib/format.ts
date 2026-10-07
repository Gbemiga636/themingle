export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function formatWhen(date: string, time: string) {
  if (!date && !time) return "Date to be announced";
  if (!date) return time;
  const parsed = new Date(`${date}T${time || "00:00"}`);
  if (Number.isNaN(parsed.getTime())) return "Date to be announced";
  const formatted = new Intl.DateTimeFormat("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(parsed);
  return time ? `${formatted} · ${time}` : formatted;
}

export function formatVenue(venue: string, city: string) {
  const place = [venue, city].filter(Boolean).join(", ");
  return place || "Venue to be announced";
}

export function formatMoney(amount: number | null, currency = "NGN") {
  if (amount === null || Number.isNaN(amount)) return "Not set";
  return new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatStamp(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(date);
}

export function paymentLabel(status: string) {
  const labels: Record<string, string> = {
    not_required: "Not required",
    unpaid: "Unpaid",
    pending: "Pending",
    paid: "Paid",
    failed: "Failed",
    refunded: "Refunded",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    waitlist: "Waitlist",
  };
  return labels[status] ?? status;
}
