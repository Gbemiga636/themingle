"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PublicSite } from "@/types/domain";

gsap.registerPlugin(ScrollTrigger);

export function Play({ site }: { site: PublicSite }) {
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      ".play-words li",
      { y: 18, opacity: 0.25 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.07,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".play", start: "top 80%", once: true },
      },
    );
  });

  return (
    <section className="section play" id="expect">
      <p className="eyebrow">And also</p>
      <h2 className="display">{site.content.play.title}</h2>
      <ul className="play-words">
        {site.content.play.words.map((word) => (
          <li key={word}>{word}</li>
        ))}
      </ul>
    </section>
  );
}
