"use client";

// Wraps the dark BeforeAfter section + the light Works section + the dark
// Services section in a single gradient surface. The dark↔light↔dark
// transitions become two pieces of ONE continuous gradient anchored to
// the boundaries between the three sections, instead of three separate
// per-section backgrounds meeting at seams.
//
// A ResizeObserver writes three CSS custom properties on the outer
// container:
//   --s2h          : height of section 2 (== top of section 3 in
//                    wrapper-local coordinates)
//   --sec3-bottom  : bottom of section 3 (== top of section 4)
//   --sec4-mid     : Y where section 4 has fully settled into dark
//
// The gradient stops in globals.css use those vars so the dark→teal→light
// ramp at the 2/3 boundary and the mirrored light→teal→dark ramp at the
// 3/4 boundary always land in the right place regardless of section size
// or zoom.

import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  s2: ReactNode;
  s3: ReactNode;
  s4: ReactNode;
}

export default function DarkToLightWrap({ s2, s3, s4 }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const s2Ref = useRef<HTMLDivElement | null>(null);
  const s3Ref = useRef<HTMLDivElement | null>(null);
  const s4Ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const s2el = s2Ref.current;
    const s3el = s3Ref.current;
    const s4el = s4Ref.current;
    if (!wrap || !s2el || !s3el || !s4el) return;

    const update = () => {
      const wrapTop = wrap.getBoundingClientRect().top;
      const s2h = s2el.offsetHeight;
      const s3Bottom = s3el.getBoundingClientRect().bottom - wrapTop;
      const s4Top = s4el.getBoundingClientRect().top - wrapTop;
      // sec4-mid: well into section 4 where the dark is stable. 40% of
      // section 4's height past its top, capped at 400px so even a very
      // tall section 4 doesn't push the dark transition unreasonably far.
      const s4Mid = s4Top + Math.min(400, s4el.offsetHeight * 0.4);

      wrap.style.setProperty("--s2h", `${s2h}px`);
      wrap.style.setProperty("--sec3-bottom", `${s3Bottom}px`);
      wrap.style.setProperty("--sec4-mid", `${s4Mid}px`);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(s2el);
    ro.observe(s3el);
    ro.observe(s4el);
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
      <div ref={s4Ref}>{s4}</div>
    </div>
  );
}
