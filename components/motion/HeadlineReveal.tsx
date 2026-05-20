"use client";

// HeadlineReveal — per-word scroll-coupled cascade.
// Splits `text` by spaces. Each word is a motion span with its own
// useTransform range derived from the parent's scrollYProgress, with the
// ranges overlapping so the cascade feels continuous (one word starts
// fading in while the next is still mid-blur). No motion at all when the
// user prefers reduced motion — everything is rendered visible from frame
// one.
//
// Headlines with inline markup (colored highlight spans, custom line
// breaks) don't fit this model — use ScrollReveal as="h1"/"h2" for those.

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Fragment, useRef } from "react";

interface HeadlineRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  /** Stagger per word (in scroll-progress units). Lower = faster cascade. */
  wordStep?: number;
  /** How long each word's individual reveal takes. */
  wordWindow?: number;
}

const DEFAULT_OFFSET = ["start end", "center 80%"] as const;

function Word({
  word,
  index,
  scrollYProgress,
  reduce,
  wordStep,
  wordWindow,
}: {
  word: string;
  index: number;
  scrollYProgress: MotionValue<number>;
  reduce: boolean;
  wordStep: number;
  wordWindow: number;
}) {
  const start = index * wordStep;
  const end = start + wordWindow;
  const opacity = useTransform(
    scrollYProgress,
    [start, end],
    reduce ? [1, 1] : [0, 1],
  );
  const y = useTransform(
    scrollYProgress,
    [start, end],
    reduce ? [0, 0] : [20, 0],
  );
  const filter = useTransform(
    scrollYProgress,
    [start, end],
    reduce
      ? ["blur(0px)", "blur(0px)"]
      : ["blur(6px)", "blur(0px)"],
  );

  return (
    <motion.span
      style={{
        display: "inline-block",
        opacity,
        y,
        filter,
        willChange: reduce ? undefined : "transform, opacity, filter",
      }}
    >
      {word}
    </motion.span>
  );
}

export default function HeadlineReveal({
  text,
  as = "h2",
  className,
  wordStep = 0.04,
  wordWindow = 0.2,
}: HeadlineRevealProps) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: DEFAULT_OFFSET as never,
  });

  const words = text.split(" ");
  const Tag = as;

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <Word
            word={word}
            index={i}
            scrollYProgress={scrollYProgress}
            reduce={reduce}
            wordStep={wordStep}
            wordWindow={wordWindow}
          />
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
