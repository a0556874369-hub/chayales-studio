"use client";

// Section 04 — שירותים.
// Dark continuation of Section 03's bottom. 4 dark-glass cards in a 2x2
// bento (1 column on mobile). The 4th card ("חבילה מלאה") is the flagship.
// Entrance animation owned by <ScrollReveal> wrappers; the cards
// themselves only host the mouse-driven glass interaction.

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { useGlassInteraction } from "@/lib/useGlassInteraction";
import HeadlineReveal from "@/components/motion/HeadlineReveal";
import HeadlineAccent from "@/components/motion/HeadlineAccent";
import ScrollReveal from "@/components/motion/ScrollReveal";
import SectionSweep from "@/components/motion/SectionSweep";

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

function ServiceCard({ service }: { service: Service }) {
  const cardRef = useGlassInteraction<HTMLElement>();
  return (
    <article
      ref={cardRef as React.Ref<HTMLElement>}
      className={`service-card ${service.flagship ? "service-card-flagship" : ""}`}
      aria-label={`שירות ${service.index}: ${service.name}`}
    >
      <div className="service-card-tilt">
        <span className="service-card-index" aria-hidden>
          {service.index}
        </span>
        <h3 className="service-card-name">{service.name}</h3>
        <p className="service-card-desc">{service.description}</p>
        <div className="service-card-footer">
          <div className="service-card-divider" aria-hidden />
          <p className="service-card-price">{service.price}</p>
        </div>
      </div>
    </article>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"] as never,
  });
  const glowsY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [120, -120],
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="services-section"
      aria-label="שירותים"
    >
      <motion.div
        className="parallax-glows"
        aria-hidden
        style={{ y: glowsY }}
      >
        <span className="services-glow services-glow-1" aria-hidden />
        <span className="services-glow services-glow-2" aria-hidden />
        <span className="services-glow services-glow-3" aria-hidden />
      </motion.div>

      <SectionSweep theme="dark" />

      <div className="services-content">
        <HeadlineReveal
          as="h2"
          className="services-headline"
          text="שירותים שיוצרים מותג שלם, לא רק לוגו."
        />
        <HeadlineAccent />

        <ScrollReveal as="p" className="services-subhead">
          מתחילים מאסטרטגיה. ממשיכים בשפה ויזואלית. מסיימים במותג שמדבר בעצמו.
        </ScrollReveal>

        <div className="services-grid" dir="rtl">
          {SERVICES.map((s) => (
            <ScrollReveal
              key={s.index}
              className="service-card-wrap"
              scaleFrom={0.94}
              rotateXFrom={6}
            >
              <ServiceCard service={s} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="services-cta-wrap">
          <a href="#contact" className="services-cta">
            בואו נדבר <span aria-hidden>←</span>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
