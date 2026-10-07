"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/rsvp")) return null;
  return (
    <div className="mobile-rsvp">
      <Link href="/rsvp">I’m ready to mingle</Link>
    </div>
  );
}
