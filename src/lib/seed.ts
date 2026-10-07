import type {
  Attendee,
  AuditLog,
  Communication,
  EventSettings,
  FieldConfig,
  Payment,
  Rsvp,
  SiteContent,
  Store,
  TicketType,
} from "@/types/domain";

const firstNames = [
  "Adaeze", "Chiamaka", "Tunde", "Oluwaseun", "Zainab", "Emeka", "Funmilayo", "Ibrahim",
  "Ngozi", "Chinedu", "Aisha", "Kolawole", "Yetunde", "Babatunde", "Halima", "Obinna",
  "Amaka", "Yusuf", "Damilola", "Seyi", "Kemi", "Ifeoma", "Tobi", "Maryam", "Femi",
  "Chisom", "Hauwa", "Kunle", "Ada", "Bolaji",
];

const lastNames = [
  "Adeyemi", "Okafor", "Balogun", "Nwosu", "Abdullahi", "Okonkwo", "Adebayo", "Eze",
  "Mohammed", "Ogunleye", "Chukwu", "Bello", "Adeleke", "Okeke", "Lawal", "Ojo",
  "Nwachukwu", "Suleiman", "Adesina", "Bakare",
];

const cities = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Enugu", "Benin City", "Abeokuta", "Uyo", "Owerri", "Kaduna"];
const genders = ["Woman", "Man", "Woman", "Man", "Woman", "Prefer not to say"];
const relationships = ["Single", "Single", "It's complicated", "In a relationship", "Prefer not to say"];
const professions = ["Brand manager", "Doctor", "Founder", "Analyst", "Stylist", "Engineer", "Lawyer", "Photographer", "Architect", "Writer", "Consultant", "Graduate student"];
const sources = ["Friend", "Instagram", "WhatsApp", "X", "Campus", "Somewhere else"];
const interests = [
  "Meaningful conversation",
  "Meeting new people",
  "Understanding marriage",
  "A night out with friends",
  "Networking",
  "Just curious",
];

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rand: () => number, list: T[]) {
  return list[Math.floor(rand() * list.length)]!;
}

function id(prefix: string, n: number) {
  return `${prefix}-${String(n).padStart(3, "0")}`;
}

export const defaultFields: FieldConfig[] = [
  { key: "fullName", label: "Full name", type: "text", enabled: true, required: true, sensitive: false, placeholder: "Your name" },
  { key: "email", label: "Email", type: "email", enabled: true, required: true, sensitive: false, placeholder: "you@email.com" },
  { key: "phone", label: "Phone", type: "tel", enabled: true, required: true, sensitive: false, placeholder: "080…" },
  { key: "age", label: "Age", type: "number", enabled: true, required: true, sensitive: false, placeholder: "21–35" },
  { key: "gender", label: "Gender", type: "select", enabled: true, required: false, sensitive: false, options: ["Woman", "Man", "Non-binary", "Prefer not to say"] },
  { key: "relationshipStatus", label: "Relationship status", type: "select", enabled: true, required: false, sensitive: true, options: ["Prefer not to say", "Single", "In a relationship", "Married", "It's complicated"] },
  { key: "profession", label: "Profession", type: "text", enabled: true, required: false, sensitive: false, placeholder: "What you do" },
  { key: "city", label: "City", type: "text", enabled: true, required: false, sensitive: false, placeholder: "Where you live" },
  { key: "source", label: "How you heard about The Mingle", type: "select", enabled: true, required: false, sensitive: false, options: sources },
  { key: "dietary", label: "Dietary requirements", type: "text", enabled: true, required: false, sensitive: false, placeholder: "Optional" },
  { key: "interests", label: "What are you hoping for?", type: "text", enabled: true, required: false, sensitive: false, placeholder: "Optional" },
  { key: "consent", label: "I understand The Mingle is for ages 21–35, and I’m happy to be contacted about my RSVP.", type: "text", enabled: true, required: true, sensitive: false },
];

export const defaultEvent: EventSettings = {
  name: "The Mingle",
  date: "2026-12-22",
  time: "",
  venue: "",
  address: "",
  city: "",
  description:
    "The Mingle is a special experience created for young adults aged 21–35 — a space to learn, connect, grow, have fun and maybe meet someone special.",
  capacity: null,
  ageMin: 21,
  ageMax: 35,
  rsvpOpen: true,
  paymentEnabled: false,
  paymentProvider: "",
  currency: "NGN",
  contactEmail: "",
  contactPhone: "",
  instagram: "",
  organizer: "",
};

