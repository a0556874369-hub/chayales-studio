"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const DEFAULT_FRAMES = [
  "/images/glass-1.png?v=2",
  "/images/glass-2.png?v=2",
  "/images/glass-3.png?v=2",
  "/images/glass-4.png?v=2",
];

// ping-pong cycle: 0 → 1 → 2 → 3 → 2 → 1 → 0 ...
const PING_PONG_CYCLE = [0, 1, 2, 3, 2, 1] as const;
const FRAME_INTERVAL_MS = 200;

type Props = {
  frames?: string[];
  alt?: string;
  className?: string;
};

export default function GlassSculpture({
  frames = DEFAULT_FRAMES,
  alt = "פסל זכוכית",
  className = "",
}: Props) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = setInterval(() => {
      setTick((t) => (t + 1) % PING_PONG_CYCLE.length);
    }, FRAME_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const currentFrame = PING_PONG_CYCLE[tick];

  return (
    <div
      className={`sculpture-float relative aspect-square w-full max-w-[300px] lg:max-w-[500px] ${className}`}
      style={{
        filter: "drop-shadow(0 0 80px rgba(55, 134, 127, 0.4))",
      }}
    >
      {frames.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          priority={i === 0}
          unoptimized
          sizes="(min-width: 1024px) 500px, 300px"
          className="object-contain transition-opacity duration-[200ms] ease-in-out"
          style={{ opacity: i === currentFrame ? 1 : 0 }}
        />
      ))}
    </div>
  );
}
