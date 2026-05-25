"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/**
 * עוטף את סקשן 5 בגרדיאנט אנכי dark → light → dark
 * כותב 2 CSS vars: --sec5-light-start, --sec5-light-end
 */
export default function LightWrap({ children }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const update = () => {
      const wrapTop = wrap.getBoundingClientRect().top;
      const innerTop = inner.getBoundingClientRect().top - wrapTop;
      const innerHeight = inner.offsetHeight;
      const lightStart = innerTop + innerHeight * 0.12;
      const lightEnd = innerTop + innerHeight * 0.88;
      wrap.style.setProperty("--sec5-light-start", `${lightStart}px`);
      wrap.style.setProperty("--sec5-light-end", `${lightEnd}px`);
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
    <div className="light-wrap" ref={wrapRef}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
