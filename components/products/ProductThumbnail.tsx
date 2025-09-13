"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductThumbnailProps {
  product: Product;
  className?: string;
}

export function ProductThumbnail({
  product,
  className = "",
}: ProductThumbnailProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <Link
      href={`/products/${product._id}`}
      className={`w-full bg-white rounded-[5px] overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 h-64 sm:h-80 md:h-96 block ${className}`}
      style={{ aspectRatio: "255/320" }}
    >
      <div className="bg-[#FFDD00] relative w-full" style={{ height: "72.2%" }}>
        {!imageLoaded && <Skeleton className="w-full h-full" />}
        <img
          src={product.thumbnail || "/api/placeholder/200/150"}
          alt={product.name}
          className={`w-full h-full object-cover ${!imageLoaded ? "hidden" : ""}`}
          onLoad={handleImageLoad}
        />
      </div>

      <div
        className="bg-white p-2 sm:p-3 md:py-4 md:px-[15px] flex flex-col space-y-1.5 sm:space-y-2"
        style={{ height: "27.8%" }}
      >
        <div className="space-y-1.5 sm:space-y-2">
          <h3
            className="text-[#000000B2] font-inter font-normal line-clamp-2"
            style={{ fontSize: "12px", lineHeight: "120%" }}
          >
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className="text-black font-inter font-medium"
              style={{ fontSize: "14px", lineHeight: "120%" }}
            >
              ₦{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span
                className="text-gray-400 line-through"
                style={{ fontSize: "12px" }}
              >
                ₦{product.originalPrice.toLocaleString()}
              </span>
            )}
            {product.discountPercentage && product.discountPercentage > 0 && (
              <span className="text-green-600" style={{ fontSize: "10px" }}>
                -{product.discountPercentage}%
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 ${
                  i < Math.floor(product.rating)
                    ? "text-[#FC5991] fill-current"
                    : "text-gray-300"
                }`}
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
          <span
            className="text-[#000000B2] font-inter font-medium leading-none"
            style={{ fontSize: "8px", lineHeight: "100%" }}
          >
            {product.reviewCount || 0} reviews
          </span>
        </div>
      </div>
    </Link>
  );
}
