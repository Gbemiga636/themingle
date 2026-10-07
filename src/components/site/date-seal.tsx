"use client";

import { useEffect, useState } from "react";

export function DateSeal({ date, placement = "hero" }: { date: string; placement?: "hero" | "gate" }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!date) return null;
  const evening = new Date(`${date}T12:00:00`);
  if (Number.isNaN(evening.getTime())) return null;

  const day = evening.getDate();
  const month = new Intl.DateTimeFormat("en-NG", { month: "long" }).format(evening);
  const year = evening.getFullYear();
  const yearStart = new Date(year, 0, 1).getTime();
  const yearEnd = new Date(year + 1, 0, 1).getTime();
  const progress = Math.min(100, Math.max(0, ((evening.getTime() - yearStart) / (yearEnd - yearStart)) * 100));

  let away = "";
  if (now !== null) {
    const nights = Math.ceil((evening.getTime() - now) / 86_400_000);
    away = nights > 1 ? `${nights} nights away` : nights === 1 ? "Tomorrow night" : nights === 0 ? "Tonight" : "This evening has passed";
  }

  return (
    <div className={`year-seal ${placement === "gate" ? "is-gate" : ""}`} aria-label={`${day} ${month} ${year}`}>
      <div className="year-ring" style={{ ["--year" as string]: `${progress}%` }}>
        <strong>{day}</strong>
        <span>{month}</span>
      </div>
      <div>
        <p className="year-word">{year}</p>
        <p className="year-away">{away || "Save the evening"}</p>
      </div>
    </div>
  );
}
