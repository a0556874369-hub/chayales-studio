"use client";

// Section 04 — שירותים.
// 4 portrait cards in one row on desktop, 2×2 on tablet, single column
// on mobile. Each card carries a Phosphor Thin icon at the top in brand
// teal (no platform/background — pure line art). The 4th card
// ("חבילה מלאה") is the flagship — teal border + soft halo, no badge.
// Fully static — no motion, no mouse interaction beyond a soft hover
// border tint.

import {
  Compass,
  Browsers,
  PaperPlaneTilt,
  Stack,
  type Icon,
} from "@phosphor-icons/react";

interface Service {
  Icon: Icon;
  name: string;
  description: string;
  price: string;
  flagship?: boolean;
}

// Copy is locked verbatim from the brief — do not rephrase.
const SERVICES: Service[] = [
  {
    Icon: Compass,
    name: "מיתוג עסקי",
    description:
      "לוגו, צבעים, פונטים ושפה ויזואלית שמרגישים כמו העסק שלכם, לא כמו עוד משהו שראיתם אצל מישהו אחר.",
    price: "החל מ-3,500 ₪",
  },
  {
    Icon: Browsers,
    name: "אתרים בקוד נקי",
    description:
      "אתרים מותאמים אישית, מהירים, עם חוויה ותנועה שנבנו במיוחד בשבילכם. בלי תבניות. בלי וורדפרס. בלי פשרות מיותרות.",
    price: "החל מ-9,500 ₪",
  },
  {
    Icon: PaperPlaneTilt,
    name: "מודעות לעיתון ודיגיטל",
    description:
      "מודעות שנראות טוב, אבל בעיקר עושות את העבודה: עוצרות עין, מעבירות מסר ברור, וגורמות לקורא להבין למה לשים לב דווקא אליכם.",
    price: "החל מ-950 ₪ למודעה",
  },
  {
    Icon: Stack,
    name: "חבילה מלאה",
    description:
      "מיתוג, אתר ומודעות מאותה יד, כדי שהעסק שלכם ידבר באותה שפה בכל מקום שבו פוגשים אותו.",
    price: "החל מ-15,000 ₪",
    flagship: true,
  },
];

function ServiceCard({ service }: { service: Service }) {
  const { Icon: ServiceIcon } = service;
  return (
    <article
      className={`service-card ${service.flagship ? "service-card-flagship" : ""}`}
      aria-label={`שירות: ${service.name}`}
    >
      <div className="service-card-icon-wrap" aria-hidden>
        <ServiceIcon size={56} weight="thin" color="#4DD8E5" />
      </div>
      <h3 className="service-card-name">{service.name}</h3>
      <p className="service-card-desc">{service.description}</p>
      <div className="service-card-footer">
        <div className="service-card-divider" aria-hidden />
        <p className="service-card-price">{service.price}</p>
      </div>
    </article>
  );
}

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="services-section"
      aria-label="שירותים"
    >
      {/* Static teal glow divs — positioning + gradient only. */}
      <span className="services-glow services-glow-1" aria-hidden />
      <span className="services-glow services-glow-2" aria-hidden />
      <span className="services-glow services-glow-3" aria-hidden />

      <div className="services-content">
        <h2 className="services-headline">
          כל מה שעסק צריך
          <br />
          כדי להיראות רציני, להעביר מסר ברור,
          <br />
          ולהישאר זכיר.
        </h2>

        <p className="services-subhead">
          אפשר להתחיל מלוגו, מאתר או ממודעה - אבל המטרה תמיד אחת: שהנראות, המסר והביצוע יעבדו יחד.
        </p>

        <div className="services-grid" dir="rtl">
          {SERVICES.map((s) => (
            <div key={s.name} className="service-card-wrap">
              <ServiceCard service={s} />
            </div>
          ))}
        </div>

        <div className="services-cta-wrap">
          <a href="#contact" className="services-cta">
            בואו נבנה את זה נכון <span aria-hidden>←</span>
          </a>
        </div>
      </div>
    </section>
  );
}
