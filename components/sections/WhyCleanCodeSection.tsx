"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// 5 היתרונות - לפי הסדר החדש: גמישות → מהירות → ייחודיות → SEO → אנימציות
interface Advantage {
  num: string;       // 01, 02...
  title: string;
  description: string;
}

const ADVANTAGES: Advantage[] = [
  {
    num: "01",
    title: "גמישות מלאה",
    description: "רוצים פיצ'ר חדש? אנחנו בונים אותו. בלי לחפש פלאגין שיעשה את זה במקום, בלי 'אי אפשר בתבנית'.",
  },
  {
    num: "02",
    title: "מהירות",
    description: "אתר בקוד נקי טוען פי 5 מאתר על תבנית גנרית. גוגל אוהב את זה. הלקוחות שלכם עוד יותר.",
  },
  {
    num: "03",
    title: "ייחודיות",
    description: "אין עוד אתר בעולם שנראה כמוכם. כי בנינו אותו רק בשבילכם, מהפיקסל הראשון.",
  },
  {
    num: "04",
    title: "SEO מובנה",
    description: "קוד נקי בנוי ל-SEO מהיסוד. בלי תוספים, בלי קונפליקטים, בלי 'מה לא עובד היום?'.",
  },
  {
    num: "05",
    title: "אנימציות מותאמות",
    description: "כל מעבר, כל hover, כל גלילה - מתוכננים אישית. לא אופציה אקראית מתפריט תבניות.",
  },
];

// ===== כותרת עם הדפסה תו-תו =====
function TypewriterHeadline({
  text,
  startDelay,
  inView,
  reduced,
  speedPerChar = 0.035,
  className,
  asElement = "h2",
  ariaLabel,
  cursorClass,
}: {
  text: string;
  startDelay: number;
  inView: boolean;
  reduced: boolean;
  speedPerChar?: number;
  className?: string;
  asElement?: "h2" | "p";
  ariaLabel?: string;
  cursorClass?: string;
}) {
  const [revealed, setRevealed] = useState(reduced ? text.length : 0);

  useEffect(() => {
    if (reduced) {
      setRevealed(text.length);
      return;
    }
    if (!inView) {
      setRevealed(0);
      return;
    }
    const startTimeout = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current++;
        setRevealed(current);
        if (current >= text.length) clearInterval(interval);
      }, speedPerChar * 1000);
      return () => clearInterval(interval);
    }, startDelay * 1000);
    return () => clearTimeout(startTimeout);
  }, [inView, reduced, startDelay, speedPerChar, text]);

  const visible = text.substring(0, revealed);
  const showCursor = revealed > 0 && revealed < text.length;

  const Element = asElement;
  return (
    <Element className={className} aria-label={ariaLabel ?? text}>
      <span aria-hidden>{visible}</span>
      {showCursor && (
        <span className={`why-cursor ${cursorClass ?? ""}`} aria-hidden>
          |
        </span>
      )}
    </Element>
  );
}

// ===== כרטיס יתרון יחיד =====
function AdvantageCard({
  advantage,
  index,
  inView,
  reduced,
  position,
}: {
  advantage: Advantage;
  index: number;
  inView: boolean;
  reduced: boolean;
  position: "top" | "bottom";
}) {
  const cardDelay = reduced ? 0 : 0.4 + index * 0.12;

  return (
    <motion.article
      className={`why-card why-card-${position}`}
      initial={reduced ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.96 }}
      animate={
        inView
          ? { opacity: 1, y: 0, scale: 1 }
          : reduced
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 30, scale: 0.96 }
      }
      transition={{
        duration: 0.7,
        delay: cardDelay,
        ease: [0.22, 1, 0.36, 1],
      }}
      aria-label={`יתרון ${advantage.num}: ${advantage.title}`}
    >
      <div className="why-card-inner">
        <span className="why-card-num" aria-hidden>
          {advantage.num}
        </span>
        <h3 className="why-card-title">{advantage.title}</h3>
        <p className="why-card-desc">{advantage.description}</p>
      </div>
    </motion.article>
  );
}

