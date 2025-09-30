"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useAPI";
import { ProductThumbnail } from "@/components/products/ProductThumbnail";
import Pagination from "@/components/ui/Pagination";
import Image from "next/image"; // Make sure this import is present at the top


export default function ProductsView() {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const { data: productsData, isLoading } = useProducts({
    page: currentPage,
    limit: productsPerPage,
  });

  const products = productsData?.data?.data || [];
  const totalProducts = productsData?.data?.pagination?.total || 0;
  const totalPages = productsData?.data?.pagination?.totalPages || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div
        className="flex items-center justify-center mb-14"
        // style={{ height: "280px" }}
      >
     <Image
  src="/product.png"
  alt="Advert Banner"
  width={1440}
  height={300}
  className="w-full object-cover"
  unoptimized
  priority
/>
      </div>

      <div className="mb-5">
        <h2
          className="text-black font-inter font-small text-start"
          style={{
            fontSize: "18px",
            lineHeight: "100%",
            fontWeight: 500,
          }}
        >
          All Digital Products ({totalProducts} products)
        </h2>
      </div>

      <section className="py-8 sm:py-12 md:py-16 bg-[#D7195B] rounded-lg">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-display mb-4">
            Browse templates, guides, and
            <br />
            resources built to help you grow.
          </h2>
        </div>

        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-full bg-white rounded-[5px] overflow-hidden shadow-md h-80 sm:h-96 md:h-[420px] animate-pulse">
                  <div className="bg-gray-200 w-full h-72"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
              {products.map((product) => (
                <ProductThumbnail key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="text-white"
            textColor="text-white hover:text-black"
          />
        )}
      </section>
    </div>
  );
}
