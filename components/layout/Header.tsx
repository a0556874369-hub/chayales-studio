// Text-only navigation pill, fixed at top of every page.
// (Earlier this header used inline lucide-style SVG icons; per request the
// icons were dropped and only the text labels remain.)

export default function Header() {
  return (
    <header className="site-header">
      <nav className="header-pill" aria-label="ניווט ראשי">
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
