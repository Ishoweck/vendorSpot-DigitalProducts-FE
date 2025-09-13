import ProductDetail from "@/components/products/ProductDetail";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import FeaturedShopsSection from "@/components/home/FeaturedShopsSection";
import CTASection from "@/components/home/CTASection";
import SectionWrapper from "@/components/layout/SectionWrapper";

export default function ProductDetailPage() {
  return (
    <div className="bg-[#F8F8F8]">
      <div className="min-h-screen">
        <SectionWrapper className="pt-8">
          <ProductDetail />
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
