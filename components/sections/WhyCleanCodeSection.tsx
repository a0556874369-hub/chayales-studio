"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ============================================
// קוביות מתארגנות לכרטיס הגיבור
// ============================================
interface CubeState {
  id: number;
  col: number;
  row: number;
  size: number;
  rotation: number;
  opacity: number;
}

const BASE_CUBES: CubeState[] = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  col: i % 3,
  row: Math.floor(i / 3),
  size: 1,
  rotation: 0,
  opacity: 0.85,
}));

function generateVariant(seed: number): CubeState[] {
  return BASE_CUBES.map((cube) => {
    const offset = (cube.id + seed * 7) % 9;
    const isHighlighted = offset < 3;
    return {
      ...cube,
      size: isHighlighted ? (offset === 0 ? 1.35 : offset === 1 ? 0.65 : 1.1) : 0.9,
      rotation: isHighlighted ? (offset === 0 ? 6 : offset === 1 ? -7 : 3) : 0,
      opacity: isHighlighted ? (offset === 0 ? 1 : offset === 1 ? 0.55 : 0.85) : 0.7,
    };
  });
}

function CubesGrid({ reduced }: { reduced: boolean }) {
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => {
      setSeed((s) => s + 1);
    }, 2800);
    return () => clearInterval(interval);
  }, [reduced]);

  const cubes = generateVariant(seed);

  return (
    <div className="cubes-grid" aria-hidden>
      {cubes.map((cube) => (
        <motion.div
          key={cube.id}
          className="cube"
          animate={
            reduced
              ? { opacity: 0.8, scale: 1, rotate: 0 }
              : {
                  opacity: cube.opacity,
                  scale: cube.size,
                  rotate: cube.rotation,
                }
          }
          transition={{
            duration: 1.6,
            ease: [0.22, 1, 0.36, 1],
            opacity: { duration: 1.2 },
          }}
          style={{
            gridColumn: cube.col + 1,
            gridRow: cube.row + 1,
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// היתרונות
// ============================================
interface Advantage {
  num: string;
  title: string;
  description: string;
}

const HERO_ADVANTAGE: Advantage = {
  num: "01",
  title: "גמישות מלאה",
  description:
    "רוצים פיצ'ר חדש? אנחנו בונים אותו. בלי לחפש פלאגין שיעשה את זה במקום, בלי 'אי אפשר בתבנית', בלי פשרות.",
};

const SUPPORTING_ADVANTAGES: Advantage[] = [
  {
    num: "02",
    title: "מהירות",
    description: "אתר בקוד נקי טוען פי 5 מתבנית גנרית. גוגל אוהב את זה. הלקוחות עוד יותר.",
  },
  {
    num: "03",
    title: "ייחודיות",
    description: "אין עוד אתר בעולם שנראה כמוכם. בנינו אותו רק בשבילכם, מהפיקסל הראשון.",
  },
  {
    num: "04",
    title: "SEO מובנה",
    description: "בנוי ל-SEO מהיסוד. בלי תוספים, בלי קונפליקטים, בלי 'מה לא עובד היום?'.",
  },
  {
    num: "05",
    title: "אנימציות אישיות",
    description: "כל מעבר, כל hover, כל גלילה - מתוכננים אישית. לא אופציה מתפריט.",
  },
];

// ============================================
// כותרת עם הדפסה
// ============================================
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

// ============================================
// כרטיס Hero
// ============================================
function HeroCard({
  advantage,
  inView,
  reduced,
}: {
  advantage: Advantage;
  inView: boolean;
  reduced: boolean;
}) {
  return (
    <motion.article
      className="why-hero-card"
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      animate={
        inView
          ? { opacity: 1, y: 0 }
          : reduced
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 24 }
      }
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      aria-label={`יתרון ${advantage.num}: ${advantage.title}`}
    >
      {/* halo טורקיז עדין מסביב לכרטיס - נוצר אפקט זכוכית גם על רקע בהיר */}
      <div className="why-card-halo" aria-hidden />

      <div className="why-hero-visual">
        <CubesGrid reduced={reduced} />
        <span className="why-hero-visual-label" aria-hidden>
          המבנה זז ומתאים את עצמו
        </span>
      </div>

      <div className="why-hero-content">
        <span className="why-card-num" aria-hidden>
          {advantage.num}
        </span>
        <h3 className="why-hero-title">{advantage.title}</h3>
        <p className="why-hero-desc">{advantage.description}</p>
      </div>
    </motion.article>
  );
}

// ============================================
// כרטיס תומך
// ============================================
function SupportingCard({
  advantage,
  index,
  inView,
  reduced,
}: {
  advantage: Advantage;
  index: number;
  inView: boolean;
  reduced: boolean;
}) {
  const cardDelay = reduced ? 0 : 0.7 + index * 0.1;

  return (
    <motion.article
      className="why-support-card"
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      animate={
        inView
          ? { opacity: 1, y: 0 }
          : reduced
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 20 }
      }
      transition={{ duration: 0.6, delay: cardDelay, ease: [0.22, 1, 0.36, 1] }}
      aria-label={`יתרון ${advantage.num}: ${advantage.title}`}
    >
      <div className="why-card-halo" aria-hidden />
      <span className="why-card-num" aria-hidden>
        {advantage.num}
      </span>
      <h3 className="why-support-title">{advantage.title}</h3>
      <p className="why-support-desc">{advantage.description}</p>
    </motion.article>
  );
}

// ============================================
// הסקשן
// ============================================
export default function WhyCleanCodeSection() {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const closingRef = useRef<HTMLDivElement | null>(null);

  const reduced = useReducedMotion() ?? false;
  const headerInView = useInView(headerRef, {
    once: true,
    margin: "-15% 0px -15% 0px",
  });
  const cardsInView = useInView(cardsRef, {
    once: true,
    margin: "-10% 0px -10% 0px",
  });
  const closingInView = useInView(closingRef, {
    once: true,
    margin: "-20% 0px -20% 0px",
  });

  const headlinePart1 = "למה לא וורדפרס? למה לא ויקס?";
  const headlinePart2 = "כי הם לא מספיקים.";
  const subhead = "5 סיבות שאתר בקוד נקי הוא לא מותרות - הוא הכרח.";
  const closingLine = "אתר שמשרת אתכם. לא להפך.";

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

      <div className="why-cards-area" ref={cardsRef}>
        <HeroCard advantage={HERO_ADVANTAGE} inView={cardsInView} reduced={reduced} />

        <div className="why-support-grid">
          {SUPPORTING_ADVANTAGES.map((adv, i) => (
            <SupportingCard
              key={adv.num}
              advantage={adv}
              index={i}
              inView={cardsInView}
              reduced={reduced}
            />
          ))}
        </div>
      </div>

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
