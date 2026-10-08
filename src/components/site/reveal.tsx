"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function Boot() {
  useEffect(() => {
    document.documentElement.classList.add("js");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (fine) document.documentElement.classList.add("has-cursor");
    return () => {
      document.documentElement.classList.remove("js", "has-cursor");
    };
  }, []);
  return null;
}

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.classList.add("is-in");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) node.classList.add("is-in");
      },
      { threshold: 0.05, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
