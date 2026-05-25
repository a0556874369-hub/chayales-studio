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
    sec4Start: 3700,
    sec4End: 4500,
    sec5Start: 4700,
    sec5Mid: 5400,
    sec5End: 6200,
  });

  useEffect(() => {
    const measure = () => {
      setVw(window.innerWidth);
      const newVh = window.innerHeight;
      setVh(newVh);

      const sec2 = document.getElementById("before-after");
      const sec3 = document.getElementById("works");
      const sec4 = document.getElementById("services");
      const sec5 = document.getElementById("why-clean-code");
      if (!sec2 || !sec3 || !sec4) return;

      const sec2Top = sec2.getBoundingClientRect().top + window.scrollY;
      const sec3Top = sec3.getBoundingClientRect().top + window.scrollY;
      const sec4Top = sec4.getBoundingClientRect().top + window.scrollY;

      const sec4Bottom = sec4Top + sec4.offsetHeight;
      const sec5Top = sec5
        ? sec5.getBoundingClientRect().top + window.scrollY
        : sec4Bottom + 200;
      const sec5Height = sec5 ? sec5.offsetHeight : newVh * 1.5;

      setBp({
        sec2Start: sec2Top - newVh * 0.3,
        sec2Mid: sec2Top + (sec3Top - sec2Top) / 2,
        sec3Mid: sec3Top + (sec4Top - sec3Top) / 2,
        sec3End: sec4Top - newVh * 0.15,
        sec4Start: sec4Top + newVh * 0.1,
        sec4End: sec4Top + newVh * 0.9,
        sec5Start: sec5Top - newVh * 0.2,
        sec5Mid: sec5Top + sec5Height * 0.45,
        sec5End: sec5Top + sec5Height + newVh * 0.1,
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
    bp.sec4Start,
    bp.sec4End,
    bp.sec5Start,
    bp.sec5Mid,
    bp.sec5End,
  ];

  // בסקשן 5: ה-Orb הופך לגיבור - אטום מלא (1.0), גודל סביר, ממורכז
  const opacity = useTransform(scrollY, points, [
    0,    // top
    0,    // sec2Start
    0.35, // sec2Mid
    0.22, // sec3Mid
    0,    // sec3End
    0.35, // sec4Start
    0.65, // sec4End
    0.5,  // sec5Start - גדל באופציטי
    1.0,  // sec5Mid - אטום מלא, הגיבור
    0.3,  // sec5End - דהיה
  ]);

  // x - בסקשן 5 ממורכז מושלם (0)
  const x = useTransform(scrollY, points, [
    0,
    0,
    vw * 0.18,
    vw * 0.40,
    vw * 0.42,
    vw * 0.32,
    vw * 0.20,
    vw * 0.05, // sec5Start - מתקרב למרכז
    0,         // sec5Mid - מרכז מושלם
    0,         // sec5End
  ]);

  // y - בסקשן 5 ממורכז אנכית
  const y = useTransform(scrollY, points, [
    0,
    0,
    0,
    0,
    vh * 0.20,
    vh * 0.20,
    vh * 0.20,
    vh * 0.05,
    0,
    0,
  ]);

  // scale - חשוב! בסקשן 5 גודל יחסי קטן (לא ענק)
  // ה-orb הבסיסי הוא בערך 400px. בscale 0.95 הוא יהיה ~380px = יפה וממוקם
  const scale = useTransform(scrollY, points, [
    0.5,
    0.5,
    0.6,
    0.45,
    0.3,
    0.5,
    0.9,
    0.85, // sec5Start
    0.95, // sec5Mid - הגודל היפה והמכובד
    0.7,  // sec5End
  ]);

  const rotate = useTransform(scrollY, points, [
    0, 0, 0.5, 0, 0, -0.5, -1, -0.5, 0, 0.5,
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
