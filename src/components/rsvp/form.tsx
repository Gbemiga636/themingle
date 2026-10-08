"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { buildRsvpSchema } from "@/lib/validators";
import type { PublicSite } from "@/types/domain";

export function RsvpForm({ site }: { site: PublicSite }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const schema = buildRsvpSchema(site.fields, site.event.ageMin, site.event.ageMax);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      age: "" as unknown as number,
      gender: "",
      relationshipStatus: "",
      profession: "",
      city: "",
      source: "",
      dietary: "",
      interests: "",
      consent: false,
      company: "",
    },
  });

  if (!site.rsvpOpen) return <p>The list is closed for now.</p>;
  if (site.roomFull) return <p>The room is full.</p>;

  const fields = site.fields.filter((field) => field.enabled && field.key !== "consent");

  async function onSubmit(values: Record<string, unknown>) {
    setError("");
    const response = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = (await response.json()) as { error?: string; reference?: string; paymentUrl?: string };
    if (!response.ok || !json.reference) {
      setError(json.error || "We couldn’t save that. Try again.");
      return;
    }
    if (json.paymentUrl) {
      window.location.href = json.paymentUrl;
      return;
    }
    router.push(`/rsvp/confirmation/${json.reference}`);
  }

  return (
    <form className="form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      {fields.map((field) => {
        const name = field.key as "fullName";
        const message = form.formState.errors[name]?.message as string | undefined;
        return (
          <label key={field.key}>
            {field.label}
            {field.sensitive ? " · optional" : field.required ? "" : " · optional"}
            {field.type === "select" ? (
              <select {...form.register(name)}>
                <option value="">Select</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea {...form.register(name)} placeholder={field.placeholder} rows={3} />
            ) : (
              <input {...form.register(name, field.key === "age" ? { valueAsNumber: true } : undefined)} type={field.type === "number" ? "number" : field.type} placeholder={field.placeholder} min={field.key === "age" ? site.event.ageMin : undefined} max={field.key === "age" ? site.event.ageMax : undefined} />
            )}
            {message ? <span className="error">{message}</span> : null}
          </label>
        );
      })}
      <label className="check">
        <input type="checkbox" {...form.register("consent")} />
        <span>{site.fields.find((field) => field.key === "consent")?.label}</span>
      </label>
      {form.formState.errors.consent ? <span className="error">{String(form.formState.errors.consent.message)}</span> : null}
      <label className="hp" aria-hidden="true">
        Company
        <input tabIndex={-1} autoComplete="off" {...form.register("company")} />
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button className="btn-fill" type="submit" disabled={form.formState.isSubmitting} data-cursor="rsvp">
        {form.formState.isSubmitting ? (
          <>
            <span className="spin" aria-hidden="true" /> Saving
          </>
        ) : (
          "I’m ready to mingle"
        )}
      </button>
    </form>
  );
}
