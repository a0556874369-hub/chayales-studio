"use client";

import { motion } from "framer-motion";
import { type RefObject, useEffect, useRef, useState } from "react";

const MOBILE_QUERY = "(max-width: 767px)";
const LOOP_PAUSE_MS = 2500;

/**
 * Adds a "pause-then-restart" loop to a <video>: when the clip ends, wait
 * LOOP_PAUSE_MS holding the last frame, then seek to 0 and replay. Optionally
 * sets a custom playbackRate. Disabled when `enabled` is false (e.g. mobile
 * viewport for the desktop refs, or prefers-reduced-motion globally).
 */
function useVideoLoopPause(
  ref: RefObject<HTMLVideoElement | null>,
  enabled: boolean,
  options: { playbackRate?: number } = {},
) {
  const { playbackRate } = options;
  useEffect(() => {
    if (!enabled) return;
    const video = ref.current;
    if (!video) return;

    if (playbackRate !== undefined) {
      video.playbackRate = playbackRate;
    }

    let timeoutId: number | undefined;
    const handleEnded = () => {
      timeoutId = window.setTimeout(() => {
        const v = ref.current;
        if (!v) return;
        v.currentTime = 0;
        v.play().catch(() => {});
      }, LOOP_PAUSE_MS);
    };

    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("ended", handleEnded);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [enabled, playbackRate, ref]);
}

export default function Hero() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const desktopVideoRef = useRef<HTMLVideoElement | null>(null);
  const mobileRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    const mq = window.matchMedia(MOBILE_QUERY);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Single-layer video both on desktop and mobile (different sources).
  useVideoLoopPause(desktopVideoRef, !reduceMotion && !isMobile);
  useVideoLoopPause(mobileRef, !reduceMotion && isMobile);

  // Fast entrance — text appears almost immediately so the page never feels
  // like it's still loading. Video keeps ramping in the background.
  const delayHeadline = reduceMotion ? 0 : 0.15;
  const delaySubhead = reduceMotion ? 0 : 0.35;
  const delayCta = reduceMotion ? 0 : 0.55;

  return (
    <section className="relative min-h-screen overflow-hidden md:bg-black">
      {/* Mesh gradient layers — visible on mobile only. Desktop is pure black. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{ backgroundColor: "#0B0D0C", zIndex: 0 }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          background:
            "linear-gradient(to right, transparent 40%, rgba(55, 134, 127, 0.08) 100%)",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute md:hidden"
        style={{
          width: "60vw",
          height: "60vw",
          top: "20%",
          left: "-10%",
          background:
            "radial-gradient(circle, #37867F 0%, transparent 60%)",
          opacity: 0.4,
          filter: "blur(150px)",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute md:hidden"
        style={{
          width: "35vw",
          height: "35vw",
          bottom: "-10%",
          right: "-5%",
          background:
            "radial-gradient(circle, #60ACA5 0%, transparent 60%)",
          opacity: 0.3,
          filter: "blur(120px)",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
          zIndex: 0,
        }}
      />

      {/* Video — single layer. Mobile uses cover-fill clip; desktop uses a
          centered, feathered focal video offset to the left. */}
      <div className="hero-video-container">
        {isMobile ? (
          <video
            ref={mobileRef}
            key="mobile"
            src="/videos/hero-bg-mobile.mp4"
            autoPlay={!reduceMotion}
            muted
            playsInline
            controls={reduceMotion}
            preload="metadata"
            className="hero-bg-video"
            aria-label="אנימציית רקע של הלוגו"
          />
        ) : (
          <video
            ref={desktopVideoRef}
            key="desktop"
            src="/videos/hero-bg-animation.mp4"
            autoPlay={!reduceMotion}
            muted
            playsInline
            controls={reduceMotion}
            preload="metadata"
            className="hero-bg-focal"
            aria-label="אנימציית לוגו חיהLES"
          />
        )}
      </div>

      {/* Readability overlay — gradient right→clear on desktop, bottom→clear on mobile. */}
      <div className="hero-overlay" aria-hidden />

      {/* Content — two-column from md (text right / open left), bottom-aligned single column on mobile.
          Top padding clears the fixed site header. */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[65fr_35fr] items-end md:items-center min-h-screen max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-[8vh] md:pt-24 md:pb-20">
        <div className="flex flex-col gap-8 md:gap-10 text-center md:text-right items-center md:items-stretch max-w-2xl md:max-w-none mx-auto md:mx-0 md:ms-0 md:me-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: delayHeadline,
              ease: "easeOut",
            }}
            className="hero-headline"
          >
            <span className="block whitespace-nowrap">רוב העסקים נראים</span>
            <span className="block whitespace-nowrap">
              כמו <span style={{ color: "#6EBFC9" }}>תבנית</span>,
            </span>
            <span
              className="block whitespace-nowrap hero-headline-emphasis"
              style={{ textShadow: "0 0 60px rgba(77, 216, 229, 0.2)" }}
            >
              שלכם{" "}
              <span
                style={{
                  color: "#4DD8E5",
                  fontWeight: 900,
                  textShadow: "0 0 35px rgba(77, 216, 229, 0.7)",
                }}
              >
                לא
              </span>
              .
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: delaySubhead,
              ease: "easeOut",
            }}
            className="hero-subhead mx-auto md:mx-0"
          >
            מיתוג, אתר ופרסום בסטודיו אחד
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: delayCta,
              ease: "easeOut",
            }}
            className="w-full sm:w-auto self-center md:self-start"
          >
            <a href="#works" className="btn-glass btn-glass-primary">
              לעבודות ↓
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade — soft transition into the next section's LightRays.
          Sits above the video/overlay (z-1/z-2) but below the content (z-10),
          and pointer-events:none so it never blocks interaction. */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "200px",
          background:
            "linear-gradient(to top, transparent 0%, #0B0D0C 100%)",
          zIndex: 5,
        }}
      />
    </section>
  );
}
