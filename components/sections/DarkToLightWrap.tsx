"use client";

// Wraps the dark Before/After section + the light Works section in a single
// gradient surface. The transition becomes ONE continuous gradient anchored
// to the boundary between the two sections, instead of two separate
// per-section gradients meeting at a seam.
//
// A ResizeObserver measures the height of the inner s2 wrapper and writes
// it to the `--s2h` CSS variable on the outer container. The gradient stops
// in globals.css use that variable so the dark→teal→light ramp lands
// exactly across the section boundary regardless of section size or zoom.

import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  s2: ReactNode;
  s3: ReactNode;
}

export default function DarkToLightWrap({ s2, s3 }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const s2Ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const s2el = s2Ref.current;
    if (!wrap || !s2el) return;
    const update = () => {
      wrap.style.setProperty("--s2h", `${s2el.offsetHeight}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(s2el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="dark-to-light" ref={wrapRef}>
      <div ref={s2Ref}>{s2}</div>
      {s3}
    </div>
  );
}
