"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ChatCircleDots,
  PaintBrush,
  Code,
  RocketLaunch,
  type Icon,
} from "@phosphor-icons/react";
import { useRef } from "react";

interface Stage {
  num: string;
  Icon: Icon;
  title: string;
  description: string;
}

const STAGES: Stage[] = [
  {
    num: "01",
    Icon: ChatCircleDots,
    title: "שיחת היכרות",
    description:
      "שיחה של 30 דקות. אני שומעת את הסיפור שלכם, את החלום, את הכאב. בלי התחייבות.",
  },
  {
    num: "02",
    Icon: PaintBrush,
    title: "מיתוג ושפה",
    description:
      "לוגו, צבעים, טיפוגרפיה, מצב רוח. הכל לפני שגוגלים שורת קוד אחת.",
  },
  {
    num: "03",
    Icon: Code,
    title: "פיתוח ועיצוב",
    description:
      "אתר, מודעות, או חבילה מלאה. כל אלמנט מתוכנן אישית, נבדק, מותאם.",
  },
  {
    num: "04",
    Icon: RocketLaunch,
    title: "עלייה לאוויר",
    description: "בודקים, משחררים, חוגגים. וגם אחרי - אני כאן בשבילכם.",
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // ===== תיקון לתנועה בעברית =====
  // הטראק יוצב עם dir="ltr" פנימי (סדר אחד עד ארבע משמאל לימין).
  // מתחילים עם הטראק זז כל הדרך שמאלה ככה שכרטיס 04 נראה ב-viewport (מצד ימין)?
  // לא - אנחנו רוצים את 01 ראשון, מימין.
  //
  // הפתרון הברור יותר:
  // - הטראק LTR, הכרטיסים מסודרים 01,02,03,04 משמאל לימין
  // - בהתחלה מציבים את הטראק עם x=-300vw (כל הטראק זז שמאלה ככה שכרטיס 04 נמצא ב-viewport)
  // - לא, זה גם לא עובד.
  //
  // הגישה הנכונה לעברית RTL:
  // - הטראק יישאר RTL (יורש מ-html)
  // - הסדר בקוד: 01,02,03,04 - וב-RTL הם מסתדרים מימין לשמאל
  // - בהתחלה x=0 -> רואים את 01 (הימני ביותר ב-RTL)
  // - לאחר גלילה אנחנו רוצים לראות את 02, 03, 04 - שנמצאים שמאלה מ-01
  // - אז ה-translateX חייב להיות **חיובי** כדי לדחוף את הטראק ימינה ולחשוף את הכרטיסים שמאל
  //
  // כמה? הטראק 400vw, כרטיס אחד 100vw. כדי לראות את כרטיס 4 צריך לדחוף את
  // הטראק ימינה ב-300vw = 75% מרוחב הטראק
  const trackX = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0%", "0%"] : ["0%", "75%"]
  );

  const timelineFill = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["100%", "100%"] : ["0%", "100%"]
  );

  return (
    <section
      id="process"
      ref={sectionRef}
      className="process-section"
      aria-label="תהליך עבודה - 4 שלבים"
    >
      <div className="process-sticky">
        <div className="process-header">
          <h2 className="process-headline">
            4 שלבים מהרעיון <span className="process-headline-accent">למותג חי.</span>
          </h2>
          <p className="process-subhead">
            תהליך מסודר, בלי הפתעות, עם הרבה אהבה לפרטים.
          </p>
        </div>

        <div className="process-timeline-wrap" aria-hidden>
          <div className="process-timeline-track" />
          <motion.div
            className="process-timeline-fill"
            style={{ width: timelineFill }}
          />
          <div className="process-timeline-dots">
            {STAGES.map((_, i) => (
              <div
                key={i}
                className="process-timeline-dot"
                style={{ right: `${(i / 3) * 100}%` }}
              />
            ))}
          </div>
        </div>

        <div className="process-cards-viewport">
          <motion.div
            className="process-cards-track"
            style={{ x: trackX }}
          >
            {STAGES.map((stage) => (
              <StageCard key={stage.num} stage={stage} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* מובייל - stack אנכי בלי pinning */}
      <div className="process-mobile-stack" aria-hidden="false">
        <div className="process-mobile-header">
          <h2 className="process-headline">
            4 שלבים מהרעיון <span className="process-headline-accent">למותג חי.</span>
          </h2>
          <p className="process-subhead">
            תהליך מסודר, בלי הפתעות, עם הרבה אהבה לפרטים.
          </p>
        </div>
        <div className="process-mobile-cards">
          {STAGES.map((stage) => (
            <StageCard key={stage.num} stage={stage} mobile />
          ))}
        </div>
      </div>
    </section>
  );
}

function StageCard({ stage, mobile = false }: { stage: Stage; mobile?: boolean }) {
  const { Icon: I } = stage;

  return (
    <article
      className={`process-card ${mobile ? "process-card-mobile" : ""}`}
      aria-label={`שלב ${stage.num}: ${stage.title}`}
    >
      <div className="process-card-halo" aria-hidden />

      <div className="process-card-icon-wrap" aria-hidden>
        <I size={56} weight="thin" color="#4DD8E5" />
      </div>

      <span className="process-card-num" aria-hidden>
        {stage.num}
      </span>

      <h3 className="process-card-title">{stage.title}</h3>
      <p className="process-card-desc">{stage.description}</p>
    </article>
  );
}
