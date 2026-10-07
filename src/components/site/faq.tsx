"use client";

import { useState } from "react";
import type { PublicSite } from "@/types/domain";

export function Faq({ site }: { site: PublicSite }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq" id="faq">
      <p className="eyebrow">Before you arrive</p>
      <h2 className="display">Questions.</h2>
      {site.faqs.length === 0 ? <p>Questions will live here.</p> : null}
      {site.faqs.map((faq, index) => {
        const expanded = open === index;
        return (
          <div className="faq-item" key={faq.id}>
            <button aria-expanded={expanded} onClick={() => setOpen(expanded ? -1 : index)}>
              <span>{faq.question}</span>
              <span>{expanded ? "–" : "+"}</span>
            </button>
            {expanded ? <p>{faq.answer}</p> : null}
          </div>
        );
      })}
    </section>
  );
}