export const defaultContent: SiteContent = {
  hero: {
    eyebrow: "A Nigerian gathering  ·  Ages 21–35",
    title: "The Mingle",
    headline: "Are you ready\nto mingle?",
    kicker: "Something exciting is coming.",
    description:
      "An unforgettable experience for young adults aged 21–35 to learn, connect, play, grow — and maybe find love.",
    primaryCta: "RSVP",
    secondaryCta: "Discover the experience",
    image: "asset:hero",
    video: "",
  },
  about: {
    eyebrow: "Why we exist",
    title: "More than\na party.",
    body: "The Mingle is a special experience created for young adults between 21 and 35 who want to understand love, relationships, friendship, commitment and responsibility — while enjoying a beautiful environment to connect, have fun and meet new people.",
    image: "asset:about",
    secondaryImage: "asset:aboutSecondary",
  },
  matters: {
    eyebrow: "The conversation",
    title: "We’re talking about the things that matter.",
    intro:
      "A lot of people walk into love, and sometimes into marriage, without a language for what they’re doing. This evening makes room for that language — without turning the room into a classroom.",
    words: [
      { word: "Love", copy: "Understanding love, relationships, and what marriage actually asks of a person." },
      { word: "Communication", copy: "How people speak, listen, and tell the truth before a relationship hardens around silence." },
      { word: "Compatibility", copy: "Choosing a person with your eyes open — values, pace, faith, ambition, and the life you actually want." },
      { word: "Choices", copy: "Healthy decisions around drugs, alcohol, peer pressure, and the company you keep." },
      { word: "Commitment", copy: "Preparing yourself emotionally and mentally, so commitment is a choice and not a costume." },
    ],
  },
  experiences: [
    { id: "exp-love", index: "01", title: "Love & relationships", summary: "Understanding love, relationships and marriage.", body: "Not advice shouted from a stage. A room where love is spoken about with honesty — what it is, what it costs, and what it cannot fix.", image: "asset:love" },
    { id: "exp-talk", index: "02", title: "Communication & compatibility", summary: "How to choose, and how to talk.", body: "Communication, compatibility, and the quiet work of choosing the right person. The conversations people usually postpone.", image: "asset:communication" },
    { id: "exp-choices", index: "03", title: "Healthy life choices", summary: "Influence, alcohol, and the company you keep.", body: "Drug use, alcohol, and negative peer influence — approached as life choices, not a lecture. Responsibility, without the finger-wag.", image: "asset:choices" },
    { id: "exp-marriage", index: "04", title: "Preparing for marriage", summary: "Emotionally. Mentally. Honestly.", body: "Preparing yourself for marriage before you prepare a ceremony. Readiness, responsibility, and the difference between a feeling and a life.", image: "asset:marriage" },
    { id: "exp-connect", index: "05", title: "Connection & networking", summary: "Meet people properly.", body: "Friendships, introductions, and conversations that don’t end when the music does. Come with your people. Leave with more of them.", image: "asset:connection" },
    { id: "exp-games", index: "06", title: "Games & activities", summary: "Play is part of the point.", body: "Exciting games and things to do with your hands, so the room never becomes a seminar. You’ll talk more because you’re playing.", image: "asset:games" },
    { id: "exp-music", index: "07", title: "Entertainment", summary: "The room has a pulse.", body: "Music and entertainment, paced like a good evening — enough to move you, never so loud that a real conversation can’t survive.", image: "asset:music" },
    { id: "exp-table", index: "08", title: "Food & drinks", summary: "Stay a while.", body: "Lots to eat. Lots to drink. A table worth lingering at, because the best mingling happens between bites.", image: "asset:food" },
  ],
  play: {
    title: "But we’re not coming just to lecture you.",
    words: ["Food", "Drinks", "Games", "Music", "Networking", "Fun", "Connections", "Surprises"],
  },
  mingle: {
    eyebrow: "The room",
    title: "And then… you mingle.",
    lines: [
      "Come with your friends.",
      "Come with an open mind.",
      "Come ready to meet people.",
      "Come ready to connect.",
      "And who knows…",
    ],
    reveal: "You might just meet someone special.",
  },
  finale: {
    title: "So…\nAre you ready to mingle?",
    primaryCta: "RSVP now",
    secondaryCta: "Bring your people",
    image: "asset:finale",
  },
};

const ticket: TicketType = {
  id: "ticket-guest",
  name: "Guest",
  description: "A place in the room. Price to be set before payment opens.",
  price: null,
  currency: "NGN",
  limit: null,
  active: true,
};

