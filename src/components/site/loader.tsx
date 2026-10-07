"use client";

import { useEffect, useState } from "react";

export function Loader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem("mingle-introduced")) return;
    setShow(true);
    const timer = window.setTimeout(() => {
      sessionStorage.setItem("mingle-introduced", "1");
      setShow(false);
    }, 1700);
    return () => window.clearTimeout(timer);
  }, []);

  if (!show) return null;
  return (
    <div className="loader" role="status" aria-live="polite">
      <strong>The Mingle</strong>
      <em>Are you ready?</em>
    </div>
  );
}
