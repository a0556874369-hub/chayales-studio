"use client";

// Scroll-coupled reveal: as the element travels through the viewport its
// opacity, y, scale and rotateX change with scroll progress. Bi-directional
// — scrolling back up un-reveals. One source of truth for ALL reveals on
// the site (ScrollReveal component, plus headline/subhead/CTA wrappers).
//
// No blur — the previous filter:blur was perceived as a glitch, not motion.
// Reveals are crisp from frame 1.

import {
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import type { RefObject } from "react";

export interface ScrollRevealOptions {
  /** Vertical translate distance the element rises from (px). */
  yFrom?: number;
  /** Horizontal translate distance the element slides in from (px). Negative = from the left, positive = from the right. */
  xFrom?: number;
  /** Initial scale factor (1 = no scale entrance). */
  scaleFrom?: number;
  /** Initial rotateX in degrees (0 = no 3D entrance). */
  rotateXFrom?: number;
  /**
   * framer-motion's offset signature — a tuple of two `["target viewport"]`
   * strings defining where progress is 0 and 1.
   * Default: starts revealing when target's top hits viewport bottom,
   * fully revealed when target's center reaches 75% from top.
   */
  offset?: ReadonlyArray<string>;
}

export interface ScrollRevealValues {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  x: MotionValue<number>;
  scale: MotionValue<number>;
  rotateX: MotionValue<number>;
}

const DEFAULT_OFFSET = ["start end", "center 75%"] as const;

export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  options: ScrollRevealOptions = {},
): ScrollRevealValues {
  const {
    yFrom = 80,
    xFrom = 0,
    scaleFrom = 1,
    rotateXFrom = 0,
    offset = DEFAULT_OFFSET,
  } = options;
  const reduce = useReducedMotion();

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
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [xFrom, 0],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [1, 1] : [scaleFrom, 1],
  );
  const rotateX = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [rotateXFrom, 0],
  );

  return { opacity, y, x, scale, rotateX };
}
