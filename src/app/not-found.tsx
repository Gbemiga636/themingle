import Link from "next/link";
import { PublicFrame } from "@/components/site/frame";

export default function NotFound() {
  return (
    <PublicFrame>
      <main className="section" style={{ minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <p className="eyebrow">404</p>
        <h1 className="display" style={{ fontSize: "clamp(4rem, 10vw, 8rem)", margin: "0.4rem 0" }}>
          This page left the room.
        </h1>
        <Link className="btn-fill" href="/" style={{ width: "fit-content" }}>
          Back to The Mingle
        </Link>
      </main>
    </PublicFrame>
  );
}
