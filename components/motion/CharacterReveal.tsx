"use client";

// CharacterReveal — heading reveal at character resolution.
//
// Two modes:
//   • 'scroll' — each character's opacity + y are bound to the parent's
//     scrollYProgress via overlapping windows. The headline writes itself
//     in as the user scrolls past it, and un-writes when they scroll up.
//   • 'mount'  — once the headline enters the viewport (useInView with
//     once:true), each character animates in with a staggered delay.
//     If colorFlash=true, each char starts coloured teal and animates
//     to its final colour ("white" or "teal" per segment) during entry.
//
// transforms + opacity (+ color in mount mode) only. No filter/blur.
// Spaces are static text nodes (not animated). Each animated character
// is a motion.span; the outer Tag carries an aria-label with the full
// text and the spans are aria-hidden so screen readers don't read them
// letter-by-letter.

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Fragment, useRef } from "react";

export interface Segment {
  text: string;
  color?: "white" | "teal";
}

interface CharacterRevealProps {
  segments: Segment[];
  as: "h1" | "h2";
  mode?: "scroll" | "mount";
  /** Only meaningful in mode='mount'. Each char starts teal, lands at its final color. */
  colorFlash?: boolean;
  className?: string;
}

// Resolved brand colors. framer-motion can interpolate hex strings reliably
// (it can't always handle var(--...) on inline style values).
const COLOR_WHITE = "#FAFBFB";
const COLOR_TEAL = "#4DD8E5";

interface CharData {
  char: string;
  color: "white" | "teal";
  /** null for spaces (not animated). Otherwise the running animated index. */
  animatedIndex: number | null;
}

function flattenSegments(segments: Segment[]): {
  chars: CharData[];
  fullText: string;
} {
  let animatedIndex = 0;
  const chars: CharData[] = [];
  const parts: string[] = [];
  for (const seg of segments) {
    const color = seg.color ?? "white";
    parts.push(seg.text);
    for (const ch of seg.text) {
      const isSpace = ch === " ";
      chars.push({
        char: ch,
        color,
        animatedIndex: isSpace ? null : animatedIndex++,
      });
    }
  }
  return { chars, fullText: parts.join("") };
}

function colorValue(c: "white" | "teal"): string {
  return c === "teal" ? COLOR_TEAL : COLOR_WHITE;
}

// ---------- per-char renderers ----------

function ScrollChar({
  char,
  color,
  animatedIndex,
  scrollYProgress,
  reduce,
}: {
  char: string;
  color: "white" | "teal";
  animatedIndex: number;
  scrollYProgress: MotionValue<number>;
  reduce: boolean;
}) {
  const start = animatedIndex * 0.015;
  const end = start + 0.25;
  const opacity = useTransform(
    scrollYProgress,
    [start, end],
    reduce ? [1, 1] : [0, 1],
  );
  const y = useTransform(
    scrollYProgress,
    [start, end],
    reduce ? [0, 0] : [30, 0],
  );

  return (
    <motion.span
      aria-hidden="true"
      style={{
        display: "inline-block",
        opacity,
        y,
        color: colorValue(color),
        willChange: reduce ? undefined : "transform, opacity",
      }}
    >
      {char}
    </motion.span>
  );
}

function MountChar({
  char,
  color,
  animatedIndex,
  inView,
  colorFlash,
  reduce,
}: {
  char: string;
  color: "white" | "teal";
  animatedIndex: number;
  inView: boolean;
  colorFlash: boolean;
  reduce: boolean;
}) {
  const finalColor = colorValue(color);

  if (reduce) {
    return (
      <span
        aria-hidden="true"
        style={{ display: "inline-block", color: finalColor }}
      >
        {char}
      </span>
    );
  }

  return (
    <motion.span
      aria-hidden="true"
      style={{ display: "inline-block" }}
      initial={{
        opacity: 0,
        y: 30,
        color: colorFlash ? COLOR_TEAL : finalColor,
      }}
      animate={
        inView
          ? {
              opacity: 1,
              y: 0,
              color: finalColor,
              transition: {
                delay: animatedIndex * 0.04,
                duration: 0.5,
                ease: "easeOut",
              },
            }
          : undefined
      }
    >
      {char}
    </motion.span>
  );
}

// ---------- component ----------

export default function CharacterReveal({
  segments,
  as,
  mode = "scroll",
  colorFlash = false,
  className,
}: CharacterRevealProps) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const reduce = useReducedMotion() ?? false;
  const Tag = as;

  const { chars, fullText } = flattenSegments(segments);

  // Both observers are always created so hook order stays stable; the
  // unused one is effectively a no-op (one useScroll observer + one
  // useInView observer per headline — cheap).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center 80%"] as never,
  });
  const inView = useInView(ref, { once: true });

  return (
    <Tag ref={ref} className={className} aria-label={fullText}>
      {chars.map((c, i) => {
        if (c.animatedIndex === null) {
          // Space — render as a text node directly so it acts as natural
          // inter-word whitespace between the inline-block char spans.
          return <Fragment key={i}>{c.char}</Fragment>;
        }
        if (mode === "scroll") {
          return (
            <ScrollChar
              key={i}
              char={c.char}
              color={c.color}
              animatedIndex={c.animatedIndex}
              scrollYProgress={scrollYProgress}
              reduce={reduce}
            />
          );
        }
        return (
          <MountChar
            key={i}
            char={c.char}
            color={c.color}
            animatedIndex={c.animatedIndex}
            inView={inView}
            colorFlash={colorFlash}
            reduce={reduce}
          />
        );
      })}
    </Tag>
  );
}
