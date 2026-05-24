"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// 6 היתרונות כבלוקי קוד
interface Advantage {
  id: string;
  title: string;
  // שורות הקוד - כל אחת תקבל syntax highlighting
  lines: CodeLine[];
}

type Token =
  | { type: "keyword"; text: string }
  | { type: "variable"; text: string }
  | { type: "operator"; text: string }
  | { type: "string"; text: string }
  | { type: "comment"; text: string }
  | { type: "punctuation"; text: string }
  | { type: "plain"; text: string };

interface CodeLine {
  tokens: Token[];
}

const ADVANTAGES: Advantage[] = [
  {
    id: "speed",
    title: "מהירות",
    lines: [
      { tokens: [
        { type: "comment", text: "// פי 5 מהר מתבנית גנרית" },
      ]},
      { tokens: [
        { type: "keyword", text: "const" },
        { type: "plain", text: " " },
        { type: "variable", text: "מהירות" },
        { type: "plain", text: " " },
        { type: "operator", text: "=" },
        { type: "plain", text: " " },
        { type: "punctuation", text: "{" },
      ]},
      { tokens: [
        { type: "plain", text: "  " },
        { type: "variable", text: "load" },
        { type: "punctuation", text: ":" },
        { type: "plain", text: " " },
        { type: "string", text: "'מתחת לשנייה'" },
        { type: "punctuation", text: "," },
      ]},
      { tokens: [
        { type: "plain", text: "  " },
        { type: "variable", text: "google" },
        { type: "punctuation", text: ":" },
        { type: "plain", text: " " },
        { type: "string", text: "'אוהב את זה'" },
      ]},
      { tokens: [
        { type: "punctuation", text: "}" },
      ]},
    ],
  },
  {
    id: "seo",
    title: "SEO",
    lines: [
      { tokens: [
        { type: "comment", text: "// בנוי ל-SEO מהיסוד" },
      ]},
      { tokens: [
        { type: "keyword", text: "function" },
        { type: "plain", text: " " },
        { type: "variable", text: "seo" },
        { type: "punctuation", text: "() {" },
      ]},
      { tokens: [
        { type: "plain", text: "  " },
        { type: "keyword", text: "return" },
        { type: "plain", text: " " },
        { type: "punctuation", text: "{" },
      ]},
      { tokens: [
        { type: "plain", text: "    " },
        { type: "variable", text: "plugins" },
        { type: "punctuation", text: ":" },
        { type: "plain", text: " " },
        { type: "string", text: "'אפס'" },
      ]},
      { tokens: [
        { type: "plain", text: "  " },
        { type: "punctuation", text: "}" },
      ]},
      { tokens: [
        { type: "punctuation", text: "}" },
      ]},
    ],
  },
  {
    id: "unique",
    title: "ייחודיות",
    lines: [
      { tokens: [
        { type: "comment", text: "// אין עוד אתר כזה בעולם" },
      ]},
      { tokens: [
        { type: "keyword", text: "const" },
        { type: "plain", text: " " },
        { type: "variable", text: "design" },
        { type: "plain", text: " " },
        { type: "operator", text: "=" },
        { type: "plain", text: " " },
        { type: "punctuation", text: "{" },
      ]},
      { tokens: [
        { type: "plain", text: "  " },
        { type: "variable", text: "template" },
        { type: "punctuation", text: ":" },
        { type: "plain", text: " " },
        { type: "keyword", text: "null" },
        { type: "punctuation", text: "," },
      ]},
      { tokens: [
        { type: "plain", text: "  " },
        { type: "variable", text: "madeFor" },
        { type: "punctuation", text: ":" },
        { type: "plain", text: " " },
        { type: "string", text: "'אתם בלבד'" },
      ]},
      { tokens: [
        { type: "punctuation", text: "}" },
      ]},
    ],
  },
  {
    id: "animations",
    title: "אנימציות",
    lines: [
      { tokens: [
        { type: "comment", text: "// כל מעבר מתוכנן אישית" },
      ]},
      { tokens: [
        { type: "variable", text: "motion" },
        { type: "punctuation", text: "." },
        { type: "variable", text: "scroll" },
        { type: "punctuation", text: "(" },
        { type: "punctuation", text: "{" },
      ]},
      { tokens: [
        { type: "plain", text: "  " },
        { type: "variable", text: "type" },
        { type: "punctuation", text: ":" },
        { type: "plain", text: " " },
        { type: "string", text: "'מותאם אישית'" },
        { type: "punctuation", text: "," },
      ]},
      { tokens: [
        { type: "plain", text: "  " },
        { type: "variable", text: "preset" },
        { type: "punctuation", text: ":" },
        { type: "plain", text: " " },
        { type: "keyword", text: "false" },
      ]},
      { tokens: [
        { type: "punctuation", text: "})" },
      ]},
    ],
  },
  {
    id: "flex",
    title: "גמישות",
    lines: [
      { tokens: [
        { type: "comment", text: "// כל פיצ'ר אפשרי" },
      ]},
      { tokens: [
        { type: "keyword", text: "if" },
        { type: "plain", text: " " },
        { type: "punctuation", text: "(" },
        { type: "variable", text: "רעיון" },
        { type: "punctuation", text: ") {" },
      ]},
      { tokens: [
        { type: "plain", text: "  " },
        { type: "variable", text: "build" },
        { type: "punctuation", text: "(" },
        { type: "variable", text: "רעיון" },
        { type: "punctuation", text: ")" },
      ]},
      { tokens: [
        { type: "punctuation", text: "}" },
      ]},
      { tokens: [
        { type: "comment", text: "// בלי לחפש פלאגין" },
      ]},
    ],
  },
  {
    id: "love",
    title: "אתר שמשרת אתכם",
    lines: [
      { tokens: [
        { type: "comment", text: "// היחסים מתהפכים" },
      ]},
      { tokens: [
        { type: "keyword", text: "const" },
        { type: "plain", text: " " },
        { type: "variable", text: "relationship" },
        { type: "plain", text: " " },
        { type: "operator", text: "=" },
      ]},
      { tokens: [
        { type: "plain", text: "  " },
        { type: "variable", text: "site" },
        { type: "punctuation", text: "." },
        { type: "variable", text: "serves" },
        { type: "punctuation", text: "(" },
        { type: "variable", text: "you" },
        { type: "punctuation", text: ")" },
      ]},
      { tokens: [
        { type: "comment", text: "// לא להפך" },
      ]},
    ],
  },
];

