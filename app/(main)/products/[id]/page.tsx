"use client"
import ProductDetail from "@/components/products/ProductDetail";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import FeaturedShopsSection from "@/components/home/FeaturedShopsSection";
import CTASection from "@/components/home/CTASection";
import SectionWrapper from "@/components/layout/SectionWrapper";

import { useEffect, useState } from "react";
import FullScreenLoader from "../../../../components/Loader";
// import ProductsPage from "./ProductPage";

export default function YourComponent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay (e.g., fetching data, verifying token, etc.)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <FullScreenLoader />;

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

