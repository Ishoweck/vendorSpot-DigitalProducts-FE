import ProductsView from "@/components/products/ProductsView";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import FeaturedShopsSection from "@/components/home/FeaturedShopsSection";
import CTASection from "@/components/home/CTASection";
import SectionWrapper from "@/components/layout/SectionWrapper";

export default function ViewProductsPage() {
  return (
    <div className="bg-[#F8F8F8]">
      <div className="min-h-screen">
        <SectionWrapper className="pt-8">
          <ProductsView />
        </SectionWrapper>
        <SectionWrapper>
          <FeaturedProductsSection />
        </SectionWrapper>
        <SectionWrapper>
          <FeaturedShopsSection />
        </SectionWrapper>
        <CTASection />
      </div>
    </div>
  );
}