// פונקציה שמחזירה את הצבע לפי סוג הטוקן
function tokenColor(type: Token["type"]): string {
  switch (type) {
    case "keyword":
      return "#FF7AB6"; // ורוד-מנטה
    case "variable":
      return "#E8F4F6"; // כמעט לבן
    case "operator":
      return "#4DD8E5"; // טורקיז ברנד
    case "string":
      return "#9DE89F"; // ירוק רך
    case "comment":
      return "#6B8388"; // אפור-טורקיז עמום
    case "punctuation":
      return "#A0B8BC"; // אפור-כחלחל
    default:
      return "#E8F4F6";
  }
}

// כרטיס קוד יחיד
function CodeCard({
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
  // delay של 0.15s בין כרטיס לכרטיס
  const cardDelay = reduced ? 0 : index * 0.15;

  // סך כל התווים בכרטיס - לחישוב המשך ההדפסה
  const allTokens = advantage.lines.flatMap((line) => line.tokens);
  const totalChars = allTokens.reduce((sum, t) => sum + t.text.length, 0);
  // 18ms לתו = הדפסה זריזה אבל עדיין מורגשת
  const typeDuration = reduced ? 0 : (totalChars * 0.018);

  return (
    <motion.article
      className="code-card"
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      animate={
        inView
          ? { opacity: 1, y: 0 }
          : reduced
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 20 }
      }
      transition={{ duration: 0.5, delay: cardDelay, ease: [0.22, 1, 0.36, 1] }}
      aria-label={`יתרון: ${advantage.title}`}
    >
      {/* כותרת קטנה מעל הקוד - כמו שם קובץ */}
      <div className="code-card-header">
        <span className="code-card-dot code-card-dot-1" aria-hidden />
        <span className="code-card-dot code-card-dot-2" aria-hidden />
        <span className="code-card-dot code-card-dot-3" aria-hidden />
        <span className="code-card-filename">{advantage.title}.ts</span>
      </div>

      {/* גוף הקוד */}
      <pre className="code-card-body" dir="ltr">
        <code>
          <TypewriterCode
            lines={advantage.lines}
            startDelay={cardDelay + 0.3}
            inView={inView}
            reduced={reduced}
            totalDuration={typeDuration}
          />
        </code>
      </pre>

      {/* אריזה visually-hidden לקוראי מסך - הטקסט המלא לנגישות */}
      <span className="sr-only">
        {advantage.title}:{" "}
        {advantage.lines
          .map((line) =>
            line.tokens.map((t) => t.text).join("")
          )
          .join(" ")}
      </span>
    </motion.article>
  );
}

