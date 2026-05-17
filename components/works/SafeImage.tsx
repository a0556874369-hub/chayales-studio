"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

// Wrapper around next/image that swallows missing-asset errors gracefully.
// Falls back to a neutral teal-tinted placeholder block with no text, so the
// layout stays intact even if a portfolio file is moved or renamed.
export default function SafeImage(props: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        aria-label={typeof props.alt === "string" ? props.alt : undefined}
        className="safe-image-fallback"
        role="img"
      />
    );
  }

  return <Image {...props} onError={() => setFailed(true)} />;
}
