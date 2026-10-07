"use client";

import { useState } from "react";
import { SafeImage } from "@/components/site/safe-image";
import { resolveImage } from "@/config/assets";
import type { PublicSite } from "@/types/domain";

export function Experience({ site }: { site: PublicSite }) {
  const icons: Record<string, string> = {
    "exp-love": "fas fa-heart",
    "exp-talk": "fas fa-comments",
    "exp-choices": "fas fa-leaf",
    "exp-marriage": "fas fa-ring",
    "exp-connect": "fas fa-link",
    "exp-games": "fas fa-dice",
    "exp-music": "fas fa-music",
    "exp-table": "fas fa-champagne-glasses",
  };
  const items = site.content.experiences;
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];
  const image = resolveImage(current?.image || "");

  return (
    <section className="section experience" id="experience">
      <p className="eyebrow">The evening</p>
      <h2 className="display">This is what The Mingle feels like.</h2>
      <div className="exp-scroll" data-cursor="drag">
        {items.map((item) => {
          const shot = resolveImage(item.image);
          return (
            <article className="exp-card" key={item.id}>
              <SafeImage src={shot.src} alt={shot.alt || item.title} width={900} height={1100} sizes="78vw" />
              <span>{item.index}</span>
              <strong><i className={icons[item.id] || "fas fa-heart"} aria-hidden="true" /> {item.title}</strong>
              <p>{item.summary}</p>
            </article>
          );
        })}
      </div>
      <div className="exp-desktop">
        <div>
          {items.map((item, index) => (
            <button key={item.id} className={`exp-row ${index === active ? "is-on" : ""}`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} aria-pressed={index === active} data-cursor="explore">
              <span>{item.index}</span>
              <span>
                <strong><i className={icons[item.id] || "fas fa-heart"} aria-hidden="true" /> {item.title}</strong>
                <small>{index === active ? item.body : item.summary}</small>
              </span>
            </button>
          ))}
        </div>
        {current ? (
          <figure className="exp-visual">
            <SafeImage src={image.src} alt={image.alt || current.title} fill sizes="40vw" style={{ objectFit: "cover" }} />
            <figcaption>
              {current.index} — {current.title}
            </figcaption>
          </figure>
        ) : null}
      </div>
    </section>
  );
}
