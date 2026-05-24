import Hero from "@/components/sections/Hero";
import BeforeAfterSection from "@/components/sections/BeforeAfterSection";
import WorksSection from "@/components/sections/WorksSection";
import ServicesSection from "@/components/sections/ServicesSection";
import DarkToLightWrap from "@/components/sections/DarkToLightWrap";

export default function Home() {
  return (
    <>
      <Hero />
      <DarkToLightWrap
        s2={<BeforeAfterSection />}
        s3={<WorksSection />}
        s4={<ServicesSection />}
      />
    </>
  );
}
