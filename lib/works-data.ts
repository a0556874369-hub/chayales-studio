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

// Case-study content driving the modal blocks and the card labels/CTA.
// kind "website" → rich modal: challenge block, bullet deliverables and a
// live link. kind "ad" → short modal: goal, one-line deliverable, no link.
// The card CTA text is derived from kind in WorkCard.
export type WorkKind = "website" | "ad";

export interface CaseStudy {
  kind: WorkKind;
  // Small category label on the grid card.
  category: string;
  // One-liner under the client name on the grid card.
  cardSubtitle: string;
  // Opening paragraph at the top of the modal.
  intro: string;
  // Optional role line rendered right under the intro (used by icansit).
  roleLine?: string;
  // "האתגר" (websites) / "המטרה" (ads) + its body text.
  challengeTitle: string;
  challenge: string;
  // Middle block: "מה בניתי" / "מה הובלתי" / "מה עיצבתי".
  middleTitle: string;
  // websites use a bullet list; ads use a single line.
  bullets?: string[];
  middleText?: string;
  whyItWorks: string;
  // websites only — opens in a new tab.
  liveUrl?: string;
}

export interface Work {
  slug: string;
  clientName: string;
  shortDescription: string;
  caseStudy: CaseStudy;
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
    slug: "bait-beklik",
    clientName: "בית בקליק",
    shortDescription: "פלטפורמה חכמה ונגישה ללא תיווך, מאפס בקוד נקי",
    caseStudy: {
      kind: "website",
      category: "פלטפורמה בקוד נקי",
      cardSubtitle:
        "פלטפורמת נדל״ן שנבנתה מאפס כדי להפוך חיפוש ופרסום נכסים לברורים, נגישים וללא תיווך.",
      intro:
        "בית בקליק - פלטפורמת נדל״ן שנבנתה מאפס כדי לחבר בין מפרסמי נכסים למחפשים - בצורה פשוטה, ברורה ונגישה.",
      challengeTitle: "האתגר",
      challenge:
        "לבנות פלטפורמת נדל״ן שלא מרגישה מסובכת: מקום שבו אפשר לחפש נכסים, לפרסם נכס, וליצור קשר ישיר - בלי עומס, בלי בלבול ובלי תיווך.",
      middleTitle: "מה בניתי",
      bullets: [
        "דף בית",
        "חיפוש נכסים לפי עיר, מחיר וחדרים",
        "טופס פרסום נכס",
        "יצירת קשר בוואטסאפ",
        "פאנל ניהול למפרסם",
        "פאנל ניהול אדמין",
      ],
      whyItWorks:
        "המערכת עושה סדר בתהליך שמטבעו יכול להיות עמוס: המחפש מבין מהר איך למצוא נכס רלוונטי, והמפרסם מקבל דרך ברורה להעלות ולנהל מודעה. זה לא רק אתר יפה - זו פלטפורמה שנבנתה סביב שימוש אמיתי.",
      liveUrl: "https://www.baitbclick.co.il/",
    },
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
    caseStudy: {
      kind: "website",
      category: "שיווק ופרונט-אנד מותאם",
      cardSubtitle:
        "נראות דיגיטלית למותג אורתופדי שפועל בישראל ובארה״ב - עם קופי, קריאייטיב וחוויית קנייה ברורה.",
      intro:
        "iCanSit - מותג אורתופדי שפועל בישראל ובארה״ב, עם נוכחות דיגיטלית שמחברת בין כאב אמיתי, אמון מקצועי וחוויית קנייה ברורה.",
      roleLine:
        "במסגרת העבודה שלי עם iCanSit אני מובילה את הנראות, הקופי, הקריאייטיב, הפרונט-אנד והדיגיטל של המותג.",
      challengeTitle: "האתגר",
      challenge:
        "לגרום למוצר אורתופדי להרגיש מקצועי ואמין, בלי להפוך אותו לקר או רפואי מדי - ובלי לאבד כוח מכירתי.",
      middleTitle: "מה הובלתי",
      bullets: [
        "קופי שיווקי ודפי מכירה",
        "פרונט-אנד מותאם בעמודי האתר",
        "מודעות, באנרים וקריאייטיבים",
        "חוויית קנייה ברורה סביב כאב, פתרון והנעה לפעולה",
      ],
      whyItWorks:
        "העיצוב והקופי עוזרים ללקוח להבין מהר למה המוצר רלוונטי אליו, למה אפשר לסמוך עליו, ואיך להתקדם לרכישה.",
      liveUrl: "https://icansit.co.il/",
    },
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
    slug: "olam-hatinok",
    clientName: "עולם התינוק",
    shortDescription: "סדרת קמפיינים לחנות תינוקות - 6 קמפיינים",
    caseStudy: {
      kind: "ad",
      category: "עיצוב וקריאייטיב",
      cardSubtitle: "שפה רכה ומזמינה לחנות מוצרי תינוקות.",
      intro: "עולם התינוק - שפה רכה ומזמינה לחנות מוצרי תינוקות.",
      challengeTitle: "המטרה",
      challenge: "לשדר חום, איכות ותחושת התחדשות עונתית.",
      middleTitle: "מה עיצבתי",
      middleText: "סדרת מודעות קמפיין בפלטה פסטלית רכה וקריאייטיב מזמין.",
      whyItWorks:
        "הרוך והניקיון גורמים למותג להרגיש איכותי וחם, בדיוק לקהל של הורים צעירים.",
    },
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
    slug: "krauss",
    clientName: "קרויס",
    shortDescription: "מותג כובעים פרימיום מעל 60 שנה - 4 קמפיינים",
    caseStudy: {
      kind: "ad",
      category: "עיצוב וקריאייטיב",
      cardSubtitle: "שפה יוקרתית למותג כובעים ותיק.",
      intro: "קרויס - שפה יוקרתית למותג כובעים ותיק.",
      challengeTitle: "המטרה",
      challenge: "לשדר פרימיום, מסורת ונוכחות.",
      middleTitle: "מה עיצבתי",
      middleText: "סדרת מודעות כהות, אלגנטיות וזכירות.",
      whyItWorks: "העיצוב נותן למותג תחושת עומק ויוקרה כבר במבט הראשון.",
    },
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
    slug: "dental",
    clientName: "דנטל",
    shortDescription: "חנות הלבשה משפחתית - 25 שנה של איכות",
    caseStudy: {
      kind: "ad",
      category: "עיצוב וקריאייטיב",
      cardSubtitle: "שפה מסודרת ומזמינה לחנות הלבשה משפחתית עם 25 שנות ותק.",
      intro: "דנטל - שפה מסודרת ומזמינה לחנות הלבשה משפחתית עם 25 שנות ותק.",
      challengeTitle: "המטרה",
      challenge: "להפוך מגוון רחב לכל המשפחה לתחושה רגועה ונגישה, לא עמוסה.",
      middleTitle: "מה עיצבתי",
      middleText:
        "מודעה בנויה כמו ארון מסודר, עם היררכיה צבעונית שמחלקת בין קהלי החנות.",
      whyItWorks:
        "הסדר הוויזואלי הופך \"הרבה\" ל\"קל לקלוט\" - בדיוק מה שחנות הלבשה משפחתית ותיקה רוצה לשדר.",
    },
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
    slug: "kinor",
    clientName: "כינור",
    shortDescription: "מותג אישי - מורה לכינור",
    caseStudy: {
      kind: "ad",
      category: "עיצוב וקריאייטיב",
      cardSubtitle: "שפה רגשית ואמנותית למורה פרטית לכינור.",
      intro: "כינור - שפה רגשית ואמנותית למורה פרטית לכינור.",
      challengeTitle: "המטרה",
      challenge: "לחבר רגש, אמנות ומקצועיות שמזמינה הורים.",
      middleTitle: "מה עיצבתי",
      middleText: "מודעה חמה עם נגיעות זהב ותחושת מוזיקה.",
      whyItWorks:
        "הטון הרגשי-אמנותי מדבר בדיוק לקהל שמחפש יותר משיעור טכני.",
    },
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