function buildGuests(rand: () => number, now: number) {
  const attendees: Attendee[] = [];
  const rsvps: Rsvp[] = [];
  const payments: Payment[] = [];
  const attendance: Store["attendance"] = [];
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  for (let i = 0; i < 120; i++) {
    const first = firstNames[i % firstNames.length]!;
    const last = lastNames[Math.floor(i / 2) % lastNames.length]!;
    const status: Rsvp["status"] = i < 87 ? "confirmed" : i < 119 ? "pending" : "cancelled";
    const daysAgo = Math.floor(rand() * 34);
    const created = new Date(now - daysAgo * 86400000 - Math.floor(rand() * 80000000)).toISOString();
    const attendeeId = id("att", i + 1);
    const rsvpId = id("rsvp", i + 1);
    let reference = "TM-";
    for (let c = 0; c < 6; c++) reference += alphabet[Math.floor(rand() * alphabet.length)];

    attendees.push({
      id: attendeeId,
      fullName: `${first} ${last}`,
      email: `${first}.${last}.${i}@example.com`.toLowerCase(),
      phone: `080${String(10000000 + i * 137).slice(0, 8)}`,
      age: 21 + Math.floor(rand() * 15),
      gender: pick(rand, genders),
      relationshipStatus: pick(rand, relationships),
      profession: pick(rand, professions),
      city: pick(rand, cities),
      dietary: rand() > 0.8 ? "No pork" : "",
      interests: pick(rand, interests),
      sample: true,
      createdAt: created,
    });

    rsvps.push({
      id: rsvpId,
      attendeeId,
      reference,
      status,
      source: pick(rand, sources),
      consent: true,
      ticketTypeId: ticket.id,
      sample: true,
      createdAt: created,
    });

    if (status === "confirmed" && i < 60) {
      const paymentStatus: Payment["status"] = i < 40 ? "paid" : i < 52 ? "pending" : i < 57 ? "failed" : "refunded";
      payments.push({
        id: id("pay", i + 1),
        rsvpId,
        amount: null,
        currency: "NGN",
        status: paymentStatus,
        provider: "",
        providerReference: "",
        sample: true,
        createdAt: created,
      });
    }

    if (status === "confirmed" && i < 54) {
      attendance.push({
        id: id("atd", i + 1),
        rsvpId,
        status: "attended",
        markedAt: created,
      });
    }
  }

  return { attendees, rsvps, payments, attendance };
}

export function createSeed(): Store {
  const rand = mulberry32(20261006);
  const now = Date.UTC(2026, 9, 6, 12, 0, 0);
  const guests = buildGuests(rand, now);
  const seededAt = new Date(now).toISOString();

  const communications: Communication[] = [
    {
      id: "com-001",
      attendeeId: null,
      channel: "email",
      subject: "You’re on the list",
      body: "A confirmation note for the guest list. Delivery is not connected yet.",
      status: "not_connected",
      sample: true,
      createdAt: seededAt,
    },
  ];

  const auditLogs: AuditLog[] = [
    {
      id: "log-001",
      actor: "system",
      action: "seed",
      detail: "Demonstration guest list created. These people are not real.",
      createdAt: seededAt,
    },
  ];

  return {
    meta: { demo: true, seededAt },
    event: defaultEvent,
    fields: defaultFields,
    content: defaultContent,
    sessions: [
      { id: "ses-1", title: "Arrival", description: "The room opens. You find your people, or you find new ones.", time: "", sort: 1 },
      { id: "ses-2", title: "The things that matter", description: "Love, communication, compatibility, choices, commitment.", time: "", sort: 2 },
      { id: "ses-3", title: "Play", description: "Food, drinks, games, music. The evening exhales.", time: "", sort: 3 },
      { id: "ses-4", title: "You mingle", description: "Conversations. Introductions. Whatever the room decides.", time: "", sort: 4 },
    ],
    faqs: [
      { id: "faq-1", sort: 1, question: "Who is this for?", answer: "Young adults aged 21–35 who want more than a party, and more than a lecture." },
      { id: "faq-2", sort: 2, question: "Is this a lecture?", answer: "No. You’ll talk about love, relationships, marriage and the choices around them — then eat, play, and actually meet people." },
      { id: "faq-3", sort: 3, question: "Can I come with friends?", answer: "Yes. Come with your people. The room is better when you do. You may also come alone." },
      { id: "faq-4", sort: 4, question: "When and where?", answer: "The evening is 22 December 2026. The venue will be announced here, and to everyone on the list." },
      { id: "faq-5", sort: 5, question: "Do I need to pay?", answer: "Not yet. RSVP is open on its own. If a ticket price is introduced, you’ll choose a place and pay before you’re confirmed. Payment is not switched on." },
    ],
    gallery: [
      { id: "gal-1", src: "asset:galleryA", alt: "Young adults in Nigeria", caption: "The company you keep", credit: "Pexels", sort: 1 },
      { id: "gal-2", src: "asset:galleryB", alt: "Editorial portrait of a young woman", caption: "Come as you are", credit: "Unsplash", sort: 2 },
      { id: "gal-3", src: "asset:galleryC", alt: "Friends laughing", caption: "Stay for the conversation", credit: "Unsplash", sort: 3 },
      { id: "gal-4", src: "asset:galleryD", alt: "A young man dressed in Nigerian attire", caption: "Dress for the evening", credit: "Pexels", sort: 4 },
      { id: "gal-5", src: "asset:galleryE", alt: "A young man looking off camera", caption: "An open mind", credit: "Unsplash", sort: 5 },
      { id: "gal-6", src: "asset:galleryF", alt: "Drinks waiting on a bar", caption: "Linger", credit: "Unsplash", sort: 6 },
    ],
    sponsors: [],
    ticketTypes: [ticket],
    notes: [
      {
        id: "note-001",
        attendeeId: "att-001",
        body: "Sample note. Private to the admin. This guest is demonstration data.",
        author: "The Mingle",
        createdAt: seededAt,
      },
    ],
    communications,
    auditLogs,
    ...guests,
  };
}
