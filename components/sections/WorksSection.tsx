"use client";

import dynamic from "next/dynamic";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";
import { works } from "@/lib/works-data";
import WorkCard from "@/components/works/WorkCard";
import CharacterReveal from "@/components/motion/CharacterReveal";
import HeadlineAccent from "@/components/motion/HeadlineAccent";
import ScrollReveal from "@/components/motion/ScrollReveal";
import SectionSweep from "@/components/motion/SectionSweep";

// Heavy modal — load only when first opened. SSR off because it uses portals.
const WorkModal = dynamic(() => import("@/components/works/WorkModal"), {
  ssr: false,
});

// Bento positions per slug. RTL is set on the grid container; column 1 is
// the right-most column in RTL flow. These are now applied to the
// .work-card-wrap (ScrollReveal) — the wrap is the grid item.
const BENTO_POSITIONS: Record<string, { col: string; row: string }> = {
  krauss: { col: "1 / 3", row: "1 / 4" },
  "bait-beklik": { col: "3 / 5", row: "1 / 3" },
  icansit: { col: "3 / 5", row: "3 / 5" },
  "olam-hatinok": { col: "1 / 3", row: "4 / 9" },
  dental: { col: "3 / 4", row: "5 / 9" },
  kinor: { col: "4 / 5", row: "5 / 9" },
};

export default function WorksSection() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  const openWork = useCallback((slug: string) => setOpenSlug(slug), []);
  const closeWork = useCallback(() => setOpenSlug(null), []);

  const currentWork = useMemo(
    () => works.find((w) => w.slug === openSlug) ?? null,
    [openSlug],
  );

  // Parallax drift for the breathing glow layer — moves slightly slower
  // than the main content, giving the section depth.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"] as never,
  });
  const glowsY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [120, -120],
  );

  return (
    <section
      ref={sectionRef}
      className="works-section"
      id="works"
      data-theme="light"
      aria-label="גלריית מותגים"
    >
      {/* Breathing teal glows wrapped in a scroll-parallax layer. Inner
          breathing keyframes still fire on each span; the wrapper drifts
          with scroll for parallax depth. */}
      <motion.div
        className="parallax-glows"
        aria-hidden
        style={{ y: glowsY }}
      >
        <span className="works-glow works-glow-1" aria-hidden />
        <span className="works-glow works-glow-2" aria-hidden />
        <span className="works-glow works-glow-3" aria-hidden />
      </motion.div>

      {/* Vertical teal sweep coupled to scroll progress. */}
      <SectionSweep theme="light" />

      <div className="works-content">
        <CharacterReveal
          as="h2"
          mode="scroll"
          className="works-headline"
          segments={[{ text: "כל עבודה - שפה משלה, מותג שלם.", color: "white" }]}
        />
        <HeadlineAccent />

        <ScrollReveal as="p" className="works-subhead">
          לא קולקציה של עבודות. גלריית מותגים שלא מדפדפים לידם.
        </ScrollReveal>

        <div className="works-grid" dir="rtl">
          {works.map((work, i) => {
            const area = BENTO_POSITIONS[work.slug];
            // Cards slide in from alternating sides — even-index from the
            // left (xFrom -120), odd-index from the right (+120).
            const xFrom = i % 2 === 0 ? -120 : 120;
            return (
              <ScrollReveal
                key={work.slug}
                className="work-card-wrap"
                scaleFrom={0.94}
                rotateXFrom={6}
                xFrom={xFrom}
                style={
                  area
                    ? ({
                        ["--work-col" as string]: area.col,
                        ["--work-row" as string]: area.row,
                      } as React.CSSProperties)
                    : undefined
                }
              >
                <WorkCard work={work} onOpen={openWork} />
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal className="works-cta-wrap">
          <a href="#contact" className="works-cta">
            צרו איתי קשר לפרויקט שלכם <span aria-hidden>←</span>
          </a>
        </ScrollReveal>
      </div>

      <WorkModal work={currentWork} onClose={closeWork} />
    </section>
  );
}
