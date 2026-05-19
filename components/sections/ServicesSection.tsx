"use client";

// Section 04 — שירותים.
// Dark continuation of Section 03's bottom. 4 dark-glass cards in a 2x2
// bento (1 column on mobile). The 4th card ("חבילה מלאה") is the flagship
// — visually highlighted via a teal border + teal halo, no text label.

import { motion, useReducedMotion } from "framer-motion";

interface Service {
  index: string;
  name: string;
  description: string;
  price: string;
  flagship?: boolean;
}

// Copy is locked verbatim from the brief — do not rephrase.
const SERVICES: Service[] = [
  {
    index: "01",
    name: "מיתוג עסקי",
    description:
      "לוגו, פלטת צבעים, טיפוגרפיה, שפה ויזואלית - כל מה שצריך כדי שהעסק שלכם ייראה כמו עצמו ולא כמו אחר.",
    price: "החל מ-3,500 ₪",
  },
  {
    index: "02",
    name: "אתרים בקוד נקי",
    description:
      "אתרים מותאמים אישית, מהירים, עם אנימציות ייחודיות. בלי תבניות, בלי וורדפרס. רק קוד שעובד בשבילכם.",
    price: "החל מ-9,500 ₪",
  },
  {
    index: "03",
    name: "מודעות לעיתון ודיגיטל",
    description:
      "מודעות שעוצרות אצבע. בעיתון או בפיד. בעברית או באנגלית. תמיד עם מסר ברור והבטחה ויזואלית.",
    price: "החל מ-950 ₪ למודעה",
  },
  {
    index: "04",
    name: "חבילה מלאה - מותג שלם",
    description:
      "מיתוג + אתר + מודעות. הכל מאותה יד, באותה שפה. הדרך הבטוחה למותג שלם בלי להתעסק עם 5 ספקים שונים.",
    price: "החל מ-15,000 ₪",
    flagship: true,
  },
];

export default function ServicesSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="services"
      className="services-section"
      aria-label="שירותים"
    >
      <div className="services-content">
        <h2 className="services-headline">
          שירותים שיוצרים מותג שלם, לא רק לוגו.
        </h2>
        <p className="services-subhead">
          מתחילים מאסטרטגיה. ממשיכים בשפה ויזואלית. מסיימים במותג שמדבר בעצמו.
        </p>

        <div className="services-grid" dir="rtl">
          {SERVICES.map((s, i) => (
            <motion.article
              key={s.index}
              className={`service-card ${s.flagship ? "service-card-flagship" : ""}`}
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 30, scale: 0.95 }
              }
              whileInView={
                reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }
              }
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.55,
                delay: reduceMotion ? 0 : i * 0.12,
                ease: [0.22, 0.61, 0.36, 1],
              }}
              aria-label={`שירות ${s.index}: ${s.name}`}
            >
              <span className="service-card-index" aria-hidden>
                {s.index}
              </span>
              <h3 className="service-card-name">{s.name}</h3>
              <p className="service-card-desc">{s.description}</p>
              <div className="service-card-footer">
                <div className="service-card-divider" aria-hidden />
                <p className="service-card-price">{s.price}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="services-cta-wrap">
          <a href="#contact" className="services-cta">
            בואו נדבר <span aria-hidden>←</span>
          </a>
        </div>
      </div>
    </section>
  );
}
