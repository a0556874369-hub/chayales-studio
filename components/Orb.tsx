"use client";

// A single teal 3D-ish sphere that accompanies the scroll across the page.
// - Hidden during Hero.
// - Rises in DURING the Hero→Section 2 transition so it's already settled
//   on the right (xMax, opacity 0.65) by the time Section 2 begins.
// - Fades out completely across Section 3 (the gallery shouldn't compete).
// - Reappears in Section 4, scaled up and pushed DOWN (~25vh) so it sits
//   behind the card row instead of behind the headline. The cards'
//   backdrop-blur softens the orb where they overlap; the headline + sub
//   sit on clean air above it.
//
// CSS-only sphere (no image asset) — see .orb in globals.css.
// Position / scale / opacity / y / rotate are all scroll-coupled via
// framer-motion useScroll + useTransform. The wrapper is position:fixed
// with overflow:hidden so the orb can sit ~40% off-screen on the right
// without inducing horizontal scroll. pointer-events:none means clicks
// pass through to content below.

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

  // Viewport size drives mobile/desktop forks and the Section-4 downward
  // offset. Updated in measure() below.
  const [vw, setVw] = useState(1024);
  const [vh, setVh] = useState(800);

  // Scroll-Y breakpoints. Defaults are reasonable for first paint; the
  // measure() effect below replaces them with the actual section offsets
  // as soon as the DOM is laid out.
  const [bp, setBp] = useState({
    orbInStart: 600,
    orbInEnd: 1100,
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
        orbInStart: sec2Top - newVh * 0.6, // 60vh before sec 2 — start
        orbInEnd: sec2Top + newVh * 0.1, //  10vh into sec 2 — settled
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
  // In Section 4 the orb drops 25vh below centre so its body sits behind
  // the card row, not behind the headline.
  const yOffsetSec4 = vh * 0.25;

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
  const x = useTransform(scrollY, points, [0, 0, xMax, xMax, 0, 0, 0]);
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
  const rotate = useTransform(scrollY, points, [0, 0, 1, 1, 0, 0, -1.5]);

  // prefers-reduced-motion: render only the Section 4 final pose,
  // static — including the new downward offset.
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
