import type { Metadata } from "next";
import { Instrument_Serif, Outfit } from "next/font/google";
import "./globals.css";
import { Boot } from "@/components/site/reveal";
import { MusicGate } from "@/components/site/music-gate";
import { siteUrl } from "@/lib/format";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

const sans = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "The Mingle", template: "%s · The Mingle" },
  description: "An unforgettable experience for young adults aged 21–35 to learn, connect, play, grow — and maybe find love.",
  openGraph: {
    title: "The Mingle",
    description: "Are you ready to mingle?",
    type: "website",
    locale: "en_NG",
  },
  twitter: { card: "summary_large_image", title: "The Mingle", description: "Are you ready to mingle?" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${display.variable} ${sans.variable}`}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
      </head>
      <body>
        <a className="skip" href="#content">
          Skip to content
        </a>
        <Boot />
        <MusicGate />
        {children}
      </body>
    </html>
  );
}
