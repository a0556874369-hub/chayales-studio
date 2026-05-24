"use client";

// Section 04 — שירותים.
// Dark continuation of Section 03. 4 portrait cards in one row on desktop,
// 2×2 on tablet, single column on mobile. Each card carries a 3D icon
// (3dicons.co, CC0) re-tinted to brand teal via a CSS filter chain. The
// 4th card ("חבילה מלאה") is the flagship — teal border + soft halo, no
// text badge. Fully static — no motion, no mouse interaction.

import Image from "next/image";

interface Service {
  iconSrc: string;
  iconAlt: string;
  name: string;
  description: string;
  price: string;
  flagship?: boolean;
}

// Copy is locked verbatim from the brief — do not rephrase.
const SERVICES: Service[] = [
  {
    iconSrc: "/icons/3d/branding.webp",
    iconAlt: "מיתוג עסקי",
    name: "מיתוג עסקי",
    description:
      "לוגו, פלטת צבעים, טיפוגרפיה, שפה ויזואלית - כל מה שצריך כדי שהעסק שלכם ייראה כמו עצמו ולא כמו אחר.",
    price: "החל מ-3,500 ₪",
  },
  {
    iconSrc: "/icons/3d/websites.webp",
    iconAlt: "אתרים בקוד נקי",
    name: "אתרים בקוד נקי",
    description:
      "אתרים מותאמים אישית, מהירים, עם אנימציות ייחודיות. בלי תבניות, בלי וורדפרס. רק קוד שעובד בשבילכם.",
    price: "החל מ-9,500 ₪",
  },
  {
    iconSrc: "/icons/3d/ads.webp",
    iconAlt: "מודעות לעיתון ודיגיטל",
    name: "מודעות לעיתון ודיגיטל",
    description:
      "מודעות שעוצרות אצבע. בעיתון או בפיד. בעברית או באנגלית. תמיד עם מסר ברור והבטחה ויזואלית.",
    price: "החל מ-950 ₪ למודעה",
  },
  {
    iconSrc: "/icons/3d/package.webp",
    iconAlt: "חבילה מלאה - מותג שלם",
    name: "חבילה מלאה - מותג שלם",
    description:
      "מיתוג + אתר + מודעות. הכל מאותה יד, באותה שפה. הדרך הבטוחה למותג שלם בלי להתעסק עם 5 ספקים שונים.",
    price: "החל מ-15,000 ₪",
    flagship: true,
  },
];

function ServiceCard({ service }: { service: Service }) {
  return (
    <article
      className={`service-card ${service.flagship ? "service-card-flagship" : ""}`}
      aria-label={`שירות: ${service.name}`}
    >
      <div className="service-card-icon-wrap" aria-hidden>
        <Image
          src={service.iconSrc}
          alt={service.iconAlt}
          width={96}
          height={96}
          className="service-icon-3d"
          loading="lazy"
        />
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
            <div key={s.iconSrc} className="service-card-wrap">
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
