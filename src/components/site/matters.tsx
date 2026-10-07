"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import type { PublicSite } from "@/types/domain";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Matters({ site }: { site: PublicSite }) {
  const { matters } = site.content;
  const [index, setIndex] = useState(0);
  const current = matters.words[index] ?? matters.words[0];
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 900px)").matches) return;
    const count = matters.words.length;
    let last = 0;
    ScrollTrigger.create({
      trigger: ref.current,
      start: "top top",
      end: "+=220%",
      pin: true,
      onUpdate: (self) => {
        const next = Math.min(count - 1, Math.floor(self.progress * count * 0.999));
        if (next !== last) {
          last = next;
          setIndex(next);
        }
      },
    });
  }, { scope: ref });

  return (
    <section className="section matters" ref={ref}>
      <div className="matters-inner">
        <div>
          <p className="eyebrow">{matters.eyebrow}</p>
          <h2 className="display" style={{ fontSize: "clamp(2.4rem, 4vw, 3.6rem)", maxWidth: "10ch", margin: "0.6rem 0 1rem" }}>
            {matters.title}
          </h2>
          <p style={{ maxWidth: "36ch", lineHeight: 1.6, color: "rgba(243,238,230,0.72)" }}>{matters.intro}</p>
        </div>
        <div>
          <p className="matter-word">{current?.word}</p>
          <p className="matter-copy">{current?.copy}</p>
          <div className="matter-list" role="tablist" aria-label="What we’ll talk about">
            {matters.words.map((item, itemIndex) => (
              <button key={item.word} className={`matter-step ${itemIndex === index ? "is-on" : ""}`} style={{ opacity: itemIndex === index ? 1 : 0.45 }} onClick={() => setIndex(itemIndex)} role="tab" aria-selected={itemIndex === index}>
                {item.word}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
