import type { Metadata } from "next";
import { HamperShow } from "@/components/site/hamper-show";

export const metadata: Metadata = {
  title: "Dashiled Christmas Hampers",
  robots: { index: false, follow: false },
};

export default function DashiledHamperPage() {
  return <HamperShow />;
}
