"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

// ===== שכבה 1: ההכרזה (הגיבור) =====
const STRIKE_LINES = [
  "לא מעצבת.",
  "לא מפתחת.",
  "לא קופירייטרית.",
  "לא מומחית שיווק.",
];
const PUNCH = "כל הארבע.";
const DECLARATION_SUBLINE =
  "ארבעה מקצועות נכנסים לכל פרויקט. כשכולם אצל אדם אחד - שום שלב לא נופל בין הכיסאות.";

// ===== שכבה 3: ארבע הנקודות =====
interface Point {
  title: string;
  desc: string;
}

const POINTS: Point[] = [
  {
    title: "אסטרטגיה לפני צבעים.",
    desc: "קודם למה שיבחרו בכם, ואז איך זה ייראה.",
  },
  {
    title: "קוד נקי, לא תבניות.",
    desc: "חוויה ופונקציונליות אמיתית, בלי להתכופף למבנה מוכן.",
  },
  {
    title: "מודעות שעוצרות.",
    desc: "גלילה בדיגיטל, דפדוף בפרינט.",
  },
  {
    title: "מיתוג שנראה כמו העסק שלכם.",
    desc: "לא עוד לוגו יפה - הגרסה הכי טובה שלו.",
  },
];

// ===== תזמון קווי המחיקה (ללא שינוי) =====
const STRIKE_BASE = 0.2; // השהיה לפני הקו הראשון
const STRIKE_STAGGER = 0.16; // סטגר בין שורה לשורה
const STRIKE_DUR = 0.55; // משך מתיחת קו
// "כל הארבע" נוחתת אחרי שכל הקווים נמתחו
const PUNCH_DELAY =
  STRIKE_BASE + (STRIKE_LINES.length - 1) * STRIKE_STAGGER + STRIKE_DUR + 0.15;
const SUBLINE_DELAY = PUNCH_DELAY + 0.35;

const SMOOTH = [0.65, 0, 0.35, 1] as const;
const SOFT = [0.22, 1, 0.36, 1] as const;

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion() ?? false;

  const declarationRef = useRef<HTMLDivElement | null>(null);
  const lowerRef = useRef<HTMLDivElement | null>(null);

  const declarationInView = useInView(declarationRef, {
    once: true,
    margin: "-15% 0px -15% 0px",
  });
  const lowerInView = useInView(lowerRef, {
    once: true,
    margin: "-15% 0px -10% 0px",
  });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-section"
      aria-label="אודות"
      data-theme="light"
    >
      {/* שכבה 1 - ההכרזה כגיבורה, ממורכזת, עם אוויר נדיב מסביב */}
      <div className="about-declaration" ref={declarationRef}>
        <div className="about-declaration-lines">
          {STRIKE_LINES.map((text, i) => (
            <div key={text} className="about-declaration-line">
              <span className="about-declaration-text">{text}</span>
              {!reduced && (
                <motion.span
                  className="about-strike"
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  animate={declarationInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{
                    duration: STRIKE_DUR,
                    delay: STRIKE_BASE + i * STRIKE_STAGGER,
                    ease: SMOOTH,
                  }}
                />
              )}
            </div>
          ))}

          <motion.div
            className="about-declaration-line about-declaration-accent"
            initial={
              reduced
                ? { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }
                : { opacity: 0, y: 40, clipPath: "inset(0% 0% 100% 0%)" }
            }
            animate={
              declarationInView
                ? { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }
                : reduced
                ? { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }
                : { opacity: 0, y: 40, clipPath: "inset(0% 0% 100% 0%)" }
            }
            transition={{
              duration: 0.8,
              delay: reduced ? 0 : PUNCH_DELAY,
              ease: SOFT,
            }}
          >
            {PUNCH}
          </motion.div>
        </div>

        <motion.p
          className="about-declaration-subline"
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          animate={
            declarationInView
              ? { opacity: 1, y: 0 }
              : reduced
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 16 }
          }
          transition={{
            duration: 0.7,
            delay: reduced ? 0 : SUBLINE_DELAY,
            ease: SOFT,
          }}
        >
          {DECLARATION_SUBLINE}
        </motion.p>
      </div>

      {/* שכבות 2+3 - גשר וארבע הנקודות */}
      <div className="about-lower" ref={lowerRef}>
        <motion.h2
          className="about-intro"
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={
            lowerInView
              ? { opacity: 1, y: 0 }
              : reduced
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.7, ease: SOFT }}
        >
          היי, אני חיה. ואני בונה לעסקים נראות, אתר ומסר שעובדים יחד -{" "}
          <span className="about-intro-strong">לבד</span>.
        </motion.h2>

        <div className="about-points">
          {POINTS.map((p, i) => (
            <motion.div
              key={p.title}
              className="about-point"
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={
                lowerInView
                  ? { opacity: 1, y: 0 }
                  : reduced
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 20 }
              }
              transition={{
                duration: 0.6,
                delay: reduced ? 0 : 0.3 + i * 0.1,
                ease: SOFT,
              }}
            >
              <h3 className="about-point-title">{p.title}</h3>
              <p className="about-point-desc">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
