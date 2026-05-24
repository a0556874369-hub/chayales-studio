import Hero from "@/components/sections/Hero";
import BeforeAfterSection from "@/components/sections/BeforeAfterSection";
import WorksSection from "@/components/sections/WorksSection";
import ServicesSection from "@/components/sections/ServicesSection";
import DarkToLightWrap from "@/components/sections/DarkToLightWrap";
import Orb from "@/components/Orb";

export default function Home() {
  return (
    <>
      {/* Fixed teal sphere that accompanies scroll: invisible in Hero,
          slides in from the right in Section 2, fades out across Works,
          returns centred + large in Services. Lives at z-2 inside main's
          stacking context; section content with explicit z-index >= 3
          stays above it (see globals.css for the bumps). */}
      <Orb />
      <Hero />
      <DarkToLightWrap
        s2={<BeforeAfterSection />}
        s3={<WorksSection />}
        s4={<ServicesSection />}
      />
    </>
  );
}
