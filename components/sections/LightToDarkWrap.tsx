"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/**
 * עוטף את סקשן Services (שאחרי why-clean-code) ויוצר מעבר light→dark.
 * הסקשן עצמו על רקע כהה אבל המעבר לקראתו מתחיל בהיר וגומר כהה.
 * כותב CSS var: --services-dark-start (המיקום שבו מתחיל הכהה הסופי)
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
      // המעבר ל-dark מסתיים ב-15% מתחילת הסקשן (Services עצמו כהה מהר)
      const darkStart = innerTop + 300;
      wrap.style.setProperty("--services-dark-start", `${darkStart}px`);
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
