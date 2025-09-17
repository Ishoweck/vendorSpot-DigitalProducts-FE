"use client";

import Link from "next/link";
import { useProducts } from "@/hooks/useAPI";
import { ProductThumbnail } from "@/components/products/ProductThumbnail";
import { Skeleton } from "@/components/ui/skeleton";

export default function DigitalProductsSection() {
  const { data: productsData, isLoading } = useProducts({
    page: 1,
    limit: 8,
  });

  const products = productsData?.data?.data || [];

  const renderSkeletons = () => (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="w-full bg-white rounded-[5px] overflow-hidden shadow-md h-auto"
          style={{ minHeight: "280px" }}
        >
          <div className="bg-gray-200 animate-pulse w-full aspect-[4/3]" />
          <div className="bg-white p-3 sm:p-4 md:py-5 md:px-6 space-y-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-2 w-2" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-[#D7195B]">
      <div className="text-center mb-8 sm:mb-10 md:mb-12 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white font-display mb-4">
          Explore. Download. <span className="bg-black px-2">Grow.</span>
        </h2>
        <p className="text-white text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
          Digital products made to fuel your business journey.
        </p>
      </div>

      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {isLoading ? (
          renderSkeletons()
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {products.map((product) => (
              <ProductThumbnail
                key={product._id}
                product={product}
                className="w-full h-auto"
              />
            ))}
          </div>
        )}
      </div>

      <div className="text-center">
        <Link
          href="/view-products"
          className="inline-block bg-transparent text-white border-2 border-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-white hover:text-[#D7195B] transition-colors duration-200 text-sm sm:text-base"
        >
          View More
        </Link>
      </div>
    </section>
  );
}
