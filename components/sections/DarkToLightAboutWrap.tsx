"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/**
 * עוטף את סקשן About ויוצר מעבר חלק dark→light לפניו.
 * (Process כהה → About בהיר)
 * המעבר מאוחד עם הסגנון של DarkToLightWrap המקורי: 7 stops על 430px.
 *
 * כותב CSS var: --about-content-top (איפה About מתחיל = סוף המעבר)
 */
export default function DarkToLightAboutWrap({ children }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const update = () => {
      const wrapTop = wrap.getBoundingClientRect().top;
      const innerTop = inner.getBoundingClientRect().top - wrapTop;
      wrap.style.setProperty("--about-content-top", `${innerTop}px`);
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
    <div className="dark-to-light-about-wrap" ref={wrapRef}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
