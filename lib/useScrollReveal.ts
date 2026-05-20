"use client";

// Scroll-coupled reveal: as the element travels through the viewport its
// opacity, y, and blur change with scroll progress. Bi-directional —
// scrolling back up un-reveals. One source of truth for ALL reveals on
// the site (ScrollReveal component, plus headline/subhead/CTA wrappers).

import {
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import type { RefObject } from "react";

export interface ScrollRevealOptions {
  yFrom?: number;
  blurFrom?: number;
  /**
   * framer-motion's offset signature — a tuple of two `["target viewport"]`
   * strings defining where progress is 0 and 1.
   * Default: starts revealing when target's top hits viewport bottom,
   * fully revealed when target's center reaches 70% from top.
   */
  // framer-motion's offset typing changes between minors; keep this loose
  // and let the call-site pass strings.
  offset?: ReadonlyArray<string>;
}

export interface ScrollRevealValues {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  filter: MotionValue<string>;
}

const DEFAULT_OFFSET = ["start end", "center 70%"] as const;

export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  options: ScrollRevealOptions = {},
): ScrollRevealValues {
  const { yFrom = 40, blurFrom = 8, offset = DEFAULT_OFFSET } = options;
  const reduce = useReducedMotion();

  // framer-motion's offset type is awkward across versions; cast at the
  // boundary. The runtime accepts any tuple of two strings.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as never,
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [1, 1] : [0, 1],
  );
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [yFrom, 0],
  );
  const filter = useTransform(
    scrollYProgress,
    [0, 1],
    reduce
      ? ["blur(0px)", "blur(0px)"]
      : [`blur(${blurFrom}px)`, "blur(0px)"],
  );

  return { opacity, y, filter };
}
