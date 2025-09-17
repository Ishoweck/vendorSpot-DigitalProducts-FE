import HeroSection from "@/components/home/HeroSection";
import DigitalProductsSection from "@/components/home/DigitalProductsSection";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import FeaturedShopsSection from "@/components/home/FeaturedShopsSection";
import CTASection from "@/components/home/CTASection";
import SectionWrapper from "@/components/layout/SectionWrapper";

export default function DigitalProductsPage() {
  return (
    <div className="bg-[#F8F8F8]">
      <div className="min-h-screen">
        <SectionWrapper className="pt-8">
          <HeroSection />
        </SectionWrapper>
        <SectionWrapper>
          <DigitalProductsSection />
        </SectionWrapper>
        <SectionWrapper>
          <FeaturedProductsSection />
        </SectionWrapper>
        <SectionWrapper>
          <FeaturedShopsSection />
        </SectionWrapper>
        {/* <CTASection /> */}
      </div>
    </div>
  );
}
