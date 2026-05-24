"use client";

// A single teal sphere that lives as an AMBIENT presence across the whole
// scroll. Not a dramatic element — a quiet companion.
//
//   1. Hero       — invisible.
//   2. Section 2  — appears small (~22vw), shifted slightly right,
//                   opacity ~0.35. Doesn't block content.
//   3. Section 3  — stays present but smaller and more transparent
//                   (~17vw, opacity ~0.22), seen THROUGH the works
//                   cards rather than competing with them.
//   4. Transition — fades to 0 for a single moment between Sections 3
//                   and 4.
//   5. Section 4  — re-enters gently and grows + brightens slowly to a
//                   calm peak (~34vw, opacity 0.65). No "BOOM".
//
// CSS-only sphere — see .orb in globals.css. All channels (x, y, scale,
// opacity, rotate) are scroll-coupled. The wrapper is position:fixed
// with overflow:hidden. pointer-events:none → clicks pass through.

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
    sec2Start: 800,
    sec2Mid: 1500,
    sec3Mid: 2400,
    sec3End: 3500,
    sec4Start: 3700,
    sec4End: 4500,
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
        sec2Start: sec2Top - newVh * 0.3,
        sec2Mid: sec2Top + (sec3Top - sec2Top) / 2,
        sec3Mid: sec3Top + (sec4Top - sec3Top) / 2,
        sec3End: sec4Top - newVh * 0.15,
        sec4Start: sec4Top + newVh * 0.1,
        sec4End: sec4Top + newVh * 0.9,
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

  // 7 stops. Index → meaning:
  //   0  page start
  //   1  sec2Start  (still invisible)
  //   2  sec2Mid    (gentle reveal — small + right + low opacity)
  //   3  sec3Mid    (smaller + lower opacity — "under" the gallery)
  //   4  sec3End    (briefly fades to 0 for the 3→4 handoff)
  //   5  sec4Start  (returns gently)
  //   6  sec4End    (calm peak — bigger but still ~34vw, opacity 0.65)
  const points = [
    0,
    bp.sec2Start,
    bp.sec2Mid,
    bp.sec3Mid,
    bp.sec3End,
    bp.sec4Start,
    bp.sec4End,
  ];

  const opacity = useTransform(
    scrollY,
    points,
    [0, 0, 0.35, 0.22, 0, 0.35, 0.65],
  );
  const x = useTransform(
    scrollY,
    points,
    [0, 0, vw * 0.15, vw * 0.1, vw * 0.05, 0, 0],
  );
  // y stays at 0 (centre, ~40vh) through sections 2 and 3. At sec3End
  // the orb is opacity 0, so it can invisibly "fall" 20vh down — when it
  // re-emerges in sec 4 it's already centred lower at ~60vh, then grows
  // in place without shifting vertically.
  const y = useTransform(
    scrollY,
    points,
    [0, 0, 0, 0, vh * 0.2, vh * 0.2, vh * 0.2],
  );
  const scale = useTransform(
    scrollY,
    points,
    [0.5, 0.5, 0.6, 0.45, 0.3, 0.5, 0.9],
  );
  const rotate = useTransform(
    scrollY,
    points,
    [0, 0, 0.5, 0, 0, -0.5, -1],
  );

  // prefers-reduced-motion: render only the calm sec4End pose, static.
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
        // .orb in globals.css sets top:40vh / left:50vw and uses
        // transform: translate(-50%, -50%) to centre itself on that anchor.
        // framer-motion's inline `style.transform` REPLACES that base
        // transform, so without this template the anchor becomes the
        // top-left corner of the orb and it shifts ~half its size down and
        // right. transformTemplate prepends our centering translate to
        // whatever framer-motion generates, restoring the centre anchor.
        transformTemplate={(_values, generated) =>
          `translate(-50%, -50%) ${generated}`
        }
      />
    </div>
  );
}
