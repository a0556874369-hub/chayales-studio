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

// ===== 3 העקרונות =====
interface Principle {
  num: string;
  text: string;
}

const PRINCIPLES: Principle[] = [
  {
    num: "01",
    text: "עיצוב טוב = עיצוב יפה שעובד.",
  },
  {
    num: "02",
    text: "לכל מותג שפה ויזואלית משלו. לא תבנית של מישהו אחר.",
  },
  {
    num: "03",
    text: "כל מותג ראוי לוואריאציה הכי מושלמת שלו.",
  },
];

// ===== הפסקאות =====
interface Paragraph {
  label: string;
  text: string;
}

const PARAGRAPHS: Paragraph[] = [
  {
    label: "מי אני",
    text: "אני מעצבת. אני מפתחת. אני כותבת קופי. אני מומחית שיווק. השילוב הזה הוא נדיר - ובדיוק בגללו עסקים בוחרים לעבוד איתי במקום לרדוף אחרי 5 ספקים שונים שאף אחד מהם לא באמת מבין לעומק את העסק שלהם.",
  },
  {
    label: "מה אני עושה אחרת",
    text: "האתרים שאני בונה הם לא תבניות מותאמות - הם בקוד נקי אמיתי, עם אפשרויות פונקציונליות של אפליקציות. המודעות שאני מעצבת עוצרות גלילה בדיגיטל ודפדוף בפרינט. המיתוג שאני בונה לא נראה כמו עוד לוגו - הוא נראה כמו עצמכם בוואריאציה הכי מדהימה שלו.",
  },
  {
    label: "למי זה מתאים",
    text: "אם אתם עסק שמבין שעיצוב, אתר, ומיתוג הם הזדמנות (ראשונה ואחרונה) להגיד 'אנחנו רציניים' - הסטודיו הזה בנוי בשבילכם. אם אתם רוצים לדבר עם בן אדם אחד שמבין את הכל ומבצע את הכל - בדיוק בשביל זה הקמתי אותו.",
  },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion() ?? false;

  const declarationRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const principlesRef = useRef<HTMLDivElement | null>(null);

  const declarationInView = useInView(declarationRef, {
    once: true,
    margin: "-15% 0px -15% 0px",
  });
  const contentInView = useInView(contentRef, {
    once: true,
    margin: "-15% 0px -15% 0px",
  });
  const principlesInView = useInView(principlesRef, {
    once: true,
    margin: "-10% 0px -10% 0px",
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
            אני חיה. ואני בונה{" "}
            <span className="about-headline-accent">מותגים שלמים</span>{" "}
            מההתחלה - לבד.
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

      {/* 3 העקרונות - חוצים את כל הסקשן */}
      <div className="about-principles-wrap" ref={principlesRef}>
        <div className="about-principles-divider" aria-hidden />
        <div className="about-principles-grid">
          {PRINCIPLES.map((p, i) => (
            <motion.article
              key={p.num}
              className="about-principle"
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              animate={
                principlesInView
                  ? { opacity: 1, y: 0 }
                  : reduced
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 24 }
              }
              transition={{
                duration: 0.7,
                delay: reduced ? 0 : 0.2 + i * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="about-principle-halo" aria-hidden />
              <span className="about-principle-num" aria-hidden>
                {p.num}
              </span>
              <p className="about-principle-text">{p.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
