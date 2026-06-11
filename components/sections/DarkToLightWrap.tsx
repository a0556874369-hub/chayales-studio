"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  pas: ReactNode;         // כהה - ממשיך את הרצועה הכהה של ההירו
  works: ReactNode;       // בהיר
  beforeAfter: ReactNode; // כהה - אי כהה בתוך האזור הבהיר
  whyClean: ReactNode;    // בהיר
}

/**
 * עוטף את הסקשנים האמצעיים ויוצר גרדיאנט רציף אחד עם 4 פאזות:
 * dark (PAS) → light (Works) → dark (BeforeAfter) → light (WhyClean)
 *
 * הסיום בהיר כי אחריו Services (שיש לו LightToDarkWrap משלו) ממשיך
 * מבהיר לכהה.
 *
 * כותב 3 CSS vars - גבולות הפאזות (מצטברים מראש ה-wrapper):
 * --d1: סוף האזור הכהה הראשון (תחתית PAS) - מעבר dark→light
 * --c1: תחילת האזור הכהה השני (ראש BeforeAfter) - מעבר light→dark
 * --d2: סוף האזור הכהה השני (תחתית BeforeAfter) - מעבר dark→light
 */
export default function DarkToLightWrap({
  pas,
  works,
  beforeAfter,
  whyClean,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const pasRef = useRef<HTMLDivElement | null>(null);
  const worksRef = useRef<HTMLDivElement | null>(null);
  const baRef = useRef<HTMLDivElement | null>(null);
  const whyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const pasEl = pasRef.current;
    const worksEl = worksRef.current;
    const baEl = baRef.current;
    const whyEl = whyRef.current;
    if (!wrap || !pasEl || !worksEl || !baEl || !whyEl) return;

    const update = () => {
      const d1 = pasEl.offsetHeight;
      const c1 = d1 + worksEl.offsetHeight;
      const d2 = c1 + baEl.offsetHeight;
      wrap.style.setProperty("--d1", `${d1}px`);
      wrap.style.setProperty("--c1", `${c1}px`);
      wrap.style.setProperty("--d2", `${d2}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(pasEl);
    ro.observe(worksEl);
    ro.observe(baEl);
    ro.observe(whyEl);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="dark-to-light" ref={wrapRef}>
      <div ref={pasRef}>{pas}</div>
      <div ref={worksRef}>{works}</div>
      <div ref={baRef}>{beforeAfter}</div>
      <div ref={whyRef}>{whyClean}</div>
    </div>
  );
}
