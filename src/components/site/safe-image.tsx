"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

export function SafeImage({ alt, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed || !props.src) {
    return <div style={{ background: "#3a141d", width: "100%", height: "100%", minHeight: 180 }} role="img" aria-label={alt} />;
  }
  return <Image {...props} alt={alt} onError={() => setFailed(true)} />;
}
