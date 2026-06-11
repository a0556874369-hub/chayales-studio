"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

// ============================================
// Section 02b — PAS (הבעיה → ההחרפה → הפתרון)
// כהה, יושב בין לפני/אחרי לעבודות בתוך DarkToLightWrap.
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
      "אתר שבנוי סביבכם, ומורגש מהשנייה הראשונה. מהיר, חד, ולא דומה לאף אחד. זה מה שגורם להם לעצור דווקא אצלכם.",
  },
];

export default function PasSection() {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  const reduced = useReducedMotion() ?? false;
  const headerInView = useInView(headerRef, {
    once: true,
    margin: "-15% 0px -15% 0px",
  });
  const cardsInView = useInView(cardsRef, {
    once: true,
    margin: "-10% 0px -10% 0px",
  });

  return (
    <section
      id="pas"
      className="pas-section"
      aria-label="ככה מאבדים לקוח"
    >
      <div className="pas-header" ref={headerRef}>
        <motion.span
          className="pas-kicker"
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          animate={
            headerInView
              ? { opacity: 1, y: 0 }
              : reduced
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 16 }
          }
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          המצב בשטח
        </motion.span>
        <motion.h2
          className="pas-headline"
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={
            headerInView
              ? { opacity: 1, y: 0 }
              : reduced
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          ככה מאבדים לקוח -{" "}
          <span className="pas-headline-accent">בלי בכלל לדעת.</span>
        </motion.h2>
      </div>

      <div className="pas-grid" ref={cardsRef}>
        {STEPS.map((step, i) => (
          <motion.article
            key={step.num}
            className="pas-card"
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={
              cardsInView
                ? { opacity: 1, y: 0 }
                : reduced
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            transition={{
              duration: 0.6,
              delay: reduced ? 0 : 0.3 + i * 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            aria-label={`${step.num}: ${step.title}`}
          >
            <div className="pas-card-halo" aria-hidden />
            <span className="pas-card-num" aria-hidden>
              {step.num}
            </span>
            <h3 className="pas-card-title">{step.title}</h3>
            <p className="pas-card-desc">{step.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
