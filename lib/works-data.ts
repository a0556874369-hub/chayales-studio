// Data for the "עבודות נבחרות" (Selected Works) section.
// Order in this array drives the visual reading order; bento grid positions
// are assigned in WorksSection.tsx by slug.
// All image paths are relative to /public.
// aspectRatio values reflect the REAL pixel ratio of the gridImage on disk
// (read once with node + PNG IHDR). Mobile uses this for layout-shift-free
// rendering at object-contain.

export interface WorkImage {
  src: string;
  alt: string;
}

export interface LogoComparison {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
}

export interface Work {
  slug: string;
  clientName: string;
  shortDescription: string;
  // Aspect ratio of gridImage as "w/h" (e.g. "16/10"). Used by CSS aspect-ratio.
  aspectRatio: string;
  // Image shown in the grid card.
  gridImage: WorkImage;
  // Additional images shown inside the modal (after the grid/highlight/compare
  // slides). De-duped against gridImage in the modal slide builder.
  modalImages: WorkImage[];
  // Optional short note rendered under the modal stage.
  modalNote?: string;
  // Optional before/after logo comparison (used by dental).
  logoComparison?: LogoComparison;
  // Optional highlight image rendered with special treatment (used by kinor).
  highlightImage?: WorkImage;
}

export const works: Work[] = [
  {
    slug: "krauss",
    clientName: "קרויס",
    shortDescription: "מותג כובעים פרימיום מעל 60 שנה - 4 קמפיינים",
    // 1414 × 2000 → tall portrait
    aspectRatio: "1414 / 2000",
    gridImage: {
      src: "/portfolio/krauss/01-main.png",
      alt: "מודעת קרויס - וילון זהב על רקע כהה",
    },
    modalImages: [
      {
        src: "/portfolio/krauss/01-main.png",
        alt: "מודעת קרויס ראשית - וילון זהב",
      },
      { src: "/portfolio/krauss/02.png", alt: "וריאציית מודעה - קרויס" },
      { src: "/portfolio/krauss/03.png", alt: "וריאציית מודעה - קרויס" },
      { src: "/portfolio/krauss/04.png", alt: "וריאציית מודעה - קרויס" },
    ],
  },
  {
    slug: "bait-beklik",
    clientName: "בית בקליק",
    shortDescription: "פלטפורמה חכמה ונגישה ללא תיווך, מאפס בקוד נקי",
    // 1912 × 870 → ultra-wide hero
    aspectRatio: "1912 / 870",
    gridImage: {
      src: "/portfolio/bait-beklik/01-hero.png",
      alt: "בית בקליק - דף הבית של הפלטפורמה",
    },
    modalImages: [
      { src: "/portfolio/bait-beklik/01-hero.png", alt: "בית בקליק - דף הבית" },
      { src: "/portfolio/bait-beklik/02-admin.png", alt: "בית בקליק - פאנל ניהול" },
      {
        src: "/portfolio/bait-beklik/03-publisher.png",
        alt: "בית בקליק - פאנל מפרסם",
      },
      { src: "/portfolio/bait-beklik/04-form.png", alt: "בית בקליק - טופס פנייה" },
    ],
    modalNote: "מותאמת למובייל בצורה מלאה",
  },
  {
    slug: "icansit",
    clientName: "iCanSit",
    shortDescription: "כרית אורתופדית למותג בינלאומי - אתר, מיתוג וניהול דיגיטלי מלא",
    // 1900 × 850 → ultra-wide hero
    aspectRatio: "1900 / 850",
    gridImage: {
      src: "/portfolio/icansit/01-hero.png",
      alt: "iCanSit - דף נחיתה ראשי",
    },
    modalImages: [
      { src: "/portfolio/icansit/01-hero.png", alt: "iCanSit - דף נחיתה" },
      { src: "/portfolio/icansit/02-product.png", alt: "iCanSit - מוצר" },
      { src: "/portfolio/icansit/03-banner.png", alt: "iCanSit - באנר קמפיין" },
    ],
  },
  {
    slug: "dental",
    clientName: "דנטל",
    shortDescription: "חנות הלבשה משפחתית - 25 שנה של איכות",
    // 1410 × 2000 → tall portrait
    aspectRatio: "1410 / 2000",
    gridImage: {
      src: "/portfolio/dental/01-main.png",
      alt: "דנטל - מותג ויזואלי",
    },
    modalImages: [{ src: "/portfolio/dental/01-main.png", alt: "דנטל - מותג ויזואלי" }],
    logoComparison: {
      beforeSrc: "/portfolio/dental/logo-old.png",
      afterSrc: "/portfolio/dental/logo-new.png",
      beforeAlt: "דנטל - לוגו ישן",
      afterAlt: "דנטל - לוגו חדש",
    },
  },
  {
    slug: "olam-hatinok",
    clientName: "עולם התינוק",
    shortDescription: "סדרת קמפיינים לחנות תינוקות - 6 קמפיינים",
    // 1318 × 2000 → tall portrait
    aspectRatio: "1318 / 2000",
    gridImage: {
      src: "/portfolio/olam-hatinok/01-main.png",
      alt: "עולם התינוק - מודעה ראשית",
    },
    modalImages: [
      {
        src: "/portfolio/olam-hatinok/01-main.png",
        alt: "עולם התינוק - מודעה ראשית",
      },
      { src: "/portfolio/olam-hatinok/02.png", alt: "עולם התינוק - וריאציה" },
      { src: "/portfolio/olam-hatinok/03.png", alt: "עולם התינוק - וריאציה" },
      { src: "/portfolio/olam-hatinok/04.png", alt: "עולם התינוק - וריאציה" },
      { src: "/portfolio/olam-hatinok/05.png", alt: "עולם התינוק - וריאציה" },
      { src: "/portfolio/olam-hatinok/06.png", alt: "עולם התינוק - וריאציה" },
    ],
    modalNote: "קמפיין Bugaboo - שפה אחידה לסדרה של שש מודעות עוקבות.",
  },
  {
    slug: "kinor",
    clientName: "כינור",
    shortDescription: "מותג אישי - מורה לכינור",
    // 1712 × 1299 → landscape
    aspectRatio: "1712 / 1299",
    gridImage: {
      src: "/portfolio/kinor/01-main.png",
      alt: "כינור - מותג ויזואלי",
    },
    modalImages: [
      { src: "/portfolio/kinor/logo-2d.png", alt: "כינור - לוגו 2D" },
      { src: "/portfolio/kinor/logo-3d.png", alt: "כינור - לוגו 3D" },
    ],
    highlightImage: {
      src: "/portfolio/kinor/01-main.png",
      alt: "כינור - קומפוזיציה ראשית",
    },
  },
];

