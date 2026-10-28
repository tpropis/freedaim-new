import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AudienceSection from "@/components/AudienceSection";
import WhySection from "@/components/WhySection";
import BuildsSection from "@/components/BuildsSection";
import ProcessSection from "@/components/ProcessSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import Ornament from "@/components/declaration/Ornament";

// The homepage reads like the founding document it's modelled on:
// preamble → grievances → articles → exhibits → flight plan → signatories → signing.
const Index = () => {
  return (
    <div className="theme-paper min-h-screen">
      <Navbar tone="paper" />
      <HeroSection />
      <Ornament />
      <WhySection />
      <Ornament />
      <ServicesSection />
      <Ornament />
      <BuildsSection />
      <Ornament />
      <ProcessSection />
      <Ornament />
      <AudienceSection />
      <CtaSection />
      <Footer tone="paper" />
    </div>
  );
};

export default Index;
