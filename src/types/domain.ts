export type RsvpStatus = "pending" | "confirmed" | "cancelled" | "waitlist";
export type PaymentState = "not_required" | "unpaid" | "pending" | "paid" | "failed" | "refunded";
export type PaymentProviderId = "paystack" | "flutterwave" | "";
export type FieldType = "text" | "email" | "tel" | "number" | "select" | "textarea";

export type FieldConfig = {
  key: string;
  label: string;
  type: FieldType;
  enabled: boolean;
  required: boolean;
  sensitive: boolean;
  options?: string[];
  placeholder?: string;
};

export type EventSettings = {
  name: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  city: string;
  description: string;
  capacity: number | null;
  ageMin: number;
  ageMax: number;
  rsvpOpen: boolean;
  paymentEnabled: boolean;
  paymentProvider: PaymentProviderId;
  currency: "NGN";
  contactEmail: string;
  contactPhone: string;
  instagram: string;
  organizer: string;
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  headline: string;
  kicker: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  image: string;
  video: string;
};

export type AboutContent = {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  secondaryImage: string;
};

export type MatterWord = { word: string; copy: string };

export type MattersContent = {
  eyebrow: string;
  title: string;
  intro: string;
  words: MatterWord[];
};

export type ExperienceItem = {
  id: string;
  index: string;
  title: string;
  summary: string;
  body: string;
  image: string;
};

export type PlayContent = { title: string; words: string[] };

export type MingleContent = {
  eyebrow: string;
  title: string;
  lines: string[];
  reveal: string;
};

export type FinaleContent = {
  title: string;
  primaryCta: string;
  secondaryCta: string;
  image: string;
};

export type SiteContent = {
  hero: HeroContent;
  about: AboutContent;
  matters: MattersContent;
  experiences: ExperienceItem[];
  play: PlayContent;
  mingle: MingleContent;
  finale: FinaleContent;
};

export type Session = {
  id: string;
  title: string;
  description: string;
  time: string;
  sort: number;
};

export type Faq = { id: string; question: string; answer: string; sort: number };

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  credit: string;
  sort: number;
};

export type Sponsor = { id: string; name: string; url: string; logo: string };

export type TicketType = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  currency: "NGN";
  limit: number | null;
  active: boolean;
};

export type Attendee = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  relationshipStatus: string;
  profession: string;
  city: string;
  dietary: string;
  interests: string;
  sample: boolean;
  createdAt: string;
};

export type Rsvp = {
  id: string;
  attendeeId: string;
  reference: string;
  status: RsvpStatus;
  source: string;
  consent: boolean;
  ticketTypeId: string;
  sample: boolean;
  createdAt: string;
};

export type Payment = {
  id: string;
  rsvpId: string;
  amount: number | null;
  currency: "NGN";
  status: Exclude<PaymentState, "not_required" | "unpaid">;
  provider: PaymentProviderId;
  providerReference: string;
  sample: boolean;
  createdAt: string;
};

export type Attendance = {
  id: string;
  rsvpId: string;
  status: "attended" | "no_show";
  markedAt: string;
};

export type AdminNote = {
  id: string;
  attendeeId: string;
  body: string;
  author: string;
  createdAt: string;
};

export type Communication = {
  id: string;
  attendeeId: string | null;
  channel: "email" | "whatsapp" | "sms";
  subject: string;
  body: string;
  status: "saved" | "not_connected";
  sample: boolean;
  createdAt: string;
};

export type AuditLog = {
  id: string;
  actor: string;
  action: string;
  detail: string;
  createdAt: string;
};

export type Store = {
  meta: { demo: boolean; seededAt: string };
  event: EventSettings;
  fields: FieldConfig[];
  content: SiteContent;
  sessions: Session[];
  faqs: Faq[];
  gallery: GalleryItem[];
  sponsors: Sponsor[];
  ticketTypes: TicketType[];
  attendees: Attendee[];
  rsvps: Rsvp[];
  payments: Payment[];
  attendance: Attendance[];
  notes: AdminNote[];
  communications: Communication[];
  auditLogs: AuditLog[];
};

export type Guest = {
  attendee: Attendee;
  rsvp: Rsvp;
  payment: Payment | null;
  attendance: Attendance | null;
  ticket: TicketType | null;
};

export type PublicSite = {
  event: EventSettings;
  fields: FieldConfig[];
  content: SiteContent;
  sessions: Session[];
  faqs: Faq[];
  gallery: GalleryItem[];
  sponsors: Sponsor[];
  ticketTypes: TicketType[];
  rsvpOpen: boolean;
  roomFull: boolean;
};
