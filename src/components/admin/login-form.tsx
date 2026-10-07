"use client";

import { useActionState } from "react";
import { loginAction } from "@/server/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(async (_previous: { error: string } | null, formData: FormData) => {
    return (await loginAction(formData)) ?? null;
  }, null);

  return (
    <form className="form" action={action}>
      <p className="eyebrow">Admin</p>
      <h1 className="display" style={{ fontSize: "clamp(3rem, 6vw, 5rem)", margin: "0.4rem 0 1rem" }}>
        The office.
      </h1>
      <label>
        Email
        <input name="email" type="email" required autoComplete="username" />
      </label>
      <label>
        Password
        <input name="password" type="password" required autoComplete="current-password" />
      </label>
      {state?.error ? <p className="error">{state.error}</p> : null}
      <button className="btn-fill" type="submit" disabled={pending}>
        {pending ? "Checking…" : "Enter"}
      </button>
      {process.env.NODE_ENV !== "production" ? (
        <p style={{ color: "#b7aea3", maxWidth: "36ch" }}>
          Local defaults, unless you changed .env.local: admin@themingle.local / mingle-admin
        </p>
      ) : null}
    </form>
  );
}
