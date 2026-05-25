"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function Orb() {
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  const [vw, setVw] = useState(1024);
  const [vh, setVh] = useState(800);

  // ===== הסדר החדש: =====
  // sec2 = before-after (כהה)
  // sec3 = works (בהיר)
  // sec5 = why-clean-code (בהיר) - בא אחרי works
  // sec4 = services (כהה) - בא אחרי why
  const [bp, setBp] = useState({
    sec2Start: 800,
    sec2Mid: 1500,
    sec3Mid: 2400,
    sec3End: 3500,
    sec5Start: 3700,    // why-clean-code מתחיל
    sec5Mid: 4400,      // why-clean-code אמצע
    sec5End: 5200,      // why-clean-code סוף
    sec4Start: 5400,    // services מתחיל
    sec4End: 6300,      // services סוף
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
      if (!sec2 || !sec3) return;

      const sec2Top = sec2.getBoundingClientRect().top + window.scrollY;
      const sec3Top = sec3.getBoundingClientRect().top + window.scrollY;
      const sec3Bottom = sec3Top + sec3.offsetHeight;

      // אם חסרים סקשנים - נשתמש בערכי ברירת מחדל
      const sec5Top = sec5
        ? sec5.getBoundingClientRect().top + window.scrollY
        : sec3Bottom + 100;
      const sec5Height = sec5 ? sec5.offsetHeight : newVh * 1.5;
      const sec5Bottom = sec5Top + sec5Height;

      const sec4Top = sec4
        ? sec4.getBoundingClientRect().top + window.scrollY
        : sec5Bottom + 100;
      const sec4Bottom = sec4Top + (sec4 ? sec4.offsetHeight : newVh);

      setBp({
        sec2Start: sec2Top - newVh * 0.3,
        sec2Mid: sec2Top + (sec3Top - sec2Top) / 2,
        sec3Mid: sec3Top + sec3.offsetHeight * 0.5,
        sec3End: sec3Bottom - newVh * 0.1,
        // מעבר חלק: סקשן 3 נגמר, סקשן 5 (why) מתחיל - שניהם בהירים, ה-Orb ממשיך לזרום
        sec5Start: sec5Top + newVh * 0.05,
        sec5Mid: sec5Top + sec5Height * 0.5,
        sec5End: sec5Bottom - newVh * 0.05,
        // services - חזרה לכהה
        sec4Start: sec4Top + newVh * 0.15,
        sec4End: sec4Bottom - newVh * 0.1,
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
    bp.sec5Start,  // why-clean-code start
    bp.sec5Mid,
    bp.sec5End,
    bp.sec4Start,  // services start
    bp.sec4End,
  ];

  // opacity - מעבר חלק וזורם, ללא קפיצות
  const opacity = useTransform(scrollY, points, [
    0,     // top
    0,     // sec2Start
    0.35,  // sec2Mid (כהה - עדין)
    0.22,  // sec3Mid (בהיר - דהוי)
    0.28,  // sec3End - מתחיל לעלות לקראת why
    0.35,  // sec5Start - why (בהיר)
    0.40,  // sec5Mid - שיא עדין
    0.32,  // sec5End - יורד
    0.45,  // sec4Start - services (כהה) - בולט יותר
    0.65,  // sec4End - שיא בכהה
  ]);

  // x - תנועה רציפה ללא קפיצות
  const x = useTransform(scrollY, points, [
    0,
    0,
    vw * 0.18,
    vw * 0.40,
    vw * 0.42,
    vw * 0.38,  // why start - ממשיך לאט שמאלה (בעברית RTL, ימינה מבחינה ויזואלית)
    vw * 0.32,  // why mid
    vw * 0.28,  // why end
    vw * 0.22,  // services start
    vw * 0.18,  // services end
  ]);

  // y - תנועה אנכית רציפה
  const y = useTransform(scrollY, points, [
    0,
    0,
    0,
    0,
    vh * 0.10,
    vh * 0.05,
    -vh * 0.02,
    -vh * 0.05,
    vh * 0.10,
    vh * 0.20,
  ]);

  // scale - מעבר חלק וזורם!
  // הקפיצה הקודמת היתה מ-0.9 ל-0.55 במהירות. עכשיו ההתכווצות מתחילה כבר באמצע סקשן 3
  // ויש מעבר הדרגתי לאורך כל הדרך
  const scale = useTransform(scrollY, points, [
    0.5,   // top
    0.5,   // sec2Start
    0.6,   // sec2Mid
    0.55,  // sec3Mid - מתחיל להתכווץ כבר כאן
    0.5,   // sec3End - ממשיך להתכווץ
    0.48,  // sec5Start - גודל דומה למצב הקודם, ללא קפיצה
    0.52,  // sec5Mid - גדל קצת לאמצע
    0.5,   // sec5End - יורד שוב
    0.65,  // sec4Start - גדל לחזרה לכהה
    0.9,   // sec4End - הגודל המקורי בסיום
  ]);

  const rotate = useTransform(scrollY, points, [
    0, 0, 0.5, 0, 0, -0.3, -0.5, -0.3, 0, 0.5,
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
