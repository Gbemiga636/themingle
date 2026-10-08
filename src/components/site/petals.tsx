"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const COLORS = ["#72283a", "#c45c6a", "#f4d6dc", "#d4b483", "#8b2942", "#f3eee6", "#e7b4c0"];

function heartPoint(t: number) {
  const x = 16 * Math.sin(t) ** 3;
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return { x, y };
}

function edgePoint(width: number, height: number) {
  const edge = Math.floor(Math.random() * 4);
  const along = Math.random();
  if (edge === 0) return { x: along * width, y: -48 };
  if (edge === 1) return { x: width + 48, y: along * height };
  if (edge === 2) return { x: along * width, y: height + 48 };
  return { x: -48, y: along * height };
}

export function PetalBloom() {
  const root = useRef<HTMLDivElement>(null);
  const played = useRef(false);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const petals = Array.from(node.querySelectorAll<HTMLElement>(".petal"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      petals.forEach((petal) => {
        petal.style.opacity = "0";
      });
      return;
    }

    const scatter = () => {
      const { width, height } = node.getBoundingClientRect();
      petals.forEach((petal) => {
        const start = edgePoint(width, height);
        gsap.set(petal, {
          x: start.x,
          y: start.y,
          rotation: Math.random() * 360,
          opacity: 0,
          scale: 0.55 + Math.random() * 0.4,
        });
      });
    };

    scatter();

    const play = () => {
      if (played.current) return;
      const { width, height } = node.getBoundingClientRect();
      if (width < 80 || height < 80) return;
      played.current = true;
      const scale = Math.min(width, height) * 0.022;
      const originX = width * 0.5;
      const originY = height * 0.48;
      const timeline = gsap.timeline();
      petals.forEach((petal, index) => {
        const point = heartPoint((index / petals.length) * Math.PI * 2);
        timeline.to(
          petal,
          {
            x: originX + point.x * scale - 12,
            y: originY + point.y * scale - 14,
            opacity: 1,
            rotation: (index / petals.length) * 240,
            scale: 1,
            duration: 1.45,
            ease: "power3.out",
          },
          index * 0.018,
        );
      });
      timeline.to(
        petals,
        {
          opacity: 0,
          duration: 1.2,
          ease: "power2.in",
          stagger: { each: 0.012, from: "random" },
          x: () => `+=${(Math.random() - 0.15) * Math.max(180, width * 0.45)}`,
          y: () => `-=${80 + Math.random() * Math.max(160, height * 0.35)}`,
          rotation: () => `+=${140 + Math.random() * 220}`,
        },
        "+=0.7",
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) play();
      },
      { threshold: [0, 0.15, 0.35] },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="petal-field" ref={root} aria-hidden="true">
      {Array.from({ length: 46 }, (_, index) => (
        <span
          key={index}
          className="petal"
          style={{
            background: COLORS[index % COLORS.length],
            width: 16 + (index % 5) * 5,
            height: 24 + (index % 4) * 7,
          }}
        />
      ))}
    </div>
  );
}
