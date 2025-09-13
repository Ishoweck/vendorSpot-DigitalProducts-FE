"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, Store } from "lucide-react";
import { useProducts } from "@/hooks/useAPI";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedProductsSection() {
  const [likedProducts, setLikedProducts] = useState<string[]>([]);

  const toggleLike = (productId: string) => {
    setLikedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Fetch products without 'isFeatured' filter to avoid TS error
  const { data: productsData, isLoading } = useProducts({
    page: 1,
    limit: 12,
    // isFeatured: true, // Removed due to TS error
  });

  // Filter featured products client-side
  const featuredProducts = (productsData?.data?.data || []).filter(
    (p) => p.isFeatured
  );

  return (
    <section className="pt-11">
      <div
        className="bg-[#FF7300] border-2 border-neutral-50 rounded-[10px] p-4 sm:p-6 mb-8 sm:mb-10 md:mb-12"
        style={{ height: "71px" }}
      >
        <div className="flex items-center h-full">
          <Store className="w-6 h-6 text-white mr-2" />
          <span className="text-white font-semibold text-lg sm:text-xl">
            Sponsored Products
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-80 sm:h-96 md:h-[380px] shadow-md border border-[#9D9C9C] w-full max-w-[306px]"
            >
              <Skeleton className="h-48 sm:h-56 md:h-60 w-full" />
              <div className="p-3 sm:p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product, index) => (
            <div
              key={product._id}
              className={`h-80 sm:h-96 md:h-[380px] shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-[#9D9C9C] ${
                index >= 2 ? "hidden sm:block" : ""
              }`}
              style={{ width: "306px", maxWidth: "100%" }}
            >
              <div className="relative">
                <Image
                  src={product.image || "/images/product.png"} // fallback image
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full object-cover h-48 sm:h-56 md:h-60"
                />
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                  <button
                    onClick={() => toggleLike(product._id)}
                    className="p-1.5 sm:p-2 transition-colors duration-200"
                  >
                    <Heart
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        likedProducts.includes(product._id)
                          ? "text-red-500 fill-current"
                          : "text-neutral-600"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="p-3 sm:p-4 flex flex-col space-y-2 h-32 sm:h-40 md:h-[140px]">
                <div>
                  <h3 className="font-semibold text-neutral-900 text-sm sm:text-base">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-base sm:text-lg font-bold text-neutral-900">
                        ₦{product.price?.toLocaleString() || "—"}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-neutral-500 line-through">
                          ₦{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {product.discountPercentage && (
                      <div className="bg-[#D7195B33] rounded px-2 py-1 text-xs">
                        <span className="text-[#D7195B] font-medium">
                          -{product.discountPercentage}%
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-neutral-600">
                    {product.shopName} - {product.location}
                  </p>
                </div>

                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-3 h-3 sm:w-4 sm:h-4 text-[#FC5991] mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
