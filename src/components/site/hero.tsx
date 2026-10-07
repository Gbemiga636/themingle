"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DateSeal } from "@/components/site/date-seal";
import { SafeImage } from "@/components/site/safe-image";
import { resolveImage } from "@/config/assets";
import { formatVenue } from "@/lib/format";
import type { PublicSite } from "@/types/domain";

const HeroCanvas = dynamic(() => import("@/components/site/hero-canvas"), { ssr: false });

export function Hero({ site }: { site: PublicSite }) {
  const { hero } = site.content;
  const image = resolveImage(hero.image);
  const secondary = resolveImage("asset:heroSecondary");
  const [canvas, setCanvas] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(min-width: 900px)").matches;
    setCanvas(!reduced && fine);
  }, []);

  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero-copy">
        <p className="eyebrow">{hero.eyebrow}</p>
        <h1 className="display">
          The
          <br />
          <em>Mingle</em>
        </h1>
        <p className="hero-line">{hero.headline}</p>
        <p className="hero-kicker">{hero.kicker}</p>
        <p className="hero-desc">{hero.description}</p>
        <DateSeal date={site.event.date} />
        <div className="hero-actions">
          <Link className="btn-fill" href="/rsvp" data-cursor="rsvp">
            {hero.primaryCta}
          </Link>
          <a className="btn-line" href="#about">
            {hero.secondaryCta} ↓
          </a>
        </div>
        <div className="hero-meta">
          <span>{formatVenue(site.event.venue, site.event.city)}</span>
          <span>
            {site.event.ageMin}–{site.event.ageMax}
          </span>
        </div>
      </div>
      <div className="hero-visual">
        {hero.video ? (
          <video src={hero.video} autoPlay muted loop playsInline poster={image.src} />
        ) : (
          <SafeImage src={image.src} alt={image.alt || "The Mingle"} fill priority sizes="(max-width: 900px) 100vw, 46vw" style={{ objectFit: "cover" }} />
        )}
        <div className="hero-shade" />
        <p className="age-flag">
          Ages {site.event.ageMin}–{site.event.ageMax}
        </p>
        {canvas ? <div className="hero-canvas"><HeroCanvas /></div> : null}
        <figure className="float-card">
          <SafeImage src={secondary.src} alt={secondary.alt} width={440} height={560} sizes="220px" />
          <figcaption>Fig. I — For love</figcaption>
        </figure>
      </div>
    </section>
  );
}
