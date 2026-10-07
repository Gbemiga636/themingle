import { Nav } from "@/components/site/nav";
import { Cursor } from "@/components/site/cursor";
import { Loader } from "@/components/site/loader";
import { MobileBar } from "@/components/site/mobile-bar";
import type { ReactNode } from "react";

export function PublicFrame({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Loader />
      <Cursor />
      <Nav />
      <div id="content">{children}</div>
      <MobileBar />
    </>
  );
}
