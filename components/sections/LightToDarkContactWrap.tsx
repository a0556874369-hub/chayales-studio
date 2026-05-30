"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/**
 * עוטף את סקשן Contact ויוצר מעבר חלק light→dark לפניו.
 * (About בהיר → Contact כהה)
 * המעבר משתמש באותו פלטה כמו DarkToLightWrap, אבל בכיוון הפוך.
 *
 * כותב CSS var: --contact-content-top (איפה Contact מתחיל = סוף המעבר)
 */
export default function LightToDarkContactWrap({ children }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const update = () => {
      const wrapTop = wrap.getBoundingClientRect().top;
      const innerTop = inner.getBoundingClientRect().top - wrapTop;
      wrap.style.setProperty("--contact-content-top", `${innerTop}px`);
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
    <div className="light-to-dark-contact-wrap" ref={wrapRef}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
