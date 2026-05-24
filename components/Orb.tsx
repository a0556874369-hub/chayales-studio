"use client";

// A single teal 3D-ish sphere that accompanies the scroll across the page.
// Acts:
//   1. Hero      — invisible.
//   2. Section 2 — appears settled on the right at full size, opacity
//                  0.65. The rise (opacity 0 → 0.65, x 0 → xMax,
//                  scale 0.6 → 1) happens BEFORE Section 2 begins, so
//                  by the time the user lands in Section 2 the orb is
//                  already in its final pose and stays there.
//   3. Section 3 — fades out (the gallery shouldn't compete).
//   4. Section 4 — returns centred, scaled up (1.58 desktop / 1.3 mobile),
//                  pushed ~25vh down so it sits behind the card row
//                  rather than the headline. Opacity 0.60 so the in-card
//                  text stays crisp through the glass blur.
//
// CSS-only sphere — see .orb in globals.css. All channels (x, y, scale,
// opacity, rotate) are scroll-coupled. The wrapper is position:fixed
// with overflow:hidden so the orb can sit ~40% off-screen on the right
// without inducing horizontal scroll. pointer-events:none → clicks pass
// through.

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";

export default function Orb() {
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  const [vw, setVw] = useState(1024);
  const [vh, setVh] = useState(800);

  // Defaults keep the layout sane for first paint; measure() below
  // replaces them with real section offsets.
  const [bp, setBp] = useState({
    orbInStart: 600, // approaching sec 2 — still invisible
    orbInEnd: 1100, // settled right pose by here
    sec3Start: 2400,
    sec3End: 3500,
    sec4Start: 3700,
    sec4Mid: 4500,
  });

  useEffect(() => {
    const measure = () => {
      const newVw = window.innerWidth;
      const newVh = window.innerHeight;
      setVw(newVw);
      setVh(newVh);

      const sec2 = document.getElementById("before-after");
      const sec3 = document.getElementById("works");
      const sec4 = document.getElementById("services");
      if (!sec2 || !sec3 || !sec4) return;

      const sec2Top = sec2.getBoundingClientRect().top + window.scrollY;
      const sec3Top = sec3.getBoundingClientRect().top + window.scrollY;
      const sec4Top = sec4.getBoundingClientRect().top + window.scrollY;

      setBp({
        // The rise happens DURING the Hero → Section 2 transition so the
        // orb is already settled at xMax by the time Section 2 begins.
        orbInStart: sec2Top - newVh * 0.6, // -60vh from sec 2 — start
        orbInEnd: sec2Top + newVh * 0.1, //  +10vh into sec 2 — settled
        sec3Start: sec3Top - newVh * 0.3,
        sec3End: sec3Top + (sec4Top - sec3Top) * 0.7,
        sec4Start: sec4Top - newVh * 0.3,
        sec4Mid: sec4Top + newVh * 0.5,
      });
    };

    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    document.querySelectorAll("section").forEach((s) => ro.observe(s));

    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  const isMobile = vw < 768;
  const xMax = isMobile ? vw * 0.3 : vw * 0.46;
  const scaleSec4 = isMobile ? 1.3 : 1.58;
  const yOffsetSec4 = vh * 0.25;

  // 7 stops. Index → meaning:
  //   0  page start
  //   1  orbInStart  (still invisible)
  //   2  orbInEnd    (settled at right, full pose)
  //   3  sec3Start
  //   4  sec3End
  //   5  sec4Start
  //   6  sec4Mid
  const points = [
    0,
    bp.orbInStart,
    bp.orbInEnd,
    bp.sec3Start,
    bp.sec3End,
    bp.sec4Start,
    bp.sec4Mid,
  ];

  const opacity = useTransform(
    scrollY,
    points,
    [0, 0, 0.65, 0.65, 0, 0, 0.6],
  );
  const x = useTransform(
    scrollY,
    points,
    [0, 0, xMax, xMax, xMax, 0, 0],
  );
  const y = useTransform(
    scrollY,
    points,
    [0, 0, 0, 0, 0, 0, yOffsetSec4],
  );
  const scale = useTransform(
    scrollY,
    points,
    [0.6, 0.6, 1, 1, 0.8, 0.8, scaleSec4],
  );
  const rotate = useTransform(
    scrollY,
    points,
    [0, 0, 1, 1, 0, 0, -1.5],
  );

  // prefers-reduced-motion: render only the Section 4 final pose, static.
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
            opacity: 0.6,
            transform: `translate(-50%, -50%) translateY(${yOffsetSec4}px) scale(${scaleSec4})`,
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
      <motion.div className="orb" style={{ x, y, scale, opacity, rotate }} />
    </div>
  );
}
