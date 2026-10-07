"use client";

import { useEffect, useState } from "react";
import { SafeImage } from "@/components/site/safe-image";
import { resolveImage } from "@/config/assets";
import type { PublicSite } from "@/types/domain";

export function Gallery({ site }: { site: PublicSite }) {
  const [open, setOpen] = useState<number | null>(null);
  const items = site.gallery;

  useEffect(() => {
    if (open === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
      if (event.key === "ArrowRight") setOpen((value) => (value === null ? value : (value + 1) % items.length));
      if (event.key === "ArrowLeft") setOpen((value) => (value === null ? value : (value - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items.length]);

  const active = open === null ? null : items[open];
  const activeImage = active ? resolveImage(active.src) : null;

  return (
    <section className="section gallery" id="gallery">
      <p className="eyebrow">The room, imagined</p>
      <h2 className="display">Come for the connection.</h2>
      {items.length === 0 ? <p>Your memories will live here.</p> : null}
      <div className="gallery-grid">
        {items.map((item, index) => {
          const image = resolveImage(item.src);
          return (
            <figure key={item.id}>
              <button onClick={() => setOpen(index)} data-cursor="view" aria-label={`View ${item.alt || item.caption}`} style={{ display: "block", width: "100%", height: "100%" }}>
                <SafeImage src={image.src} alt={item.alt || image.alt} width={1400} height={1600} sizes="(max-width: 900px) 100vw, 40vw" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </button>
              <figcaption>{item.caption}</figcaption>
            </figure>
          );
        })}
      </div>
      {active && activeImage ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={active.caption}>
          <button onClick={() => setOpen(null)}>Close</button>
          <SafeImage src={activeImage.src} alt={active.alt || activeImage.alt} width={1600} height={1800} sizes="90vw" />
          <p style={{ textAlign: "center", letterSpacing: "0.14em", textTransform: "uppercase", fontSize: "0.72rem" }}>{active.caption}</p>
        </div>
      ) : null}
    </section>
  );
}
