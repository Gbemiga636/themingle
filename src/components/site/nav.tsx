"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/site/mark";

const links = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "The experience" },
  { href: "/#expect", label: "What to expect" },
  { href: "/#dress", label: "Dress code" },
  { href: "/#schedule", label: "Schedule" },
  { href: "/#faq", label: "FAQ" },
];

export function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`site-nav ${solid || pathname !== "/" ? "is-solid" : ""}`}>
        <Link href="/" aria-label="The Mingle, home">
          <Wordmark />
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Link className="nav-rsvp" href="/rsvp" data-cursor="rsvp">
          RSVP
        </Link>
        <button className="nav-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(true)}>
          <span />
        </button>
      </header>
      {open ? (
        <div className="nav-screen" role="dialog" aria-label="Menu">
          <button className="close" onClick={() => setOpen(false)}>
            Close
          </button>
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/rsvp" onClick={() => setOpen(false)}>
            RSVP
          </Link>
        </div>
      ) : null}
    </>
  );
}
