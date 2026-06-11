"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// ============================================
// Section 02b — PAS (הבעיה → ההחרפה → הפתרון)
// כהה, יושב בין לפני/אחרי לעבודות בתוך DarkToLightWrap.
// מנגנון נעוץ כמו ב-Process: הסקשן 300vh, התוכן sticky,
// ציר הזמן מתמלא והטראק האופקי זז לפי הגלילה.
// ============================================
interface PasStep {
  num: string;
  title: string;
  description: string;
}

const STEPS: PasStep[] = [
  {
    num: "01",
    title: "ההמלצה נעצרת בגוגל",
    description:
      "ממליצים עליכם. הם מחפשים את השם - ומוצאים דף פייסבוק מ-2019. או את המתחרה עם האתר.",
  },
  {
    num: "02",
    title: "את ההפסד הזה לא רואים",
    description:
      "הלקוח שלא התקשר לא משאיר עקבות. כל חודש בלי נוכחות - עוד כמה שסגרו במקום אחר.",
  },
  {
    num: "03",
    title: "ואז בוחרים בכם",
    description:
      "כאן אני נכנסת - אתר שבנוי סביבכם, מורגש מהשנייה הראשונה. מהיר, חד, ולא דומה לאף אחד. זה מה שגורם להם לעצור דווקא אצלכם.",
  },
];

function PasHeader() {
  return (
    <div className="pas-header">
      <span className="pas-kicker">המצב בשטח</span>
      <h2 className="pas-headline">
        ככה מאבדים לקוח -{" "}
        <span className="pas-headline-accent">בלי בכלל לדעת.</span>
      </h2>
    </div>
  );
}

function StepCard({ step }: { step: PasStep }) {
  return (
    <article className="pas-card" aria-label={`${step.num}: ${step.title}`}>
      <div className="pas-card-halo" aria-hidden />
      <span className="pas-card-num" aria-hidden>
        {step.num}
      </span>
      <h3 className="pas-card-title">{step.title}</h3>
      <p className="pas-card-desc">{step.description}</p>
    </article>
  );
}

export default function PasSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // אותה גישת RTL כמו ב-Process: הטראק יורש כיוון מ-html, הכרטיסים
  // 01,02,03 מסתדרים מימין לשמאל, ו-translateX חיובי דוחף את הטראק
  // ימינה וחושף את הכרטיסים שמשמאל.
  // הסלייד 75vw (לא 100vw) כדי שהשכנים יציצו מהצדדים ולא יישאר חלל
  // גדול במרכז. הטראק 225vw, וב-RTL הקצה הימני שלו נצמד לקצה הימני
  // של ה-viewport — לכן מרכוז כרטיס 01 דורש הסטה שמאלה של
  // (100vw-75vw)/2 = -12.5vw = -5.556% מהטראק; כרטיס 03 דורש דחיפה
  // ימינה של עוד 150vw, סה"כ +137.5vw = 61.111%.
  const trackX = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["-5.556%", "-5.556%"] : ["-5.556%", "61.111%"]
  );

  const timelineFill = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["100%", "100%"] : ["0%", "100%"]
  );

  return (
    <section
      id="pas"
      ref={sectionRef}
      className="pas-section"
      aria-label="ככה מאבדים לקוח"
    >
      <div className="pas-sticky">
        <PasHeader />

        <div className="pas-timeline-wrap" aria-hidden>
          <div className="pas-timeline-track" />
          <motion.div
            className="pas-timeline-fill"
            style={{ width: timelineFill }}
          />
          <div className="pas-timeline-dots">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="pas-timeline-dot"
                style={{ right: `${(i / 2) * 100}%` }}
              />
            ))}
          </div>
        </div>

        <div className="pas-cards-viewport">
          <motion.div className="pas-cards-track" style={{ x: trackX }}>
            {STEPS.map((step) => (
              <div key={step.num} className="pas-slide">
                <StepCard step={step} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* מובייל - stack אנכי בלי pinning */}
      <div className="pas-mobile-stack" aria-hidden="false">
        <PasHeader />
        <div className="pas-mobile-cards">
          {STEPS.map((step) => (
            <StepCard key={step.num} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}
