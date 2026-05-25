"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  s2: ReactNode;  // BeforeAfter (כהה)
  s3: ReactNode;  // Works (בהיר)
  s5: ReactNode;  // WhyCleanCode (בהיר) - חדש, מחליף את s4 הישן
}

/**
 * עוטף את 3 הסקשנים האמצעיים ויוצר גרדיאנט רציף:
 * dark (BeforeAfter) → teal → light (Works + WhyClean)
 *
 * שינוי מהגרסה הקודמת: עכשיו הוא לא חוזר לכהה בסוף.
 * הסיום בהיר כי אחריו Services (שיש לו LightToDarkWrap משלו) ממשיך מבהיר לכהה.
 *
 * כותב CSS vars: --s2h (גובה BeforeAfter), --bright-start (איפה מתחיל הבהיר)
 */
export default function DarkToLightWrap({ s2, s3, s5 }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const s2Ref = useRef<HTMLDivElement | null>(null);
  const s3Ref = useRef<HTMLDivElement | null>(null);
  const s5Ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const s2el = s2Ref.current;
    const s3el = s3Ref.current;
    const s5el = s5Ref.current;
    if (!wrap || !s2el || !s3el || !s5el) return;

    const update = () => {
      const s2h = s2el.offsetHeight;
      wrap.style.setProperty("--s2h", `${s2h}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(s2el);
    ro.observe(s3el);
    ro.observe(s5el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="dark-to-light" ref={wrapRef}>
      <div ref={s2Ref}>{s2}</div>
      <div ref={s3Ref}>{s3}</div>
      <div ref={s5Ref}>{s5}</div>
    </div>
  );
}
