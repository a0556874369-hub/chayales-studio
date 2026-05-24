import Hero from "@/components/sections/Hero";
import BeforeAfterSection from "@/components/sections/BeforeAfterSection";
import WorksSection from "@/components/sections/WorksSection";
import ServicesSection from "@/components/sections/ServicesSection";
import DarkToLightWrap from "@/components/sections/DarkToLightWrap";
import LightWrap from "@/components/sections/LightWrap";
import WhyCleanCodeSection from "@/components/sections/WhyCleanCodeSection";
import Orb from "@/components/Orb";

export default function Home() {
  return (
    <>
      <Orb />
      <Hero />
      <DarkToLightWrap
        s2={<BeforeAfterSection />}
        s3={<WorksSection />}
        s4={<ServicesSection />}
      />
      <LightWrap>
        <WhyCleanCodeSection />
      </LightWrap>
    </>
  );
}
