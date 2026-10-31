"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dashiledHampers } from "@/config/hampers";

gsap.registerPlugin(ScrollTrigger);

export function HamperShow() {
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.from(".hamper-hero .eyebrow, .hamper-hero h1, .hamper-lead, .hamper-index a", {
      y: 36,
      opacity: 0,
      duration: 0.9,
      stagger: 0.05,
      ease: "power3.out",
    });

    gsap.utils.toArray<HTMLElement>(".hamper-piece").forEach((piece) => {
      const frame = piece.querySelector(".hamper-frame");
      const image = piece.querySelector("img");
      const bits = piece.querySelectorAll(".hamper-detail > *");
      const lines = piece.querySelectorAll("li");

      if (image) {
        gsap.fromTo(
          image,
          { yPercent: 8, scale: 1.12 },
          {
            yPercent: -8,
            scale: 1.12,
            ease: "none",
            scrollTrigger: { trigger: piece, start: "top bottom", end: "bottom top", scrub: 0.6 },
          },
        );
      }

      gsap.from(frame, {
        y: 70,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: piece, start: "top 82%" },
      });

      gsap.from(bits, {
        y: 28,
        opacity: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: piece, start: "top 74%" },
      });

      if (lines.length) {
        gsap.from(lines, {
          x: 22,
          opacity: 0,
          duration: 0.45,
          stagger: 0.035,
          ease: "power2.out",
          scrollTrigger: { trigger: piece, start: "top 68%" },
        });
      }
    });
  });

  return (
    <main className="hamper-page" id="content">
      <header className="hamper-hero">
        <p className="eyebrow">Dashiled</p>
        <h1>
          Christmas
          <em> Hampers</em>
        </h1>
        <p className="hamper-lead">The gift, the price, and — where the prices meet — everything packed inside.</p>
        <nav className="hamper-index" aria-label="Hampers">
          {dashiledHampers.map((hamper) => (
            <a key={hamper.id} href={`#${hamper.id}`}>
              {hamper.name}
            </a>
          ))}
        </nav>
      </header>

      <section className="hamper-list" aria-label="Dashiled Christmas Hampers">
        {dashiledHampers.map((hamper, index) => (
          <article className={`hamper-piece ${index % 2 === 1 ? "is-flip" : ""}`} id={hamper.id} key={hamper.id}>
            <figure className="hamper-frame">
              <img src={hamper.image} alt={hamper.alt} />
            </figure>
            <div className="hamper-detail">
              <p className="eyebrow">{String(index + 1).padStart(2, "0")}</p>
              <h2>{hamper.name}</h2>
              <p className="hamper-price">{hamper.price}</p>
              {hamper.items ? (
                <>
                  <p className="hamper-note">Inside this hamper</p>
                  <ul>
                    {hamper.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
