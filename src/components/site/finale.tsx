"use client";

import Link from "next/link";
import { useState } from "react";
import { SafeImage } from "@/components/site/safe-image";
import { resolveImage } from "@/config/assets";
import type { PublicSite } from "@/types/domain";

export function Finale({ site }: { site: PublicSite }) {
  const finale = site.content.finale;
  const image = resolveImage(finale.image);
  const [note, setNote] = useState("");
  const lines = finale.title.split("\n");

  async function share() {
    const url = window.location.origin;
    const payload = { title: "The Mingle", text: "Are you ready to mingle?", url };
    try {
      if (navigator.share) await navigator.share(payload);
      else {
        await navigator.clipboard.writeText(url);
        setNote("Link copied.");
      }
    } catch {
      setNote("");
    }
  }

  return (
    <section className="finale">
      <SafeImage src={image.src} alt={image.alt || ""} fill sizes="100vw" style={{ objectFit: "cover" }} />
      <div className="veil" />
      <div className="finale-copy">
        <p className="eyebrow">Your invitation</p>
        <h2 className="display">
          {lines.map((line) => (
            <span key={line} style={{ display: "block" }}>
              {line}
            </span>
          ))}
        </h2>
        <div className="hero-actions">
          <Link className="btn-fill" href="/rsvp" data-cursor="rsvp">
            {finale.primaryCta}
          </Link>
          <button className="btn-line" onClick={share} style={{ color: "#f3eee6" }}>
            {finale.secondaryCta} →
          </button>
        </div>
        {note ? <p>{note}</p> : null}
      </div>
    </section>
  );
}
