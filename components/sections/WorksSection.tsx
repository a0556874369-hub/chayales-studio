"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { works } from "@/lib/works-data";
import WorkCard from "@/components/works/WorkCard";

// Heavy modal — load only when first opened. SSR off because it uses portals.
const WorkModal = dynamic(() => import("@/components/works/WorkModal"), {
  ssr: false,
});

// Bento positions per slug on a 6-column grid. RTL is set on the grid
// container; column 1 is the right-most column in RTL flow.
// Hierarchy: bait-beklik and icansit (the two websites, wide/landscape)
// are the dominant cells; olam-hatinok is next - taller, crossing the
// band seam; krauss/dental (portrait) and kinor (squarish) close the
// composition. Cell shapes track image orientation (object-contain).
// Reading order (RTL, right-to-left top-to-bottom):
// bait-beklik, icansit, olam-hatinok, krauss, dental, kinor.
// `sizes` matches each cell's rendered width so the dominant cells get
// sharp srcset candidates.
const BENTO_POSITIONS: Record<
  string,
  { col: string; row: string; sizes: string }
> = {
  "bait-beklik": {
    col: "1 / 7",
    row: "1 / 6",
    sizes: "(min-width: 768px) 96vw, 100vw",
  },
  icansit: {
    col: "1 / 5",
    row: "6 / 9",
    sizes: "(min-width: 768px) 64vw, 100vw",
  },
  "olam-hatinok": {
    col: "5 / 7",
    row: "6 / 11",
    sizes: "(min-width: 768px) 32vw, 100vw",
  },
  krauss: {
    col: "1 / 3",
    row: "9 / 14",
    sizes: "(min-width: 768px) 32vw, 100vw",
  },
  dental: {
    col: "3 / 5",
    row: "9 / 13",
    sizes: "(min-width: 768px) 32vw, 100vw",
  },
  kinor: {
    col: "5 / 7",
    row: "11 / 14",
    sizes: "(min-width: 768px) 32vw, 100vw",
  },
};

export default function WorksSection() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const openWork = useCallback((slug: string) => setOpenSlug(slug), []);
  const closeWork = useCallback(() => setOpenSlug(null), []);

  const currentWork = useMemo(
    () => works.find((w) => w.slug === openSlug) ?? null,
    [openSlug],
  );

  return (
    <section
      className="works-section"
      id="works"
      data-theme="light"
      aria-label="גלריית מותגים"
    >
      {/* Static teal glow divs — positioning + gradient only. No
          breathing, no parallax. */}
      <span className="works-glow works-glow-1" aria-hidden />
      <span className="works-glow works-glow-2" aria-hidden />
      <span className="works-glow works-glow-3" aria-hidden />

      <div className="works-content">
        <h2 className="works-headline">כל עבודה - שפה משלה.</h2>

        <p className="works-subhead">
          לכל עסק בניתי שפה אחרת - לפי הקהל, המטרה, והרושם שהוא צריך להשאיר.
        </p>

        <div className="works-grid" dir="rtl">
          {works.map((work) => {
            const area = BENTO_POSITIONS[work.slug];
            const style: CSSProperties | undefined = area
              ? ({
                  ["--work-col" as string]: area.col,
                  ["--work-row" as string]: area.row,
                } as CSSProperties)
              : undefined;
            return (
              <div key={work.slug} className="work-card-wrap" style={style}>
                <WorkCard work={work} onOpen={openWork} sizes={area?.sizes} />
              </div>
            );
          })}
        </div>

        <div className="works-cta-wrap">
          <a href="#contact" className="works-cta">
            רוצים שגם העסק שלכם ייראה ככה? בואו נדבר <span aria-hidden>←</span>
          </a>
        </div>
      </div>

      <WorkModal work={currentWork} onClose={closeWork} />
    </section>
  );
}