// קומפוננטה שמדפיסה את הקוד תו-תו
function TypewriterCode({
  lines,
  startDelay,
  inView,
  reduced,
  totalDuration,
}: {
  lines: CodeLine[];
  startDelay: number;
  inView: boolean;
  reduced: boolean;
  totalDuration: number;
}) {
  const [revealed, setRevealed] = useState<number>(reduced ? Infinity : 0);

  // סך כל התווים
  const allChars: { lineIdx: number; tokenIdx: number; charIdx: number; type: Token["type"]; char: string }[] = [];
  lines.forEach((line, lineIdx) => {
    line.tokens.forEach((token, tokenIdx) => {
      for (let i = 0; i < token.text.length; i++) {
        allChars.push({
          lineIdx,
          tokenIdx,
          charIdx: i,
          type: token.type,
          char: token.text[i],
        });
      }
    });
  });

  const totalChars = allChars.length;

  useEffect(() => {
    if (reduced) {
      setRevealed(totalChars);
      return;
    }
    if (!inView) {
      setRevealed(0);
      return;
    }
    // מתחילים אחרי startDelay
    const startTimeout = setTimeout(() => {
      const charDuration = (totalDuration * 1000) / totalChars;
      let current = 0;
      const interval = setInterval(() => {
        current++;
        setRevealed(current);
        if (current >= totalChars) {
          clearInterval(interval);
        }
      }, charDuration);
      return () => clearInterval(interval);
    }, startDelay * 1000);

    return () => clearTimeout(startTimeout);
  }, [inView, reduced, startDelay, totalDuration, totalChars]);

  // בונים את הפלט שורה-שורה
  let charCounter = 0;
  return (
    <>
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} className="code-line">
          {line.tokens.map((token, tokenIdx) => {
            const tokenStart = charCounter;
            charCounter += token.text.length;
            const tokenEnd = charCounter;

            // כמה תווים מהטוקן הזה נחשפו
            const revealedInToken = Math.max(
              0,
              Math.min(token.text.length, revealed - tokenStart)
            );

            if (revealedInToken === 0) return null;

            const visibleText = token.text.substring(0, revealedInToken);

            return (
              <span
                key={tokenIdx}
                style={{ color: tokenColor(token.type) }}
              >
                {visibleText}
              </span>
            );
          })}
          {/* הקרסור על השורה האחרונה שעדיין נכתבת */}
          {revealed > 0 && revealed < totalChars && (
            <CursorBlink lineActive={isLastActiveLine(lineIdx, lines, revealed)} />
          )}
          {"\n"}
        </span>
      ))}
    </>
  );
}

