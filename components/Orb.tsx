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
    sec8Start: 8700,
    sec8End: 9500,
    sec9Start: 9700,
    sec9End: 10500,
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
      const sec8 = document.getElementById("about");
      const sec9 = document.getElementById("contact");
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

      const sec8Top = sec8
        ? sec8.getBoundingClientRect().top + window.scrollY
        : sec6Bottom + 100;
      const sec8Bottom = sec8Top + (sec8 ? sec8.offsetHeight : newVh);

      const sec9Top = sec9
        ? sec9.getBoundingClientRect().top + window.scrollY
        : sec8Bottom + 100;
      const sec9Bottom = sec9Top + (sec9 ? sec9.offsetHeight : newVh);

      setBp({
        sec2Start: sec2Top - newVh * 0.3,
        sec2Mid: sec2Top + (sec3Top - sec2Top) / 2,
        sec3Mid: sec3Top + sec3.offsetHeight * 0.5,
        sec3End: sec3Bottom - newVh * 0.1,
        sec5Start: sec5Top + newVh * 0.05,
        sec5Mid: sec5Top + sec5Height * 0.5,
        sec5End: sec5Bottom - newVh * 0.05,
        sec4Start: sec4Top + newVh * 0.15,
        sec4End: sec4Bottom - newVh * 0.1,
        sec6Start: sec6Top + newVh * 0.05,
        sec6End: sec6Bottom - newVh * 0.5,
        sec8Start: sec8Top - newVh * 0.1,
        sec8End: sec8Bottom - newVh * 0.1,
        sec9Start: sec9Top + newVh * 0.05,
        sec9End: sec9Bottom - newVh * 0.1,
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
    bp.sec8Start,
    bp.sec8End,
    bp.sec9Start,
    bp.sec9End,
  ];

  // opacity - בסקשן 9 (Contact) אמביינטי על רקע כהה
  const opacity = useTransform(scrollY, points, [
    0, 0, 0.35, 0.22, 0.28, 0.35, 0.40, 0.32, 0.45, 0.35, 0.18, 0.02,
    0.18, 0.25,
    // sec9: ambient על רקע כהה, דועך לאפס בסוף
    0.30,
    0.08,
  ]);

  // x - בסקשן 9 ממוקם בצד שמאל ויזואלית (רחוק מהטופס שבימין)
  const x = useTransform(scrollY, points, [
    0, 0, vw * 0.18, vw * 0.40, vw * 0.42, vw * 0.38, vw * 0.32,
    vw * 0.28, vw * 0.22, vw * 0.32, vw * 0.42, vw * 0.55,
    -vw * 0.30, -vw * 0.35,
    // sec9: ממשיך משמאל
    -vw * 0.40,
    -vw * 0.45,
  ]);

  // y - בסקשן 9 בגובה אמצע, ירידה עדינה לסוף
  const y = useTransform(scrollY, points, [
    0, 0, 0, 0, vh * 0.10, vh * 0.05, -vh * 0.02, -vh * 0.05,
    vh * 0.10, -vh * 0.05, -vh * 0.20, -vh * 0.50,
    -vh * 0.10, -vh * 0.05,
    // sec9: עולה מעט
    -vh * 0.15,
    -vh * 0.25,
  ]);

  // scale - בסקשן 9 בינוני-קטן, אמביינטי
  const scale = useTransform(scrollY, points, [
    0.5, 0.5, 0.6, 0.55, 0.5, 0.48, 0.52, 0.5, 0.65, 0.4, 0.25, 0.1,
    0.45, 0.55,
    // sec9: גודל בינוני
    0.50,
    0.35,
  ]);

  const rotate = useTransform(scrollY, points, [
    0, 0, 0.5, 0, 0, -0.3, -0.5, -0.3, 0, 0.3, 0.6, 1, 1.2, 1.4, 1.6, 1.8,
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
