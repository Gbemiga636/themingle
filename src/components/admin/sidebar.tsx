"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/server/actions";

const links = [
  ["Overview", "/admin"],
  ["Attendees", "/admin/attendees"],
  ["RSVPs", "/admin/rsvps"],
  ["Payments", "/admin/payments"],
  ["Analytics", "/admin/analytics"],
  ["Event", "/admin/event"],
  ["Schedule", "/admin/schedule"],
  ["Gallery", "/admin/gallery"],
  ["Content", "/admin/content"],
  ["Communications", "/admin/communications"],
  ["Settings", "/admin/settings"],
];

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();
  return (
    <aside>
      <Link href="/admin" className="wordmark">
        The Mingle
      </Link>
      <nav>
        {links.map(([label, href]) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={active ? "is-active" : ""}>
              {label}
            </Link>
          );
        })}
      </nav>
      <div style={{ marginTop: "auto" }}>
        <p style={{ color: "#b7aea3", fontSize: "0.8rem" }}>{email}</p>
        <form action={logoutAction}>
          <button type="submit" style={{ letterSpacing: "0.14em", textTransform: "uppercase", fontSize: "0.68rem", marginTop: "0.6rem" }}>
            Sign out
          </button>
        </form>
        <p style={{ marginTop: "1rem" }}>
          <Link href="/" style={{ color: "#b7aea3", fontSize: "0.75rem" }}>
            View the site
          </Link>
        </p>
      </div>
    </aside>
  );
}
