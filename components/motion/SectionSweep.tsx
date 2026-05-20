"use client";

// SectionSweep — a 30vh teal light band that travels vertically through
// a section as the user scrolls past it. Anchored to the section's scroll
// progress (start-end → end-start), so the band enters from above the
// section as the section enters from below the viewport, then exits below
// as the section exits the top.
//
// Renders nothing when the user prefers reduced motion. The host section's
// MAIN CONTENT must be position: relative; z-index: 1 so this overlay
// (z-index: 0) sits behind it.

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, type CSSProperties } from "react";

interface SectionSweepProps {
  theme: "dark" | "light";
}

const OFFSET = ["start end", "end start"] as const;

export default function SectionSweep({ theme }: SectionSweepProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: OFFSET as never,
  });

  const y = useTransform(scrollYProgress, [0, 1], [
    "-30vh",
    "calc(100% + 30vh)",
  ]);

  if (reduce) return null;

  const bandAlpha = theme === "dark" ? 0.18 : 0.10;
  const bandStyle: CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "30vh",
    background: `linear-gradient(180deg, transparent 0%, rgba(77, 216, 229, ${bandAlpha}) 50%, transparent 100%)`,
    willChange: "transform",
    ...(theme === "dark" ? { mixBlendMode: "screen" } : {}),
  };

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      <motion.div style={{ ...bandStyle, y }} />
    </div>
  );
}
