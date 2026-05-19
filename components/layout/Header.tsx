"use client";

// Text-only navigation pill, fixed at top of every page.
// Adaptive theme: the pill flips from light-on-dark to dark-on-light
// whenever a section with data-theme="light" sits behind it. Driven by
// IntersectionObserver with a shrunk root that's only the top of the
// viewport (the strip under the header).

import { useEffect, useState } from "react";

const HEADER_PROBE_HEIGHT = 80; // px — slightly more than the pill's height

export default function Header() {
  const [isOverLight, setIsOverLight] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const targets = document.querySelectorAll<HTMLElement>(
      '[data-theme="light"]',
    );
    if (targets.length === 0) return;

    // Shrink the observer's root to a thin band at the top of the viewport
    // — only the area covered by the header pill. When a light section
    // crosses into that band, the header flips light-theme.
    const observer = new IntersectionObserver(
      (entries) => {
        // Track each entry's state and recompute. A single light section
        // intersecting the band is enough to flip the header.
        const anyIntersecting = entries.some((e) => e.isIntersecting);
        // If we got partial updates, fall back to checking ALL targets.
        if (anyIntersecting) {
          setIsOverLight(true);
        } else {
          // None of the entries are intersecting — but other tracked
          // targets might be. Re-query to be safe.
          const stillLight = Array.from(targets).some((t) => {
            const r = t.getBoundingClientRect();
            return r.top <= HEADER_PROBE_HEIGHT && r.bottom >= 0;
          });
          setIsOverLight(stillLight);
        }
      },
      {
        rootMargin: `0px 0px -${Math.max(0, window.innerHeight - HEADER_PROBE_HEIGHT)}px 0px`,
        threshold: 0,
      },
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-header">
      <nav
        className={`header-pill ${isOverLight ? "header-pill-on-light" : ""}`}
        aria-label="ניווט ראשי"
      >
        <a href="#home" className="text-link">
          בית
        </a>
        <a href="#works" className="text-link">
          עבודות
        </a>
        <a href="#services" className="text-link">
          שירותים
        </a>
        <a href="#about" className="text-link">
          אודות
        </a>
        <a href="#contact" className="text-link contact-link">
          צור קשר
        </a>
      </nav>
    </header>
  );
}
