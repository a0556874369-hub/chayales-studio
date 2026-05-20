"use client";

// ScrollReveal — wraps children in a motion element whose opacity, y,
// scale and rotateX follow scroll progress (bi-directional). One
// ScrollReveal per instance creates one useScroll observer — fine in
// moderation. Pass `as` to render an h1/h2/p/section etc. instead of the
// default div so callers don't add an extra DOM wrapper around already-
// semantic content.

import { motion } from "framer-motion";
import { useRef, type ElementType, type ReactNode } from "react";
import {
  useScrollReveal,
  type ScrollRevealOptions,
} from "@/lib/useScrollReveal";

interface ScrollRevealProps extends ScrollRevealOptions {
  children: ReactNode;
  /** Tag to render. Defaults to "div". */
  as?:
    | "div"
    | "section"
    | "article"
    | "li"
    | "header"
    | "footer"
    | "p"
    | "h1"
    | "h2"
    | "h3";
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
  const { opacity, y, x, scale, rotateX } = useScrollReveal(ref, options);

  const Tag = motion[as] as unknown as ElementType;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity,
        y,
        x,
        scale,
        rotateX,
        // Scale grows from the bottom edge so 3D entrances look like the
        // card "lands" rather than expanding from the center.
        transformOrigin: "bottom",
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
