"use client";

// ScrollReveal — wraps children in a motion element whose opacity, y and
// filter follow scroll progress (bi-directional). One ScrollReveal per
// instance creates one useScroll observer — fine in moderation. Pass
// `as` to render an h1/h2/p/section etc. instead of the default div, so
// callers don't add an extra DOM wrapper around already-semantic content.

import { motion, type HTMLMotionProps } from "framer-motion";
import { useRef, type ElementType, type ReactNode } from "react";
import {
  useScrollReveal,
  type ScrollRevealOptions,
} from "@/lib/useScrollReveal";

interface ScrollRevealProps extends ScrollRevealOptions {
  children: ReactNode;
  /** Tag to render. Defaults to "div". */
  as?: "div" | "section" | "article" | "li" | "header" | "footer" | "p" | "h1" | "h2" | "h3";
  className?: string;
  style?: React.CSSProperties;
}

export default function ScrollReveal({
  children,
  as = "div",
  className,
  style,
  ...options
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { opacity, y, filter } = useScrollReveal(ref, options);

  // framer-motion exposes motion.<tag> for each HTML tag; using a generic
  // wrapper with a string-keyed access. The types from framer-motion are
  // unwieldy here so we erase to ElementType.
  const Tag = motion[as] as unknown as ElementType;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ opacity, y, filter, ...style }}
    >
      {children}
    </Tag>
  );
}
