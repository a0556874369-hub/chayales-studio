"use client";

// Single source of truth for the "glass responds to mouse" effect used by
// every card on the site (work cards, service cards).
//
// On pointermove the hook writes four CSS custom properties on the host
// element:
//   --rx, --ry   — degrees for rotateX/rotateY (tilt)
//   --mx, --my   — % position for the shine radial-gradient
// CSS picks these up on a child .*-tilt wrapper (for the transform) and on
// the ::after of that wrapper (for the shine). No React state, no setState
// in the rAF loop — just style.setProperty + a single rAF lerp.
//
// Disabled when the user prefers reduced motion, and on touch-only devices
// (matchMedia "(hover: hover)").

import { useEffect, useRef } from "react";

const MAX_TILT_DEG = 6;
const LERP = 0.18; // approach factor per frame — higher = snappier

export function useGlassInteraction<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    // Target values (set by pointermove)
    let targetRX = 0;
    let targetRY = 0;
    let mx = 50;
    let my = 50;
    // Current (smoothed) values
    let curRX = 0;
    let curRY = 0;
    let rafId = 0;
    let inside = false;

    const tick = () => {
      curRX += (targetRX - curRX) * LERP;
      curRY += (targetRY - curRY) * LERP;
      el.style.setProperty("--rx", `${curRX.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${curRY.toFixed(2)}deg`);
      el.style.setProperty("--mx", `${mx.toFixed(1)}%`);
      el.style.setProperty("--my", `${my.toFixed(1)}%`);

      const settled =
        Math.abs(curRX - targetRX) < 0.01 &&
        Math.abs(curRY - targetRY) < 0.01;
      if (!settled || inside) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    };

    const scheduleTick = () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      // Press-toward-cursor model: the corner under the cursor sinks back.
      // rotateY = positive → card's right side moves back.
      // rotateX = positive → card's top moves back.
      targetRY = (px - 0.5) * 2 * MAX_TILT_DEG;
      targetRX = (0.5 - py) * 2 * MAX_TILT_DEG;
      mx = px * 100;
      my = py * 100;
      scheduleTick();
    };

    const handleEnter = () => {
      inside = true;
      el.setAttribute("data-glass-active", "1");
      scheduleTick();
    };

    const handleLeave = () => {
      inside = false;
      targetRX = 0;
      targetRY = 0;
      el.removeAttribute("data-glass-active");
      scheduleTick();
    };

    el.addEventListener("pointerenter", handleEnter);
    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);

    return () => {
      el.removeEventListener("pointerenter", handleEnter);
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
      if (rafId) cancelAnimationFrame(rafId);
      el.removeAttribute("data-glass-active");
    };
  }, []);

  return ref;
}
