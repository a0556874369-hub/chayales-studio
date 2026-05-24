"use client";

import Image from "next/image";
import { animate } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const REVEAL_TARGET = 50; // % from left where the slider settles after the auto animation
const AUTO_ANIM_SECONDS = 2.5;
const KEYBOARD_STEP = 5;

export default function BeforeAfterSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // sliderPosition is the boundary as % from the LEFT edge of the container.
  // 100 = boundary at right edge (only "before" visible); 0 = boundary at left edge (only "after" visible).
  const [sliderPosition, setSliderPosition] = useState(100);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isAutoAnimating, setIsAutoAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Trigger the one-time auto reveal when the section enters the viewport
  // (>= 50% of the container is visible).
  useEffect(() => {
    if (hasAnimated || isAutoAnimating) return;
    const node = containerRef.current;
    if (!node) return;

    // Respect reduced-motion: skip the cinematic reveal and snap to target.
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          if (prefersReduced) {
            setSliderPosition(REVEAL_TARGET);
            setHasAnimated(true);
          } else {
            setIsAutoAnimating(true);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasAnimated, isAutoAnimating]);

  // Drive the auto reveal with framer-motion's animate(). Tween from 100 → 50
  // with the requested cubic-bezier. onUpdate writes to React state every
  // frame; onComplete flips us into interactive mode.
  useEffect(() => {
    if (!isAutoAnimating) return;
    const controls = animate(100, REVEAL_TARGET, {
      duration: AUTO_ANIM_SECONDS,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (latest) => setSliderPosition(latest),
      onComplete: () => {
        setHasAnimated(true);
        setIsAutoAnimating(false);
      },
    });
    return () => controls.stop();
  }, [isAutoAnimating]);

  // Convert a pointer X to a sliderPosition % within the container.
  const updateFromClientX = useCallback((clientX: number) => {
    const node = containerRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pct);
  }, []);

  // Window-level pointermove/up while dragging — survives the user dragging
  // outside the slider's hit area.
  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: PointerEvent) => {
      updateFromClientX(e.clientX);
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, [isDragging, updateFromClientX]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!hasAnimated) return;
    e.preventDefault();
    setIsDragging(true);
    updateFromClientX(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!hasAnimated) return;
    let next = sliderPosition;
    switch (e.key) {
      case "ArrowLeft":
        next = Math.max(0, sliderPosition - KEYBOARD_STEP);
        break;
      case "ArrowRight":
        next = Math.min(100, sliderPosition + KEYBOARD_STEP);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = 100;
        break;
      default:
        return;
    }
    e.preventDefault();
    setSliderPosition(next);
  };

  // Inline styles tied to sliderPosition — these update every animation frame.
  const clipStyle = {
    clipPath: `inset(0 ${sliderPosition}% 0 0)`,
    WebkitClipPath: `inset(0 ${sliderPosition}% 0 0)`,
  } as React.CSSProperties;
  const handleStyle = { left: `${sliderPosition}%` };

  // Cross-fade the badges based on slider position. Both fully opaque at the
  // 50/50 split; the badge for the "wrong side" fades out as the slider
  // travels toward the opposite edge.
  const beforeOpacity = Math.min(1, sliderPosition / 50);
  const afterOpacity = Math.min(1, (100 - sliderPosition) / 50);

  return (
    <section id="before-after" className="ba-section">
      {/* Top fade — continues the dark band from the Hero, then dissolves
          downward to reveal the global LightRays beneath this section. */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "150px",
          background:
            "linear-gradient(to bottom, #0B0D0C 0%, transparent 100%)",
          zIndex: 5,
        }}
      />

      {/* Bottom fade removed. Previously this lived as an overlay at z-5
          which encroached on the slider visual. Section 03 now owns the
          dark→light transition inside its own background gradient — same
          architecture as the section 03 light→dark transition at the bottom
          (which reads smoothly). Sections meet at solid #0B0D0C. */}

      {/* Scroll-coupled teal sweep traveling through the section. */}
      <div className="ba-content">
        <h2 className="ba-headline">
          רוב העסקים <span style={{ color: "#6EBFC9" }}>מסתתרים</span> מאחורי
          תבנית גנרית. אנחנו מוציאים אותם{" "}
          <span style={{ color: "#4DD8E5" }}>לאור</span>.
        </h2>
        <p className="ba-subhead">גררו את הסליידר וראו את ההבדל</p>

        <div ref={containerRef} className="ba-container">
          {/* "Before" — fills the container as the bottom layer. */}
          <div className="ba-image-wrap">
            <Image
              src="/before-after/krauss-before.png"
              alt="לפני: מודעת קרויס בעיצוב גנרי"
              fill
              sizes="(min-width: 768px) 800px, 90vw"
              className="ba-image"
            />
          </div>

          {/* "After" — overlaid, clipped to reveal as the slider moves. */}
          <div
            id="krauss-roll-source"
            className="ba-image-wrap ba-after-wrap"
            style={clipStyle}
          >
            <Image
              src="/before-after/krauss-after.png"
              alt="אחרי: מודעת קרויס עם וילון זהב"
              fill
              sizes="(min-width: 768px) 800px, 90vw"
              className="ba-image"
            />
          </div>

          <span
            className="ba-badge ba-badge-before"
            style={{ opacity: beforeOpacity }}
            aria-hidden
          >
            לפני - גנרי, נשכח
          </span>
          <span
            className="ba-badge ba-badge-after"
            style={{ opacity: afterOpacity }}
            aria-hidden
          >
            אחרי - בולט, זכיר
          </span>

          {/* Glass shimmer that travels with the wipe during the auto reveal. */}
          {isAutoAnimating && (
            <div
              className="ba-shimmer"
              aria-hidden
              style={handleStyle}
            />
          )}

          {/* Interactive slider handle — appears once the auto reveal finishes. */}
          {hasAnimated && (
            <div
              className="ba-slider"
              style={handleStyle}
              role="slider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(sliderPosition)}
              aria-label="גרור להשוואה בין לפני ואחרי"
              tabIndex={0}
              onPointerDown={onPointerDown}
              onKeyDown={onKeyDown}
            >
              <div className="ba-slider-line" aria-hidden />
              <div className="ba-slider-handle" aria-hidden>
                <svg
                  width="22"
                  height="12"
                  viewBox="0 0 22 12"
                  fill="none"
                  stroke="#4DD8E5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  focusable="false"
                >
                  <polyline points="6 2 2 6 6 10" />
                  <polyline points="16 2 20 6 16 10" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
