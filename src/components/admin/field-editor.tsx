"use client";

import { useState } from "react";
import { saveFields } from "@/server/actions";
import type { FieldConfig } from "@/types/domain";

export function FieldEditor({ initial }: { initial: FieldConfig[] }) {
  const [fields, setFields] = useState(initial);
  const [note, setNote] = useState("");
  return (
    <div>
      {fields.map((field, index) => (
        <label key={field.key} className="check" style={{ marginBottom: "0.6rem" }}>
          <input
            type="checkbox"
            checked={field.enabled}
            disabled={field.key === "age" || field.key === "consent"}
            onChange={(event) => {
              const next = fields.map((item, itemIndex) => itemIndex === index ? { ...item, enabled: event.target.checked } : item);
              setFields(next);
            }}
          />
          <span>
            {field.label}
            {field.sensitive ? " · sensitive, keep optional" : ""}
            {field.key === "age" || field.key === "consent" ? " · always on" : ""}
          </span>
          {field.sensitive ? null : (
            <input
              type="checkbox"
              checked={field.required}
              disabled={field.key === "age" || field.key === "consent"}
              onChange={(event) => {
                const next = fields.map((item, itemIndex) => itemIndex === index ? { ...item, required: event.target.checked } : item);
                setFields(next);
              }}
              aria-label={`${field.label} required`}
            />
          )}
        </label>
      ))}
      <button className="btn-fill" style={{ color: "#0c0b0a" }} type="button" onClick={async () => { await saveFields(fields); setNote("Questions saved."); }}>
        Save questions
      </button>
      {note ? <p>{note}</p> : null}
    </div>
  );
}