// בודק האם השורה הנוכחית היא השורה שעדיין נכתבת
function isLastActiveLine(lineIdx: number, lines: CodeLine[], revealed: number): boolean {
  let counter = 0;
  for (let i = 0; i < lines.length; i++) {
    const lineLen = lines[i].tokens.reduce((s, t) => s + t.text.length, 0);
    counter += lineLen;
    if (counter >= revealed) {
      return i === lineIdx;
    }
  }
  return false;
}

function CursorBlink({ lineActive }: { lineActive: boolean }) {
  if (!lineActive) return null;
  return <span className="code-cursor" aria-hidden>|</span>;
}

// טיפוגרפיה - כותרת ותת-כותרת עם הדפסה
function TypewriterHeadline({
  text,
  startDelay,
  inView,
  reduced,
  speedPerChar = 0.035,
  className,
  asElement = "h2",
  ariaLabel,
}: {
  text: string;
  startDelay: number;
  inView: boolean;
  reduced: boolean;
  speedPerChar?: number;
  className?: string;
  asElement?: "h2" | "p";
  ariaLabel?: string;
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
      {showCursor && <span className="code-cursor headline-cursor" aria-hidden>|</span>}
    </Element>
  );
}

export default function WhyCleanCodeSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  const reduced = useReducedMotion() ?? false;
  const headerInView = useInView(headerRef, { once: true, margin: "-15% 0px -15% 0px" });
  const cardsInView = useInView(cardsRef, { once: true, margin: "-10% 0px -10% 0px" });

  // הכותרת והתת-כותרת
  const headlinePart1 = "למה לא וורדפרס? למה לא ויקס?";
  const headlinePart2 = "כי הם לא מספיקים.";
  const subhead = "כל יתרון כאן הוא קוד שכתבתי באמת. תסתכלו.";

  // טיימינג: כותרת ראשית מתחילה ב-0.1, אורכת len*0.035
  // תת-כותרת מתחילה אחרי שהכותרת הסתיימה
  const headline1Duration = headlinePart1.length * 0.035;
  const headline2Start = 0.1 + headline1Duration + 0.2;
  const headline2Duration = headlinePart2.length * 0.045; // מעט יותר איטי לדגש
  const subheadStart = headline2Start + headline2Duration + 0.3;

  return (
    <section
      id="why-clean-code"
      ref={sectionRef}
      className="why-section"
      aria-label="למה קוד נקי"
      data-theme="light"
    >
      {/* כותרת ראשית */}
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
        />
        <TypewriterHeadline
          text={subhead}
          startDelay={subheadStart}
          inView={headerInView}
          reduced={reduced}
          speedPerChar={0.025}
          className="why-subhead"
          asElement="p"
        />
      </div>

      {/* גריד הכרטיסים - 3 משמאל, 3 מימין, ה-Orb באמצע (מאחור, fixed) */}
      <div className="why-cards-wrap" ref={cardsRef}>
        {/* 6 כרטיסים בגריד שמסביב למרכז ריק */}
        <div className="why-cards-grid">
          {/* עמודה ימנית - 3 כרטיסים */}
          <div className="why-col why-col-right">
            <CodeCard advantage={ADVANTAGES[0]} index={0} inView={cardsInView} reduced={reduced} />
            <CodeCard advantage={ADVANTAGES[1]} index={1} inView={cardsInView} reduced={reduced} />
            <CodeCard advantage={ADVANTAGES[2]} index={2} inView={cardsInView} reduced={reduced} />
          </div>

          {/* מרכז ריק - כאן ה-Orb הגלובלי גדל ונראה דרך הרווח */}
          <div className="why-center-gap" aria-hidden />

          {/* עמודה שמאלית - 3 כרטיסים */}
          <div className="why-col why-col-left">
            <CodeCard advantage={ADVANTAGES[3]} index={3} inView={cardsInView} reduced={reduced} />
            <CodeCard advantage={ADVANTAGES[4]} index={4} inView={cardsInView} reduced={reduced} />
            <CodeCard advantage={ADVANTAGES[5]} index={5} inView={cardsInView} reduced={reduced} />
          </div>
        </div>
      </div>
    </section>
  );
}
