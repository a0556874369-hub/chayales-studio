"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import SafeImage from "./SafeImage";

interface LightboxProps {
  src: string | null;
  alt: string;
  onClose: () => void;
}

// Full-screen image zoom overlay. Mounted as a portal directly into <body> so
// it sits above the modal. ESC closes; click on backdrop closes; click on the
// image itself does not.
export default function Lightbox({ src, alt, onClose }: LightboxProps) {
  useEffect(() => {
    if (!src) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [src, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {src && (
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
          <motion.div
            className="lightbox-image-wrap"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <SafeImage
              src={src}
              alt={alt}
              fill
              sizes="100vw"
              quality={90}
              className="lightbox-image"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
