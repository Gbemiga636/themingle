import { z } from "zod";
import type { FieldConfig } from "@/types/domain";

export function buildRsvpSchema(fields: FieldConfig[], ageMin: number, ageMax: number) {
  const enabled = (key: string) => fields.find((field) => field.key === key)?.enabled !== false;
  const required = (key: string) => {
    const field = fields.find((item) => item.key === key);
    return Boolean(field?.enabled && field.required);
  };

  const text = (key: string, label: string, max = 120) => {
    if (!enabled(key)) return z.string().optional().default("");
    const base = z.string().trim().max(max, `${label} is too long.`);
    return required(key) ? base.min(1, `${label} is required.`) : base.optional().default("");
  };

  return z.object({
    fullName: text("fullName", "Full name", 80),
    email: enabled("email")
      ? z.string().trim().email("Enter a valid email.").max(160)
      : z.string().optional().default(""),
    phone: text("phone", "Phone", 30),
    age: z.coerce
      .number({ invalid_type_error: "Age is required." })
      .int()
      .min(ageMin, `The Mingle is for ages ${ageMin}–${ageMax}.`)
      .max(ageMax, `The Mingle is for ages ${ageMin}–${ageMax}.`),
    gender: text("gender", "Gender", 40),
    relationshipStatus: text("relationshipStatus", "Relationship status", 40),
    profession: text("profession", "Profession", 80),
    city: text("city", "City", 80),
    source: text("source", "This field", 40),
    dietary: text("dietary", "Dietary requirements", 160),
    interests: text("interests", "This field", 200),
    consent: z.boolean().refine((value) => value, { message: "Consent is required to join the list." }),
    company: z.string().max(0).optional().default(""),
  });
}

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});
