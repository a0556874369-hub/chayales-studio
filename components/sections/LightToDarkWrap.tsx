"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/**
 * עוטף את Services ויוצר מעבר light→dark חלק וזורם.
 * המעבר הוא מראה של DarkToLightWrap (סקשנים 2→3) - אותם 7 stops של צבעים
 * אבל בכיוון הפוך.
 *
 * כותב CSS var: --services-content-top - איפה Services מתחיל (סוף המעבר)
 */
export default function LightToDarkWrap({ children }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const update = () => {
      const wrapTop = wrap.getBoundingClientRect().top;
      const innerTop = inner.getBoundingClientRect().top - wrapTop;
      // המעבר נגמר כשהתוכן של Services מתחיל
      // ה-padding העליון של Services כבר כהה - לכן נשאיר 430px של מעבר לפני זה
      wrap.style.setProperty("--services-content-top", `${innerTop}px`);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(inner);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="light-to-dark-wrap" ref={wrapRef}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
