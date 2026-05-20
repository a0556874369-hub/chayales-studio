"use client";

// CharacterReveal — heading reveal at character resolution.
//
// Render tree (the important bit, after v2):
//   <Tag aria-label="...">
//     <span nowrap>                ← word wrapper (inline-block, nowrap)
//       <motion.span>ר</motion.span>
//       <motion.span>ו</motion.span>
//       <motion.span>ב</motion.span>
//     </span>
//     {' '}                        ← literal text-node space between words
//     <span nowrap>...</span>
//     ...
//   </Tag>
//
// Wrapping each word in a nowrap inline-block lets the browser break ONLY
// between words — never inside a word. The animated character index is
// global and runs continuously across all words.
//
// Two modes:
//   • 'scroll' — each character's opacity + y bound to scrollYProgress via
//     overlapping windows (stagger 0.01 per char → even a 70-char heading
//     finishes well inside the section's scroll range).
//   • 'mount'  — useInView(once:true). Each char animates via variants
//     with delay i * 0.025. colorFlash starts teal, lands at finalColor.
//
// transforms + opacity (+ color in mount) only. No filter/blur.

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

const COLOR_WHITE = "#FAFBFB";
const COLOR_TEAL = "#4DD8E5";

// Timing constants — tightened from v1 so long headlines finish their
// reveal well before the section scrolls past.
const SCROLL_STAGGER = 0.01;       // per-char progress-units step
const SCROLL_WINDOW = 0.25;        // per-char progress-units window
const MOUNT_DELAY_PER_CHAR = 0.025; // seconds per char
const MOUNT_DURATION = 0.5;        // seconds per char

interface CharData {
  char: string;
  color: "white" | "teal";
  /** Stable index across the whole headline (skips spaces). */
  animatedIndex: number;
}

interface Word {
  chars: CharData[];
}

function flattenSegments(segments: Segment[]): {
  words: Word[];
  fullText: string;
} {
  let animatedIndex = 0;
  const words: Word[] = [];
  let current: CharData[] = [];
  const parts: string[] = [];

  const flushWord = () => {
    if (current.length > 0) {
      words.push({ chars: current });
      current = [];
    }
  };

  for (const seg of segments) {
    const color = seg.color ?? "white";
    parts.push(seg.text);
    for (const ch of seg.text) {
      if (ch === " ") {
        flushWord();
        // The space itself isn't recorded — it's rendered as a literal
        // text-node BETWEEN word spans at the JSX layer.
        continue;
      }
      current.push({
        char: ch,
        color,
        animatedIndex: animatedIndex++,
      });
    }
    // A segment boundary inside a word doesn't end the word — keep
    // accumulating into the same word until the next space (or end).
  }
  flushWord();

  return { words, fullText: parts.join("") };
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
  const start = animatedIndex * SCROLL_STAGGER;
  const end = start + SCROLL_WINDOW;
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
        // Anchor each inline-block char to the parent's text baseline so
        // mixed-script / Hebrew + Latin chars stay perfectly aligned.
        verticalAlign: "baseline",
        lineHeight: "inherit",
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
        style={{
          display: "inline-block",
          verticalAlign: "baseline",
          lineHeight: "inherit",
          color: finalColor,
        }}
      >
        {char}
      </span>
    );
  }

  return (
    <motion.span
      aria-hidden="true"
      style={{
        display: "inline-block",
        verticalAlign: "baseline",
        lineHeight: "inherit",
      }}
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
                delay: animatedIndex * MOUNT_DELAY_PER_CHAR,
                duration: MOUNT_DURATION,
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

  const { words, fullText } = flattenSegments(segments);

  // Both observers are always created so hook order stays stable; the
  // unused one is effectively a no-op (one useScroll + one useInView per
  // headline — cheap).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center 80%"] as never,
  });
  const inView = useInView(ref, { once: true });

  const renderChar = (c: CharData, charKey: number) => {
    if (mode === "scroll") {
      return (
        <ScrollChar
          key={charKey}
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
        key={charKey}
        char={c.char}
        color={c.color}
        animatedIndex={c.animatedIndex}
        inView={inView}
        colorFlash={colorFlash}
        reduce={reduce}
      />
    );
  };

  return (
    <Tag ref={ref} className={className} aria-label={fullText}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          {/* Literal space text node BETWEEN word wrappers — this is the
              only place line-breaks are allowed. */}
          {wi > 0 ? " " : null}
          <span
            aria-hidden="true"
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
          >
            {word.chars.map((c, ci) => renderChar(c, ci))}
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
