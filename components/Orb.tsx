"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function Orb() {
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  const [vw, setVw] = useState(1024);
  const [vh, setVh] = useState(800);

  const [bp, setBp] = useState({
    sec2Start: 800,
    sec2Mid: 1500,
    sec3Mid: 2400,
    sec3End: 3500,
    sec5Start: 3700,
    sec5Mid: 4400,
    sec5End: 5200,
    sec4Start: 5400,
    sec4End: 6300,
    sec6Start: 6500,
    sec6End: 8500,
  });

  useEffect(() => {
    const measure = () => {
      setVw(window.innerWidth);
      const newVh = window.innerHeight;
      setVh(newVh);

      const sec2 = document.getElementById("before-after");
      const sec3 = document.getElementById("works");
      const sec5 = document.getElementById("why-clean-code");
      const sec4 = document.getElementById("services");
      const sec6 = document.getElementById("process");
      if (!sec2 || !sec3) return;

      const sec2Top = sec2.getBoundingClientRect().top + window.scrollY;
      const sec3Top = sec3.getBoundingClientRect().top + window.scrollY;
      const sec3Bottom = sec3Top + sec3.offsetHeight;

      const sec5Top = sec5
        ? sec5.getBoundingClientRect().top + window.scrollY
        : sec3Bottom + 100;
      const sec5Height = sec5 ? sec5.offsetHeight : newVh * 1.5;
      const sec5Bottom = sec5Top + sec5Height;

      const sec4Top = sec4
        ? sec4.getBoundingClientRect().top + window.scrollY
        : sec5Bottom + 100;
      const sec4Bottom = sec4Top + (sec4 ? sec4.offsetHeight : newVh);

      const sec6Top = sec6
        ? sec6.getBoundingClientRect().top + window.scrollY
        : sec4Bottom + 100;
      const sec6Bottom = sec6Top + (sec6 ? sec6.offsetHeight : newVh * 4);

      setBp({
        sec2Start: sec2Top - newVh * 0.3,
        sec2Mid: sec2Top + (sec3Top - sec2Top) / 2,
        sec3Mid: sec3Top + sec3.offsetHeight * 0.5,
        sec3End: sec3Bottom - newVh * 0.1,
        sec5Start: sec5Top + newVh * 0.05,
        sec5Mid: sec5Top + sec5Height * 0.5,
        // ===== תיקון: sec5End זז קרוב יותר לסוף Services =====
        // ככה הכדור מתחיל להתכווץ כבר באמצע Services
        sec5End: sec5Bottom - newVh * 0.05,
        sec4Start: sec4Top + newVh * 0.15,
        sec4End: sec4Bottom - newVh * 0.1,
        sec6Start: sec6Top + newVh * 0.05,
        sec6End: sec6Bottom - newVh * 0.5,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    document.querySelectorAll("section").forEach((s) => ro.observe(s));
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const points = [
    0,
    bp.sec2Start,
    bp.sec2Mid,
    bp.sec3Mid,
    bp.sec3End,
    bp.sec5Start,
    bp.sec5Mid,
    bp.sec5End,
    bp.sec4Start,
    bp.sec4End,
    bp.sec6Start,
    bp.sec6End,
  ];

  // opacity
  const opacity = useTransform(scrollY, points, [
    0, 0, 0.35, 0.22, 0.28, 0.35, 0.40, 0.32,
    0.45,
    // ===== תיקון sec4End: יורד ל-0.35 (במקום 0.65) =====
    // הכדור כבר מתחיל לדהות בסוף Services
    0.35,
    // ===== תיקון sec6Start: עדין יותר =====
    0.18,
    0.02, // sec6End: כמעט נעלם
  ]);

  // x - מתחיל לזוז ימינה כבר בסוף Services
  const x = useTransform(scrollY, points, [
    0, 0, vw * 0.18, vw * 0.40, vw * 0.42, vw * 0.38, vw * 0.32,
    vw * 0.28, vw * 0.22,
    // ===== תיקון sec4End: זז יותר ימינה כבר עכשיו =====
    vw * 0.32,
    vw * 0.42, // sec6Start: ממשיך ימינה
    vw * 0.55, // sec6End: מחוץ למסך לחלוטין
  ]);

  // y - מתחיל לעלות כבר בסוף Services
  const y = useTransform(scrollY, points, [
    0, 0, 0, 0, vh * 0.10, vh * 0.05, -vh * 0.02, -vh * 0.05,
    vh * 0.10,
    // ===== תיקון sec4End: כבר מתחיל לעלות (לא יורד למטה) =====
    -vh * 0.05,
    -vh * 0.20, // sec6Start: למעלה
    -vh * 0.50, // sec6End: מעל המסך
  ]);

  // scale - **התיקון העיקרי**
  const scale = useTransform(scrollY, points, [
    0.5, 0.5, 0.6, 0.55, 0.5, 0.48, 0.52, 0.5,
    0.65,
    // ===== תיקון sec4End: יורד ל-0.4 (במקום 0.9 הענקי) =====
    // הכדור כבר התכווץ עד שהגענו לסוף Services
    0.4,
    // ===== תיקון sec6Start: קטן עוד יותר =====
    0.25,
    0.1, // sec6End: כמעט נעלם לגמרי
  ]);

  const rotate = useTransform(scrollY, points, [
    0, 0, 0.5, 0, 0, -0.3, -0.5, -0.3, 0, 0.3, 0.6, 1,
  ]);

  if (prefersReducedMotion) {
    return (
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
          overflow: "hidden",
        }}
      >
        <div
          className="orb"
          style={{
            opacity: 0.65,
            transform: `translate(-50%, -50%) scale(0.9)`,
          }}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 2,
        overflow: "hidden",
      }}
    >
      <motion.div
        className="orb"
        style={{ x, y, scale, opacity, rotate }}
        transformTemplate={(_, generated) =>
          `translate(-50%, -50%) ${generated}`
        }
      />
    </div>
  );
}