// Build the modal slide sequence per spec:
//   1) gridImage (default treatment)
//   2) highlightImage (special: glow + float) — always added if present
//   3) logoComparison (single side-by-side slide)
//   4) modalImages — deduped against gridImage.src
// The badge counter on the card uses the visible-images count:
//   grid(1) + highlight(1 if present) + logoCompare(2 if present)
//   + unique modal images (deduped from gridImage)
export type Slide =
  | { kind: "image"; src: string; alt: string }
  | {
      kind: "highlight";
      src: string;
      alt: string;
    }
  | {
      kind: "logoCompare";
      beforeSrc: string;
      afterSrc: string;
      beforeAlt: string;
      afterAlt: string;
    };

export function buildSlides(work: Work): Slide[] {
  const slides: Slide[] = [];
  slides.push({ kind: "image", src: work.gridImage.src, alt: work.gridImage.alt });
  if (work.highlightImage) {
    slides.push({
      kind: "highlight",
      src: work.highlightImage.src,
      alt: work.highlightImage.alt,
    });
  }
  if (work.logoComparison) {
    slides.push({
      kind: "logoCompare",
      beforeSrc: work.logoComparison.beforeSrc,
      afterSrc: work.logoComparison.afterSrc,
      beforeAlt: work.logoComparison.beforeAlt,
      afterAlt: work.logoComparison.afterAlt,
    });
  }
  for (const img of work.modalImages) {
    if (img.src === work.gridImage.src) continue; // dedup against grid only
    slides.push({ kind: "image", src: img.src, alt: img.alt });
  }
  return slides;
}

export function countImages(work: Work): number {
  let count = 1; // gridImage
  if (work.highlightImage) count += 1;
  if (work.logoComparison) count += 2;
  for (const img of work.modalImages) {
    if (img.src === work.gridImage.src) continue;
    count += 1;
  }
  return count;
}
