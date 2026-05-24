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
      "לוגו, פלטת צבעים, טיפוגרפיה, שפה ויזואלית - כל מה שצריך כדי שהעסק שלכם ייראה כמו עצמו ולא כמו אחר.",
    price: "החל מ-3,500 ₪",
  },
  {
    Icon: Browsers,
    name: "אתרים בקוד נקי",
    description:
      "אתרים מותאמים אישית, מהירים, עם אנימציות ייחודיות. בלי תבניות, בלי וורדפרס. רק קוד שעובד בשבילכם.",
    price: "החל מ-9,500 ₪",
  },
  {
    Icon: PaperPlaneTilt,
    name: "מודעות לעיתון ודיגיטל",
    description:
      "מודעות שעוצרות אצבע. בעיתון או בפיד. בעברית או באנגלית. תמיד עם מסר ברור והבטחה ויזואלית.",
    price: "החל מ-950 ₪ למודעה",
  },
  {
    Icon: Stack,
    name: "חבילה מלאה - מותג שלם",
    description:
      "מיתוג + אתר + מודעות. הכל מאותה יד, באותה שפה. הדרך הבטוחה למותג שלם בלי להתעסק עם 5 ספקים שונים.",
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
          שירותים שיוצרים מותג שלם, לא רק לוגו.
        </h2>

        <p className="services-subhead">
          מתחילים מאסטרטגיה. ממשיכים בשפה ויזואלית. מסיימים במותג שמדבר בעצמו.
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
            בואו נדבר <span aria-hidden>←</span>
          </a>
        </div>
      </div>
    </section>
  );
}
