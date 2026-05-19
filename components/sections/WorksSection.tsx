"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { works } from "@/lib/works-data";
import WorkCard from "@/components/works/WorkCard";

// Heavy modal — load only when first opened. SSR off because it uses portals.
const WorkModal = dynamic(() => import("@/components/works/WorkModal"), {
  ssr: false,
});

// Bento positions per slug. RTL is set on the grid container; column 1 is
// the right-most column in RTL flow.
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
      <div className="works-content">
        <h2 className="works-headline">
          כל עבודה - שפה משלה, מותג שלם.
        </h2>
        <p className="works-subhead">
          לא קולקציה של עבודות. גלריית מותגים שלא מדפדפים לידם.
        </p>

        <div className="works-grid" dir="rtl">
          {works.map((work, i) => (
            <WorkCard
              key={work.slug}
              work={work}
              index={i}
              onOpen={openWork}
              desktopArea={BENTO_POSITIONS[work.slug]}
            />
          ))}
        </div>

        <div className="works-cta-wrap">
          <a href="#contact" className="works-cta">
            צרו איתי קשר לפרויקט שלכם <span aria-hidden>←</span>
          </a>
        </div>
      </div>

      <WorkModal work={currentWork} onClose={closeWork} />
    </section>
  );
}
