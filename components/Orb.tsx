"use client";

// A single teal 3D-ish sphere that accompanies the scroll across the page.
// - Hidden during Hero.
// - Slides in from the right and settles ~40% off the right edge in Section 2.
// - Fades out completely across Section 3 (the gallery shouldn't compete).
// - Reappears centred and large in Section 4.
//
// CSS-only sphere (no image asset) — see .orb in globals.css.
// Position/scale/opacity are scroll-coupled via framer-motion useScroll +
// useTransform. The wrapper is position:fixed with overflow:hidden so the
// orb can sit ~40% off-screen on the right without inducing horizontal
// scroll. pointer-events:none means clicks pass through to content below.

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

  // Viewport width — drives the mobile/desktop fork for max horizontal
  // displacement and the Section 4 final scale.
  const [vw, setVw] = useState(1024);

  // Scroll-Y breakpoints. Defaults are reasonable for first paint; the
  // measure() effect below replaces them with the actual section offsets
  // as soon as the DOM is laid out.
  const [bp, setBp] = useState({
    sec2Start: 800,
    sec2Mid: 1500,
    sec3Start: 2400,
    sec3End: 3500,
    sec4Start: 3700,
    sec4Mid: 4500,
  });

  useEffect(() => {
    const measure = () => {
      setVw(window.innerWidth);

      const sec2 = document.getElementById("before-after");
      const sec3 = document.getElementById("works");
      const sec4 = document.getElementById("services");
      if (!sec2 || !sec3 || !sec4) return;

      // offsetTop is relative to the offsetParent. The sections live inside
      // DarkToLightWrap which lives inside <main>. We need page-relative Y
      // so getBoundingClientRect + scrollY is the safer measurement.
      const sec2Top = sec2.getBoundingClientRect().top + window.scrollY;
      const sec3Top = sec3.getBoundingClientRect().top + window.scrollY;
      const sec4Top = sec4.getBoundingClientRect().top + window.scrollY;
      const vh = window.innerHeight;

      setBp({
        sec2Start: sec2Top - vh * 0.3,
        sec2Mid: (sec2Top + sec3Top) / 2,
        sec3Start: sec3Top - vh * 0.3,
        sec3End: sec3Top + (sec4Top - sec3Top) * 0.7,
        sec4Start: sec4Top - vh * 0.3,
        sec4Mid: sec4Top + vh * 0.5,
      });
    };

    measure();
    window.addEventListener("resize", measure);
    // Re-measure if any section resizes (images load, modal closes, etc.).
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

  // Always provide a strictly-increasing input array — framer-motion
  // requires it. The defaults satisfy this; after measure() the real
  // section offsets are also strictly increasing top → bottom.
  const points = [
    0,
    bp.sec2Start,
    bp.sec2Mid,
    bp.sec3Start,
    bp.sec3End,
    bp.sec4Start,
    bp.sec4Mid,
  ];

  const opacity = useTransform(
    scrollY,
    points,
    [0, 0, 0.65, 0.65, 0, 0, 0.7],
  );
  const x = useTransform(scrollY, points, [0, 0, xMax, xMax, 0, 0, 0]);
  const scale = useTransform(
    scrollY,
    points,
    [0.6, 0.6, 1, 1, 0.8, 0.8, scaleSec4],
  );
  const rotate = useTransform(scrollY, points, [0, 0, 1, 1, 0, 0, -1.5]);

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
            opacity: 0.7,
            transform: `translate(-50%, -50%) scale(${scaleSec4})`,
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
      <motion.div className="orb" style={{ x, scale, opacity, rotate }} />
    </div>
  );
}
