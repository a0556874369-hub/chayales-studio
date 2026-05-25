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

// ============================================
// 4 שלבי התהליך
// ============================================
interface Stage {
  num: string;
  Icon: Icon;
  title: string;
  description: string;
  duration: string;
}

const STAGES: Stage[] = [
  {
    num: "01",
    Icon: ChatCircleDots,
    title: "שיחת היכרות",
    description:
      "שיחה של 30 דקות. אני שומעת את הסיפור שלכם, את החלום, את הכאב. בלי התחייבות.",
    duration: "יום",
  },
  {
    num: "02",
    Icon: PaintBrush,
    title: "מיתוג ושפה",
    description:
      "לוגו, צבעים, טיפוגרפיה, מצב רוח. הכל לפני שגוגלים שורת קוד אחת.",
    duration: "1-2 שבועות",
  },
  {
    num: "03",
    Icon: Code,
    title: "פיתוח ועיצוב",
    description:
      "אתר, מודעות, או חבילה מלאה. כל אלמנט מתוכנן אישית, נבדק, מותאם.",
    duration: "2-4 שבועות",
  },
  {
    num: "04",
    Icon: RocketLaunch,
    title: "עלייה לאוויר",
    description: "בודקים, משחררים, חוגגים. וגם אחרי - אני כאן בשבילכם.",
    duration: "יום",
  },
];

// ============================================
// הסקשן עצמו
// ============================================
export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion() ?? false;

  // ה-scroll מחושב יחסית לסקשן עצמו
  // offset: כשהסקשן מתחיל להופיע ועד שיוצא מהמסך
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // הזזה אופקית של ה-track של הכרטיסים
  // התנועה היא בעברית - הכרטיסים מתחילים מימין וזזים שמאלה
  // ב-RTL: translateX חיובי = ימינה, שלילי = שמאלה
  // אנחנו רוצים שיתחילו ימינה (חוץ מהמסך) ויזוזו לתוך המסך, ואז ימשיכו שמאלה
  // אבל בעצם בעברית - הם מתחילים מצד אחד וזזים לצד השני
  //
  // כדי שתרגיש כמו "השלבים מופיעים בסדר 01→02→03→04 בעברית":
  // 01 מתחיל ממש בצד ימין נראה, השאר מימינו (מחוץ למסך)
  // ככל שגוללים - הכל זז שמאלה, חושף את 02, 03, 04 בזה אחר זה
  //
  // התנועה הכוללת: מ-0% ל-(width-של-track פחות width-של-מסך) כדי שהכרטיס האחרון יגיע לקצה
  // במונחים של אחוז: מ-0 ל- -75% (כי יש 4 כרטיסים, 3 מהם צריכים לעבור)
  const trackX = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0%", "0%"] : ["0%", "-75%"]
  );

  // קו ה-timeline שמתמלא בטורקיז
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
      {/* הקונטיינר הפנימי שעושה pinning */}
      <div className="process-sticky">
        {/* כותרת */}
        <div className="process-header">
          <h2 className="process-headline">
            4 שלבים מהרעיון <span className="process-headline-accent">למותג חי.</span>
          </h2>
          <p className="process-subhead">
            תהליך מסודר, בלי הפתעות, עם הרבה אהבה לפרטים.
          </p>
        </div>

        {/* קו timeline */}
        <div className="process-timeline-wrap" aria-hidden>
          <div className="process-timeline-track" />
          <motion.div
            className="process-timeline-fill"
            style={{ width: timelineFill }}
          />
          {/* 4 נקודות על הקו - אחת לכל שלב */}
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

        {/* track של הכרטיסים שזז אופקית */}
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

      {/* ===== מובייל - stack אנכי רגיל בלי pinning ===== */}
      <div className="process-mobile-stack" aria-hidden="false">
        <div className="process-mobile-header">
          <h2 className="process-headline">
            4 שלבים מהרעיון <span className="process-headline-accent">למותג חי.</span>
          </h2>
          <p className="process-subhead">
            תהליך מסודר, בלי הפתעות, עם הרבה אהבה לפרטים.
          </p>
        </div>
        <div className="process-mobile-line" aria-hidden />
        <div className="process-mobile-cards">
          {STAGES.map((stage) => (
            <StageCard key={stage.num} stage={stage} mobile />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// כרטיס שלב יחיד
// ============================================
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

      <div className="process-card-duration">
        <span className="process-card-duration-label">משך:</span>
        <span className="process-card-duration-value">{stage.duration}</span>
      </div>
    </article>
  );
}
