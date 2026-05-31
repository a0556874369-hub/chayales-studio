"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

// ===== הצהרת הזהות (טיפוגרפיה ענקית בצד שמאל) =====
const DECLARATION_LINES = [
  { text: "לא מעצבת.", accent: false },
  { text: "לא מפתחת.", accent: false },
  { text: "לא קופירייטרית.", accent: false },
  { text: "לא מומחית שיווק.", accent: false },
  { text: "כל הארבע.", accent: true }, // הפאנץ' - בטורקיז
];

// ===== הפסקאות =====
interface Paragraph {
  label: string;
  text: string;
}

const PARAGRAPHS: Paragraph[] = [
  {
    label: "מי אני",
    text: "מעצבת. מפתחת. כותבת קופי. מומחית שיווק. השילוב הזה נדיר - ובדיוק בגללו בעלי עסקים ונותני שירותים בוחרים בי במקום לרדוף אחרי כמה ספקים שכל אחד רואה רק חתיכה אחת מהתמונה.",
  },
  {
    label: "מה אני עושה אחרת",
    text: "האתרים שלי הם לא תבניות, קוד נקי אמיתי עם חוויה ופונקציונליות אמיתית. המודעות שלי עוצרות גלילה בדיגיטל ודפדוף בפרינט. והמיתוג שלי לא נראה כמו עוד לוגו - הוא נראה כמו העסק שלכם, בגרסה הכי טובה שלו.",
  },
  {
    label: "למה זה משנה",
    text: "כי עיצוב טוב הוא לא קישוט. הוא ההבדל בין עסק שמתעלמים ממנו לעסק שבוחרים בו.",
  },
  {
    label: "למי זה מתאים",
    text: "לעסקים ונותני שירות שמבינים שהנראות שלהם היא לא משהו שמטפלים בו \"אחר כך\". היא ההזדמנות הראשונה להגיד: אנחנו רציניים, מקצועיים, ושווים את הבחירה.",
  },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion() ?? false;

  const declarationRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const declarationInView = useInView(declarationRef, {
    once: true,
    margin: "-15% 0px -15% 0px",
  });
  const contentInView = useInView(contentRef, {
    once: true,
    margin: "-15% 0px -15% 0px",
  });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-section"
      aria-label="אודות"
      data-theme="light"
    >
      <div className="about-main-grid">
        {/* צד ימני בעברית - הטקסט המקצועי */}
        <div className="about-content" ref={contentRef}>
          <motion.h2
            className="about-headline"
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={
              contentInView
                ? { opacity: 1, y: 0 }
                : reduced
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            היי, אני חיה.
            <br />
            ואני בונה לעסקים נראות, אתר ומסר שעובדים יחד -{" "}
            <span className="about-headline-accent">לבד</span>.
          </motion.h2>

          <div className="about-paragraphs">
            {PARAGRAPHS.map((p, i) => (
              <motion.div
                key={p.label}
                className="about-paragraph"
                initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                animate={
                  contentInView
                    ? { opacity: 1, y: 0 }
                    : reduced
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 20 }
                }
                transition={{
                  duration: 0.7,
                  delay: reduced ? 0 : 0.3 + i * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span className="about-paragraph-label" aria-hidden>
                  {p.label}
                </span>
                <p className="about-paragraph-text">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* צד שמאלי - הטיפוגרפיה הענקית */}
        <div className="about-declaration" ref={declarationRef}>
          {DECLARATION_LINES.map((line, i) => (
            <motion.div
              key={line.text}
              className={`about-declaration-line ${
                line.accent ? "about-declaration-accent" : ""
              }`}
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
                delay: reduced ? 0 : 0.2 + i * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              aria-hidden={i < DECLARATION_LINES.length - 1}
            >
              {line.text}
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
