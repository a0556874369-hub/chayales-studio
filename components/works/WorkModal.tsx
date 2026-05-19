"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Slide, Work } from "@/lib/works-data";
import { buildSlides } from "@/lib/works-data";
import Lightbox, { type LightboxItem } from "./Lightbox";
import SafeImage from "./SafeImage";

interface WorkModalProps {
  work: Work | null;
  onClose: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])';

// Stage-slider modal: header, stage with prev/next + counter, thumb strip,
// optional note, CTA. Keyboard arrows navigate (←/→), ESC closes, swipe on
// touch, focus trap, scroll lock. Only the current ±1 slides eager-load.
export default function WorkModal({ work, onClose }: WorkModalProps) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const slides: Slide[] = useMemo(
    () => (work ? buildSlides(work) : []),
    [work],
  );

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 prev, +1 next, 0 init
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Build the lightbox carousel — every unique image in this work, in slide
  // order. logoCompare contributes 2 items (after, before — matching the
  // RTL visual order in the modal). Dedupe by src so the same image isn't
  // repeated in the zoom carousel (e.g. kinor's grid + highlight share src).
  const lightboxItems: LightboxItem[] = useMemo(() => {
    if (!work) return [];
    const seen = new Set<string>();
    const items: LightboxItem[] = [];
    const add = (src: string, alt: string) => {
      if (seen.has(src)) return;
      seen.add(src);
      items.push({ src, alt });
    };
    for (const s of slides) {
      if (s.kind === "image" || s.kind === "highlight") {
        add(s.src, s.alt);
      } else if (s.kind === "logoCompare") {
        add(s.afterSrc, s.afterAlt);
        add(s.beforeSrc, s.beforeAlt);
      }
    }
    return items;
  }, [work, slides]);

  // Reset index whenever the work changes.
  useEffect(() => {
    setIndex(0);
    setDirection(0);
  }, [work?.slug]);

  const open = work !== null;
  const slide = slides[index];

  const go = useCallback(
    (delta: number) => {
      if (slides.length === 0) return;
      setDirection(delta > 0 ? 1 : -1);
      setIndex((i) => (i + delta + slides.length) % slides.length);
    },
    [slides.length],
  );

  const goTo = useCallback(
    (i: number) => {
      setDirection(i > index ? 1 : -1);
      setIndex(i);
    },
    [index],
  );

  // Scroll lock + focus trap + keyboard handler.
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxIndex !== null) return; // let lightbox close first
        onClose();
        return;
      }
      // In RTL "next" feels like ←, "prev" like →. The slider sequence still
      // advances in array order, so map keys accordingly.
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(1);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(-1);
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables =
          panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKey);

    const t = window.setTimeout(() => {
      const node = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      node?.focus();
    }, 50);

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(t);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose, go, lightboxIndex]);

  const openLightbox = useCallback(
    (src: string, _alt: string) => {
      const idx = lightboxItems.findIndex((it) => it.src === src);
      setLightboxIndex(idx >= 0 ? idx : 0);
    },
    [lightboxItems],
  );

  // Swipe handler — RTL: swipe left = next, swipe right = prev.
  const onDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const threshold = 60;
      if (info.offset.x < -threshold) go(1);
      else if (info.offset.x > threshold) go(-1);
    },
    [go],
  );

  // Decide which slide images to eager-load: current ± 1.
  const shouldLoad = useCallback(
    (i: number) => {
      if (slides.length === 0) return false;
      const distance = Math.min(
        Math.abs(i - index),
        slides.length - Math.abs(i - index),
      );
      return distance <= 1;
    },
    [index, slides.length],
  );

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <AnimatePresence>
        {open && work && slide && (
          <motion.div
            className="work-modal-backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="presentation"
          >
            <motion.div
              ref={panelRef}
              className="work-modal-panel"
              onClick={(e) => e.stopPropagation()}
              initial={
                reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }
              }
              animate={
                reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }
              }
              exit={
                reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }
              }
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="work-modal-title"
            >
              <button
                type="button"
                className="work-modal-close"
                onClick={onClose}
                aria-label="סגירת חלון פרויקט"
              >
                ×
              </button>

              <header className="work-modal-header">
                <h3 id="work-modal-title" className="work-modal-title">
                  {work.clientName}
                </h3>
                <p className="work-modal-desc">{work.shortDescription}</p>
              </header>

              {/* Stage */}
              <div className="work-modal-stage" aria-live="polite">
                <button
                  type="button"
                  className="work-modal-nav work-modal-nav-prev"
                  onClick={() => go(-1)}
                  aria-label="הקודם"
                  disabled={slides.length < 2}
                >
                  <span aria-hidden>→</span>
                </button>

                <motion.div
                  className="work-modal-stage-frame"
                  drag={slides.length > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={onDragEnd}
                >
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={index}
                      className="work-modal-stage-inner"
                      custom={direction}
                      initial={
                        reduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, x: direction * 40 }
                      }
                      animate={
                        reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }
                      }
                      exit={
                        reduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, x: direction * -40 }
                      }
                      transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <SlideRenderer
                        slide={slide}
                        eager
                        onZoom={openLightbox}
                      />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                <button
                  type="button"
                  className="work-modal-nav work-modal-nav-next"
                  onClick={() => go(1)}
                  aria-label="הבא"
                  disabled={slides.length < 2}
                >
                  <span aria-hidden>←</span>
                </button>

                <div className="work-modal-counter" aria-hidden>
                  <span className="work-modal-counter-current">
                    {index + 1}
                  </span>
                  <span className="work-modal-counter-sep">/</span>
                  <span className="work-modal-counter-total">
                    {slides.length}
                  </span>
                </div>
              </div>

              {work.modalNote && (
                <p className="work-modal-note">{work.modalNote}</p>
              )}

              {/* Thumbnail strip */}
              {slides.length > 1 && (
                <div
                  className="work-modal-thumbs"
                  role="tablist"
                  aria-label="שקפי הפרויקט"
                >
                  {slides.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`עבור לשקף ${i + 1}`}
                      className={`work-modal-thumb ${
                        i === index ? "is-active" : ""
                      }`}
                      onClick={() => goTo(i)}
                    >
                      <ThumbContent slide={s} eager={shouldLoad(i)} />
                    </button>
                  ))}
                </div>
              )}

              <div className="work-modal-cta-wrap">
                <a
                  href="#contact"
                  className="work-modal-cta"
                  onClick={onClose}
                >
                  רוצים מותג כזה? בואו נדבר <span aria-hidden>←</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Lightbox
        items={lightboxItems}
        startIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    </>,
    document.body,
  );
}

