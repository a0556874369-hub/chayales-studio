"use client";

// Four diffused beams of teal light, fixed to the viewport.
// Each ray BREATHES via its own CSS keyframe (different durations so the
// composite motion never visibly repeats).
// The inner container also DRIFTS toward the cursor — single mousemove
// listener feeding a single rAF lerp; no DOM writes per event.
// Both systems are disabled under prefers-reduced-motion. The cursor-drift
// is additionally disabled on touch-only devices.

import { useEffect, useRef } from "react";

const MAX_TRANSLATE_PX = 40;
const LERP = 0.06;

export default function LightRays() {
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let rafId = 0;

    const tick = () => {
      curX += (targetX - curX) * LERP;
      curY += (targetY - curY) * LERP;
      el.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`;
      if (Math.abs(curX - targetX) > 0.05 || Math.abs(curY - targetY) > 0.05) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    };

    const handleMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetX = nx * MAX_TRANSLATE_PX;
      targetY = ny * MAX_TRANSLATE_PX;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafId) cancelAnimationFrame(rafId);
      el.style.transform = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden
    >
      <div
        ref={innerRef}
        className="lightrays-inner"
        style={{ position: "absolute", inset: 0, willChange: "transform" }}
      >
        {/* Ray 1 — strong diagonal from top-right to bottom-left.
            Transform (rotation + breathing) handled by the .lightray-N class
            so it can override any earlier inline transform. */}
        <div
          className="lightray lightray-1"
          style={{
            position: "absolute",
            top: "-30%",
            right: "-20%",
            width: "50%",
            height: "160%",
            background:
              "linear-gradient(135deg, transparent 35%, rgba(77, 216, 229, 0.25) 50%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />

        {/* Ray 2 — diagonal from top-left toward bottom-right */}
        <div
          className="lightray lightray-2"
          style={{
            position: "absolute",
            top: "-20%",
            left: "-15%",
            width: "45%",
            height: "140%",
            background:
              "linear-gradient(45deg, transparent 30%, rgba(110, 191, 201, 0.20) 50%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />

        {/* Ray 3 — narrow, intense vertical beam, slightly tilted */}
        <div
          className="lightray lightray-3"
          style={{
            position: "absolute",
            top: "-10%",
            left: "60%",
            width: "15%",
            height: "120%",
            background:
              "linear-gradient(180deg, rgba(184, 232, 237, 0.18) 0%, rgba(77, 216, 229, 0.10) 50%, transparent 100%)",
            filter: "blur(40px)",
          }}
        />

        {/* Ray 4 — wide, soft uplight from the bottom-center */}
        <div
          className="lightray lightray-4"
          style={{
            position: "absolute",
            bottom: "-20%",
            left: "20%",
            width: "60%",
            height: "80%",
            background:
              "linear-gradient(0deg, rgba(45, 136, 150, 0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>
    </div>
  );
}
