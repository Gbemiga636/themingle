"use client";

import { useState } from "react";

export function ShareInvite({ title }: { title: string }) {
  const [note, setNote] = useState("");
  async function share() {
    const url = window.location.origin;
    try {
      if (navigator.share) await navigator.share({ title, text: "Are you ready to mingle?", url });
      else {
        await navigator.clipboard.writeText(url);
        setNote("Link copied.");
      }
    } catch {
      setNote("");
    }
  }
  return (
    <>
      <button className="btn-line" onClick={share} style={{ color: "#f3eee6" }}>
        Share The Mingle
      </button>
      {note ? <p>{note}</p> : null}
    </>
  );
}
