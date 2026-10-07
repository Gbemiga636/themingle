"use client";

import { useEffect, useRef, useState } from "react";

const labels: Record<string, string> = {
  view: "View",
  explore: "Explore",
  drag: "Drag",
  rsvp: "RSVP",
};

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const node = ref.current;
    if (!node) return;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let frame = 0;
    const move = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      const target = event.target instanceof Element ? event.target.closest("[data-cursor]") : null;
      setLabel(target?.getAttribute("data-cursor") || "");
    };
    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      node.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      frame = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    frame = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      {label ? <i>{labels[label] || label}</i> : null}
    </div>
  );
}
