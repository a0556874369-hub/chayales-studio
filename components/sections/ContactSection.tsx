"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Phone,
  Envelope,
  WhatsappLogo,
  ArrowLeft,
  CheckCircle,
} from "@phosphor-icons/react";
import { useRef, useState, type FormEvent } from "react";

// מה אתם צריכים? - דרופדאון
const SERVICE_OPTIONS = [
  { value: "", label: "מה אתם צריכים?" },
  { value: "branding", label: "מיתוג" },
  { value: "website", label: "אתר" },
  { value: "ad", label: "מודעה" },
  { value: "full-package", label: "חבילה מלאה" },
  { value: "not-sure", label: "עדיין לא בטוחים" },
];

// פרטי קשר ישירים - ⚠️ עדכני את הטלפון!
const CONTACT_DETAILS = {
  phone: "055-687-4369",
  phoneClean: "972556874369", // ללא 0 מקדים, עם 972 ל-WhatsApp
  email: "contact@chayales.com",
};

interface FormData {
  name: string;
  contact: string; // טלפון או מייל - שדה אחד
  service: string;
  message: string;
}

type FormStatus = "idle" | "sending" | "success" | "error";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion() ?? false;

  const headerRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const directRef = useRef<HTMLDivElement | null>(null);

  const headerInView = useInView(headerRef, {
    once: true,
    margin: "-15% 0px -15% 0px",
  });
  const formInView = useInView(formRef, {
    once: true,
    margin: "-10% 0px -10% 0px",
  });
  const directInView = useInView(directRef, {
    once: true,
    margin: "-10% 0px -10% 0px",
  });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    contact: "",
    service: "",
    message: "",
  });

  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  // זיהוי האם הקלט הוא מייל או טלפון
  const detectContactType = (
    value: string
  ): "email" | "phone" | "invalid" => {
    const trimmed = value.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "email";
    // טלפון - לפחות 8 ספרות (יכול לכלול -, +, רווחים, סוגריים)
    const digitCount = trimmed.replace(/\D/g, "").length;
    if (digitCount >= 8 && /^[\d\s+\-()]+$/.test(trimmed)) return "phone";
    return "invalid";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ולידציה
    if (!formData.name.trim()) {
      setErrorMessage("שם הוא שדה חובה");
      return;
    }
    if (!formData.contact.trim()) {
      setErrorMessage("טלפון או מייל - אחד מהם חובה");
      return;
    }

    const contactType = detectContactType(formData.contact);
    if (contactType === "invalid") {
      setErrorMessage("אנא הזיני טלפון תקין (לפחות 8 ספרות) או כתובת מייל");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          contactType, // שולח לשרת גם את הסוג
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "שגיאה בשליחה");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "שגיאה בשליחה. נסי שוב או צרי קשר ישירות."
      );
    }
  };

  const isSubmitting = status === "sending";
  const isSuccess = status === "success";

  // הודעת WhatsApp מוכנה מראש
  const whatsappMessage = encodeURIComponent(
    "היי חיה, ראיתי את האתר שלך ומתעניינ/ת בשירותים."
  );
  const whatsappUrl = `https://wa.me/${CONTACT_DETAILS.phoneClean}?text=${whatsappMessage}`;

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="contact-section"
      aria-label="צור קשר"
      data-theme="dark"
    >
      {/* כותרת */}
      <motion.div
        className="contact-header"
        ref={headerRef}
        initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        animate={
          headerInView
            ? { opacity: 1, y: 0 }
            : reduced
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 24 }
        }
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="contact-headline">
          רוצים שהעסק שלכם ייראה כמו{" "}
          <span className="contact-headline-accent">הבחירה הנכונה?</span>
        </h2>
        <p className="contact-subhead">
          ספרו לי איפה אתם עומדים עכשיו - ונראה מה נכון לבנות: מיתוג, אתר, מודעה או הכל יחד.
        </p>
      </motion.div>

      {/* טופס במרכז */}
      <motion.div
        className="contact-form-wrap"
        ref={formRef}
        initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        animate={
          formInView
            ? { opacity: 1, y: 0 }
            : reduced
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 30 }
        }
        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        {isSuccess ? (
          <div className="contact-success" role="status">
            <CheckCircle
              size={64}
              weight="thin"
              color="#4DD8E5"
              className="contact-success-icon"
            />
            <h3 className="contact-success-title">תודה!</h3>
            <p className="contact-success-text">
              קיבלתי את הפנייה שלך.
              <br />
              אחזור אלייך תוך 24 שעות.
            </p>
          </div>
        ) : (
          <form
            className="contact-form"
            onSubmit={handleSubmit}
            noValidate
            aria-label="טופס יצירת קשר"
          >
            <div className="contact-field">
              <label htmlFor="contact-name" className="contact-label">
                שם <span className="contact-required">*</span>
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className="contact-input"
                placeholder="השם שלך"
                autoComplete="name"
              />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-contact" className="contact-label">
                טלפון או מייל <span className="contact-required">*</span>
              </label>
              <input
                id="contact-contact"
                name="contact"
                type="text"
                required
                value={formData.contact}
                onChange={handleChange}
                disabled={isSubmitting}
                className="contact-input"
                placeholder="איך הכי נוח לכם שאחזור"
                autoComplete="off"
              />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-service" className="contact-label">
                מה אתם צריכים?
              </label>
              <select
                id="contact-service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                disabled={isSubmitting}
                className="contact-input contact-select"
              >
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="contact-field">
              <label htmlFor="contact-message" className="contact-label">
                ספרו לי בקצרה על העסק
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                className="contact-input contact-textarea"
                placeholder="במה אתם עוסקים? מה הצורך?"
              />
            </div>

            {errorMessage && (
              <div className="contact-error" role="alert">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="contact-submit"
              disabled={isSubmitting}
            >
              <span className="contact-submit-text">
                {isSubmitting ? "שולחת..." : "בואו נתחיל"}
              </span>
              {!isSubmitting && (
                <ArrowLeft
                  size={20}
                  weight="bold"
                  className="contact-submit-arrow"
                />
              )}
            </button>
          </form>
        )}
      </motion.div>

      {/* פרטי קשר ישירים מתחת */}
      <motion.div
        className="contact-direct-wrap"
        ref={directRef}
        initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        animate={
          directInView
            ? { opacity: 1, y: 0 }
            : reduced
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 20 }
        }
        transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="contact-direct-label" aria-hidden>
          או פנו אליי ישירות:
        </span>
        <div className="contact-direct-grid">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-direct-item contact-direct-whatsapp"
            aria-label="שלחו וואטסאפ"
          >
            <WhatsappLogo size={22} weight="thin" />
            <span>וואטסאפ</span>
          </a>
          <a
            href={`tel:${CONTACT_DETAILS.phone.replace(/-/g, "")}`}
            className="contact-direct-item"
            aria-label={`התקשרו ל-${CONTACT_DETAILS.phone}`}
          >
            <Phone size={22} weight="thin" />
            <span dir="ltr">{CONTACT_DETAILS.phone}</span>
          </a>
          <a
            href={`mailto:${CONTACT_DETAILS.email}`}
            className="contact-direct-item"
            aria-label={`שלחו מייל ל-${CONTACT_DETAILS.email}`}
          >
            <Envelope size={22} weight="thin" />
            <span dir="ltr">{CONTACT_DETAILS.email}</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
