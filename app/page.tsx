import Hero from "@/components/sections/Hero";
import BeforeAfterSection from "@/components/sections/BeforeAfterSection";
import WorksSection from "@/components/sections/WorksSection";
import ServicesSection from "@/components/sections/ServicesSection";
import WhyCleanCodeSection from "@/components/sections/WhyCleanCodeSection";
import ProcessSection from "@/components/sections/ProcessSection";
import DarkToLightWrap from "@/components/sections/DarkToLightWrap";
import LightToDarkWrap from "@/components/sections/LightToDarkWrap";
import Orb from "@/components/Orb";

export default function Home() {
  return (
    <>
      <Orb />
      <Hero />
      <DarkToLightWrap
        s2={<BeforeAfterSection />}
        s3={<WorksSection />}
        s5={<WhyCleanCodeSection />}
      />
      <LightToDarkWrap>
        <ServicesSection />
      </LightToDarkWrap>
      <ProcessSection />
    </>
  );
}
