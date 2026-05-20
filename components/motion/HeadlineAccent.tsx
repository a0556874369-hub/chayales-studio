"use client";

// HeadlineAccent — a 2px teal line that draws itself in (0 → 100px) as
// the user scrolls past it. Anchored to the start of the line, which is
// the RIGHT side in RTL — so the line emerges glowing from the right
// edge of the headline and extends leftward.
//
// Pure presentation: aria-hidden. Renders a static 100px line under
// prefers-reduced-motion.

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

const OFFSET = ["start end", "center 75%"] as const;

export default function HeadlineAccent() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: OFFSET as never,
  });

  // px width animated 0 → 100. Under reduced motion the line is just
  // always 100px, no animation.
  const width = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [100, 100] : [0, 100],
  );

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        marginTop: 16,
        // Flex with start-justification anchors the line to the inline
        // start of its container — which in RTL is the right side. As the
        // inner width grows, the line extends leftward.
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <motion.div
        style={{
          width,
          height: 2,
          borderRadius: 1,
          // 270deg = right-to-left geometrically (CSS gradient angles are
          // not affected by `dir`). Bright teal on the right (origin),
          // fading to 40% on the left (trailing edge).
          background:
            "linear-gradient(270deg, rgba(77, 216, 229, 1) 0%, rgba(77, 216, 229, 0.4) 100%)",
          boxShadow: "0 0 12px rgba(77, 216, 229, 0.7)",
          willChange: reduce ? undefined : "width",
        }}
      />
    </div>
  );
}
