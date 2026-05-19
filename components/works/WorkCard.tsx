"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import type { Work } from "@/lib/works-data";
import { countImages } from "@/lib/works-data";
import { useGlassInteraction } from "@/lib/useGlassInteraction";
import SafeImage from "./SafeImage";

interface WorkCardProps {
  work: Work;
  index: number;
  onOpen: (slug: string) => void;
  // Bento positioning supplied by the parent. Empty on mobile (single column).
  desktopArea?: { col: string; row: string };
}

// Glass card with a framed image inside (passe-partout look). The image is
// always shown in full (object-contain), the glass frame around it lets the
// LightRays aurora glow through. Counter badge in the top-left shows the
// total images in the project. Always-visible label with a hover-revealed
// "View project →" call to action on desktop.
//
// The inner .work-card-tilt wrapper receives the mouse-driven 3D tilt and
// hosts the shine overlay (::after) — kept inside the wrapper so both
// effects tilt with the card together. framer-motion drives the entrance
// animation on the outer button (transform doesn't conflict because the
// tilt lives on the child).
export default function WorkCard({
  work,
  index,
  onOpen,
  desktopArea,
}: WorkCardProps) {
  const reduceMotion = useReducedMotion();
  const count = countImages(work);
  // Hook lives on the outer card — the CSS variables (--rx, --ry, --mx, --my)
  // it writes cascade down to the inner .work-card-tilt (which does the
  // transform) AND are read by the outer ::after that paints the full-card
  // shine.
  const cardRef = useGlassInteraction<HTMLButtonElement>();

  const style: CSSProperties = {
    ["--work-aspect" as string]: work.aspectRatio,
    ...(desktopArea
      ? {
          ["--work-col" as string]: desktopArea.col,
          ["--work-row" as string]: desktopArea.row,
        }
      : {}),
  };

  return (
    <motion.button
      ref={cardRef}
      type="button"
      className="work-card"
      style={style}
      data-slug={work.slug}
      onClick={() => onOpen(work.slug)}
      initial={
        reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.92 }
      }
      whileInView={
        reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }
      }
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.55,
        delay: reduceMotion ? 0 : index * 0.09,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      aria-label={`צפו בפרויקט ${work.clientName}`}
    >
      <div className="work-card-tilt">
        <div className="work-card-frame">
          <div className="work-card-image-wrap">
            <SafeImage
              src={work.gridImage.src}
              alt={work.gridImage.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              quality={80}
              className="work-card-image"
            />
          </div>

          <span className="work-card-count-badge" aria-hidden>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4DD8E5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              focusable="false"
            >
              <rect x="3" y="3" width="13" height="13" rx="2" />
              <path d="M8 8h13v13H8z" />
            </svg>
            {count}
          </span>
        </div>

        <div className="work-card-label">
          <span className="work-card-name">{work.clientName}</span>
          <span className="work-card-cta" aria-hidden>
            צפו בפרויקט <span className="work-card-arrow">←</span>
          </span>
        </div>
      </div>
    </motion.button>
  );
}