// ===== הסקשן הראשי =====
export default function WhyCleanCodeSection() {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const arrangementRef = useRef<HTMLDivElement | null>(null);
  const closingRef = useRef<HTMLDivElement | null>(null);

  const reduced = useReducedMotion() ?? false;
  const headerInView = useInView(headerRef, {
    once: true,
    margin: "-15% 0px -15% 0px",
  });
  const arrangementInView = useInView(arrangementRef, {
    once: true,
    margin: "-10% 0px -10% 0px",
  });
  const closingInView = useInView(closingRef, {
    once: true,
    margin: "-20% 0px -20% 0px",
  });

  // כותרות
  const headlinePart1 = "למה לא וורדפרס? למה לא ויקס?";
  const headlinePart2 = "כי הם לא מספיקים.";
  const subhead = "5 סיבות שאתר בקוד נקי הוא לא מותרות - הוא הכרח.";
  const closingLine = "אתר שמשרת אתכם. לא להפך.";

  // טיימינג
  const headline1Duration = headlinePart1.length * 0.035;
  const headline2Start = 0.1 + headline1Duration + 0.2;
  const headline2Duration = headlinePart2.length * 0.045;
  const subheadStart = headline2Start + headline2Duration + 0.3;

  return (
    <section
      id="why-clean-code"
      className="why-section"
      aria-label="למה קוד נקי"
      data-theme="light"
    >
      {/* כותרת ראשית עם הדפסה */}
      <div className="why-header" ref={headerRef}>
        <TypewriterHeadline
          text={headlinePart1}
          startDelay={0.1}
          inView={headerInView}
          reduced={reduced}
          speedPerChar={0.035}
          className="why-headline why-headline-part1"
          asElement="h2"
          ariaLabel={`${headlinePart1} ${headlinePart2}`}
          cursorClass="why-cursor-headline"
        />
        <TypewriterHeadline
          text={headlinePart2}
          startDelay={headline2Start}
          inView={headerInView}
          reduced={reduced}
          speedPerChar={0.045}
          className="why-headline why-headline-part2"
          asElement="h2"
          ariaLabel=""
          cursorClass="why-cursor-headline"
        />
        <TypewriterHeadline
          text={subhead}
          startDelay={subheadStart}
          inView={headerInView}
          reduced={reduced}
          speedPerChar={0.025}
          className="why-subhead"
          asElement="p"
          cursorClass="why-cursor-subhead"
        />
      </div>

      {/* הסידור הקשתי - 3 למעלה, 2 למטה. במרכז ה-Orb הגלובלי גלוי דרך הרווח */}
      <div className="why-arrangement" ref={arrangementRef}>
        {/* קשת עליונה - 3 כרטיסים */}
        <div className="why-arc why-arc-top">
          <AdvantageCard
            advantage={ADVANTAGES[1]}
            index={1}
            inView={arrangementInView}
            reduced={reduced}
            position="top"
          />
          <AdvantageCard
            advantage={ADVANTAGES[0]}
            index={0}
            inView={arrangementInView}
            reduced={reduced}
            position="top"
          />
          <AdvantageCard
            advantage={ADVANTAGES[2]}
            index={2}
            inView={arrangementInView}
            reduced={reduced}
            position="top"
          />
        </div>

        {/* מרכז - מקום ל-Orb. ריק. */}
        <div className="why-orb-space" aria-hidden />

        {/* קשת תחתונה - 2 כרטיסים */}
        <div className="why-arc why-arc-bottom">
          <AdvantageCard
            advantage={ADVANTAGES[3]}
            index={3}
            inView={arrangementInView}
            reduced={reduced}
            position="bottom"
          />
          <AdvantageCard
            advantage={ADVANTAGES[4]}
            index={4}
            inView={arrangementInView}
            reduced={reduced}
            position="bottom"
          />
        </div>
      </div>

      {/* שורת סגירה - פאנץ' */}
      <div className="why-closing" ref={closingRef}>
        <motion.div
          className="why-closing-divider"
          initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
          animate={
            closingInView
              ? { scaleX: 1 }
              : reduced
              ? { scaleX: 1 }
              : { scaleX: 0 }
          }
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          aria-hidden
        />
        <motion.p
          className="why-closing-text"
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={
            closingInView
              ? { opacity: 1, y: 0 }
              : reduced
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {closingLine}
        </motion.p>
        <motion.div
          className="why-closing-divider"
          initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
          animate={
            closingInView
              ? { scaleX: 1 }
              : reduced
              ? { scaleX: 1 }
              : { scaleX: 0 }
          }
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          aria-hidden
        />
      </div>
    </section>
  );
}
