"use client";

import Image from "next/image";
import { Store } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeaturedVendors } from "@/hooks/useAPI";
import Link from "next/link";


export default function FeaturedShopsSection() {
  const { data: vendors = [], isLoading } = useFeaturedVendors(5);

  return (
    <section className="pt-11">
      <div
        className="bg-[#FF7300] border-2 border-neutral-50 rounded-[10px] p-4 sm:p-6 mb-8 sm:mb-10 md:mb-12"
        style={{ height: "71px" }}
      >
        <div className="flex items-center h-full">
          <Store className="w-6 h-6 text-white mr-2" />
          <span className="text-white font-semibold text-lg sm:text-xl">
            Sponsored Shops
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(5)].map((_, i) => (
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
          {vendors.map((vendor, index) => (
              <Link key={vendor._id} href={`/vendorDetails/${vendor.businessName}`}>

            <div
              key={vendor._id}
              className={`h-80 sm:h-96 md:h-[380px] shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-[#9D9C9C] ${
                index >= 2 ? "hidden sm:block" : ""
              }`}
              style={{ width: "306px", maxWidth: "100%" }}
            >
              <div className="relative">
                <Image
                  src={vendor.image || "/images/shop-placeholder.png"} // fallback image
                  alt={vendor.businessName}
                  width={400}
                  height={300}
                  className="w-full object-cover h-48 sm:h-56 md:h-60"
                />
              </div>

              <div className="p-3 sm:p-4 flex flex-col space-y-2 h-32 sm:h-40 md:h-[140px]">
                <div>
                  <h3 className="font-semibold text-neutral-900 text-sm sm:text-base">
                    {vendor.businessName}
                  </h3>

                  <p className="text-sm text-neutral-600">
                    {vendor?.userId?.firstName} {vendor?.userId?.lastName}
                  </p>
                  {/* <p className="text-sm text-neutral-500">
                    {vendor.businessDescription?.slice(0, 60) || "No description"}
                  </p> */}
                </div>

                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 ${
                        i < (vendor.rating || 0) ? "text-[#FC5991]" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.078 10.1c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ))}
                  </div>

              </div>
            </div>

              </Link>

          ))}
        </div>
      )}
    </section>
  );
}
