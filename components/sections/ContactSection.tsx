"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { Phone, Envelope, ArrowLeft, CheckCircle } from "@phosphor-icons/react";
import { useRef, useState, type FormEvent } from "react";
import GlassSculpture from "@/components/ui/GlassSculpture";

// סוגי שירות לטופס
const SERVICE_OPTIONS = [
  { value: "", label: "בחרי סוג שירות" },
  { value: "website", label: "אתר חדש" },
  { value: "branding", label: "מיתוג מלא" },
  { value: "ad", label: "מודעה / חומר שיווקי" },
  { value: "full-package", label: "חבילה מלאה - מיתוג + אתר" },
  { value: "other", label: "אחר / לא בטוחה עדיין" },
];

// פרטי קשר ישירים - עדכני את הטלפון!
const CONTACT_DETAILS = {
  phone: "055-687-4369", // ⚠️ עדכני למספר הנכון שלך
  email: "chayales123@gmail.com",
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

type FormStatus = "idle" | "sending" | "success" | "error";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion() ?? false;

  const headerRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);

  const headerInView = useInView(headerRef, {
    once: true,
    margin: "-15% 0px -15% 0px",
  });
  const formInView = useInView(formRef, {
    once: true,
    margin: "-10% 0px -10% 0px",
  });
  const visualInView = useInView(visualRef, {
    once: true,
    margin: "-10% 0px -10% 0px",
  });

  // ===== State הטופס =====
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // ===== עדכון שדות =====
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  // ===== שליחת הטופס =====
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ולידציה בצד הלקוח
    if (!formData.name.trim()) {
      setErrorMessage("שם הוא שדה חובה");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage("מייל הוא שדה חובה");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage("כתובת מייל לא תקינה");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
          מוכנים לבנות מותג{" "}
          <span className="contact-headline-accent">שלא מדפדפים לידו?</span>
        </h2>
        <p className="contact-subhead">
          שיחת היכרות של 30 דקות. בלי התחייבות. רק כדי לראות אם אנחנו מתאימים.
        </p>
      </motion.div>

      {/* גריד ראשי */}
      <div className="contact-main-grid">
        {/* צד ימני (בעברית = ראשון) - הטופס */}
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
            // ===== מצב הצלחה =====
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
            // ===== הטופס =====
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
                <label htmlFor="contact-email" className="contact-label">
                  מייל <span className="contact-required">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="contact-input"
                  placeholder="your@email.com"
                  dir="ltr"
                  autoComplete="email"
                />
              </div>

              <div className="contact-field">
                <label htmlFor="contact-phone" className="contact-label">
                  טלפון
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="contact-input"
                  placeholder="050-1234567"
                  dir="ltr"
                  autoComplete="tel"
                />
              </div>

              <div className="contact-field">
                <label htmlFor="contact-service" className="contact-label">
                  סוג שירות
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
                  ספרי לי על העסק
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="contact-input contact-textarea"
                  placeholder="במה את עוסקת? מה הצורך?"
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
                  {isSubmitting ? "שולחת..." : "בואו נדבר"}
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

        {/* צד שמאלי (בעברית = שני) - הוויזואל ופרטי קשר */}
        <motion.div
          className="contact-visual-wrap"
          ref={visualRef}
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          animate={
            visualInView
              ? { opacity: 1, y: 0 }
              : reduced
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 30 }
          }
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="contact-sculpture">
            <GlassSculpture />
          </div>

          <div className="contact-direct">
            <span className="contact-direct-label" aria-hidden>
              או ישירות
            </span>
            <a
              href={`tel:${CONTACT_DETAILS.phone.replace(/-/g, "")}`}
              className="contact-direct-item"
              aria-label={`התקשרי ל-${CONTACT_DETAILS.phone}`}
            >
              <Phone size={20} weight="thin" color="#4DD8E5" />
              <span dir="ltr">{CONTACT_DETAILS.phone}</span>
            </a>
            <a
              href={`mailto:${CONTACT_DETAILS.email}`}
              className="contact-direct-item"
              aria-label={`שלחי מייל ל-${CONTACT_DETAILS.email}`}
            >
              <Envelope size={20} weight="thin" color="#4DD8E5" />
              <span dir="ltr">{CONTACT_DETAILS.email}</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
