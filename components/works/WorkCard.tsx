"use client";

import type { CSSProperties } from "react";
import type { Work } from "@/lib/works-data";
import { countImages } from "@/lib/works-data";
import { useGlassInteraction } from "@/lib/useGlassInteraction";
import SafeImage from "./SafeImage";

interface WorkCardProps {
  work: Work;
  onOpen: (slug: string) => void;
}

// Glass card with a framed image inside (passe-partout look). The image is
// always shown in full (object-contain), the glass frame around it lets the
// LightRays aurora glow through. Counter badge in the top-left shows the
// total images in the project. Always-visible label with a hover-revealed
// "View project →" call to action on desktop.
//
// Entrance animation is owned by the parent <ScrollReveal> wrapper in
// WorksSection — this component itself has no framer-motion entrance state.
// The hook below provides the mouse-driven 3D tilt + shine; that's the
// only motion attached to the card itself.
export default function WorkCard({ work, onOpen }: WorkCardProps) {
  const count = countImages(work);
  // Hook lives on the outer card — the CSS variables (--rx, --ry, --mx, --my)
  // it writes cascade down to the inner .work-card-tilt (which does the
  // transform) AND are read by the outer ::after that paints the full-card
  // shine.
  const cardRef = useGlassInteraction<HTMLButtonElement>();

  const style: CSSProperties = {
    ["--work-aspect" as string]: work.aspectRatio,
  };

  return (
    <button
      ref={cardRef}
      type="button"
      className="work-card"
      style={style}
      data-slug={work.slug}
      onClick={() => onOpen(work.slug)}
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
    </button>
  );
}
