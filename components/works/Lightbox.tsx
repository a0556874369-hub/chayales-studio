"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SafeImage from "./SafeImage";

export interface LightboxItem {
  src: string;
  alt: string;
}

interface LightboxProps {
  // Pass an items array + the index of the clicked image to enable carousel
  // navigation. If you only have one image, pass a single-item array.
  items: LightboxItem[];
  startIndex: number | null;
  onClose: () => void;
}

// Full-screen image carousel. Mounted as a portal into <body> so it sits
// above the modal. ESC closes; arrow keys (RTL-aware) flip between items;
// click on backdrop closes; click on the image itself does not. The
// counter and arrows only appear when there's more than one item.
export default function Lightbox({ items, startIndex, onClose }: LightboxProps) {
  const open = startIndex !== null;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 prev, +1 next

  // Reset index whenever the caller opens with a new starting position.
  useEffect(() => {
    if (startIndex !== null) {
      setIndex(startIndex);
      setDirection(0);
    }
  }, [startIndex]);

  const goNext = useCallback(() => {
    if (items.length < 2) return;
    setDirection(1);
    setIndex((i) => (i + 1) % items.length);
  }, [items.length]);

  const goPrev = useCallback(() => {
    if (items.length < 2) return;
    setDirection(-1);
    setIndex((i) => (i - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // RTL mapping: ← visually means "next in reading order", → "prev".
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goNext();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goPrev();
        return;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose, goNext, goPrev]);

  if (typeof document === "undefined") return null;
  const current = open ? items[index] : null;
  const showArrows = items.length > 1;

  return createPortal(
    <AnimatePresence>
      {open && current && (
        <motion.div
          className="lightbox-backdrop"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="הגדלת תמונה"
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={onClose}
            aria-label="סגירת תצוגה מוגדלת"
          >
            ×
          </button>

          {showArrows && (
            <button
              type="button"
              className="lightbox-nav lightbox-nav-prev"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="התמונה הקודמת"
            >
              <span aria-hidden>→</span>
            </button>
          )}

          {showArrows && (
            <button
              type="button"
              className="lightbox-nav lightbox-nav-next"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="התמונה הבאה"
            >
              <span aria-hidden>←</span>
            </button>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              className="lightbox-image-wrap"
              onClick={(e) => e.stopPropagation()}
              custom={direction}
              initial={{ scale: 0.96, opacity: 0, x: direction * 30 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.96, opacity: 0, x: direction * -30 }}
              transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <SafeImage
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                quality={90}
                className="lightbox-image"
              />
            </motion.div>
          </AnimatePresence>

          {showArrows && (
            <div className="lightbox-counter" aria-hidden>
              <span className="lightbox-counter-current">{index + 1}</span>
              <span className="lightbox-counter-sep">/</span>
              <span className="lightbox-counter-total">{items.length}</span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