// ---------- Slide renderers ----------

function SlideRenderer({
  slide,
  eager,
  onZoom,
}: {
  slide: Slide;
  eager: boolean;
  onZoom: (src: string, alt: string) => void;
}) {
  const reduceMotion = useReducedMotion();

  if (slide.kind === "logoCompare") {
    return (
      <div className="slide-logo-compare" aria-label="השוואת לוגו לפני ואחרי">
        {/* RTL flow: first child is on the right ("after"). */}
        <figure className="slide-logo-side slide-logo-after">
          <button
            type="button"
            className="slide-logo-button slide-logo-button-after"
            onClick={() => onZoom(slide.afterSrc, slide.afterAlt)}
            aria-label={`הגדלה: ${slide.afterAlt}`}
          >
            <SafeImage
              src={slide.afterSrc}
              alt={slide.afterAlt}
              fill
              sizes="(min-width: 768px) 380px, 45vw"
              quality={85}
              loading={eager ? "eager" : "lazy"}
              className="slide-logo-img"
            />
          </button>
          <figcaption className="slide-logo-cap slide-logo-cap-after">אחרי</figcaption>
        </figure>

        <div className="slide-logo-divider" aria-hidden />

        <figure className="slide-logo-side slide-logo-before">
          <button
            type="button"
            className="slide-logo-button slide-logo-button-before"
            onClick={() => onZoom(slide.beforeSrc, slide.beforeAlt)}
            aria-label={`הגדלה: ${slide.beforeAlt}`}
          >
            <SafeImage
              src={slide.beforeSrc}
              alt={slide.beforeAlt}
              fill
              sizes="(min-width: 768px) 380px, 45vw"
              quality={85}
              loading={eager ? "eager" : "lazy"}
              className="slide-logo-img"
            />
          </button>
          <figcaption className="slide-logo-cap slide-logo-cap-before">לפני</figcaption>
        </figure>
      </div>
    );
  }

  if (slide.kind === "highlight") {
    return (
      <button
        type="button"
        className={`slide-highlight ${reduceMotion ? "" : "slide-highlight-float"}`}
        onClick={() => onZoom(slide.src, slide.alt)}
        aria-label={`הגדלה: ${slide.alt}`}
      >
        <span className="slide-highlight-glow" aria-hidden />
        <span className="slide-highlight-frame">
          <SafeImage
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="(min-width: 1024px) 720px, 90vw"
            quality={88}
            loading={eager ? "eager" : "lazy"}
            className="slide-highlight-img"
          />
        </span>
      </button>
    );
  }

  // default image slide
  return (
    <button
      type="button"
      className="slide-image"
      onClick={() => onZoom(slide.src, slide.alt)}
      aria-label={`הגדלה: ${slide.alt}`}
    >
      <SafeImage
        src={slide.src}
        alt={slide.alt}
        fill
        sizes="(min-width: 1024px) 800px, 92vw"
        quality={85}
        loading={eager ? "eager" : "lazy"}
        className="slide-image-img"
      />
    </button>
  );
}

function ThumbContent({ slide, eager }: { slide: Slide; eager: boolean }) {
  if (slide.kind === "logoCompare") {
    return (
      <div className="work-modal-thumb-compare">
        <SafeImage
          src={slide.afterSrc}
          alt={slide.afterAlt}
          fill
          sizes="80px"
          quality={70}
          loading={eager ? "eager" : "lazy"}
          className="work-modal-thumb-img"
        />
      </div>
    );
  }
  return (
    <SafeImage
      src={slide.src}
      alt={slide.alt}
      fill
      sizes="80px"
      quality={70}
      loading={eager ? "eager" : "lazy"}
      className="work-modal-thumb-img"
    />
  );
}
