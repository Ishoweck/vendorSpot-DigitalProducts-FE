"use client";

import { useState } from "react";
import { useWishlist, useRemoveFromWishlist } from "@/hooks/useAPI";
import { Heart } from "lucide-react";
import UserSidebar from "@/components/dashboard/UserSidebar";
import SectionWrapper from "@/components/layout/SectionWrapper";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { useTempStore } from "@/stores/tempStore";
import Link from "next/link";
import Pagination from "@/components/ui/Pagination";

function SavedItemsPageContent() {
  const { isVendor } = useTempStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const { data: wishlistData, isLoading } = useWishlist(!isVendor, {
    page: currentPage,
    limit: itemsPerPage,
  });
  const removeFromWishlist = useRemoveFromWishlist();

  const wishlist = Array.isArray(wishlistData?.data)
    ? wishlistData.data
    : Array.isArray(wishlistData?.data?.data)
      ? wishlistData.data.data
      : [];

  const totalItems = wishlistData?.data?.pagination?.total || wishlist.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleToggleLike = async (productId: string) => {
    try {
      await removeFromWishlist.mutateAsync(productId);
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <SectionWrapper className="pt-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-8">
              <UserSidebar />
              <main className="flex-1 bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-gray-100 rounded-lg p-4">
                        <div className="h-32 bg-gray-200 rounded mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </SectionWrapper>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <SectionWrapper className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            <UserSidebar />
            <main className="flex-1 bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Saved Items
                </h1>
                <div className="text-sm text-gray-500">
                  {totalItems} items saved
                </div>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No saved items
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Items you like will appear here.
                  </p>
                </div>
              ) : Array.isArray(wishlist) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlist.map((item: any) => (
                    <Link
                      key={item._id}
                      href={`/products/${item._id}`}
                      className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        <img
                          src={item.thumbnail || "/api/placeholder/200/150"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        by {item.vendorId?.businessName || "Unknown Vendor"}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">
                          ₦{item.price?.toLocaleString() || "0"}
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleToggleLike(item._id);
                          }}
                          className="text-[#D7195B] hover:text-[#B01548] transition-colors"
                        >
                          <Heart className="w-5 h-5 fill-current" />
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">Error loading wishlist data</p>
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </main>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

export default function SavedItemsPage() {
  return (
    <AuthWrapper requireAuth={true}>
      <SavedItemsPageContent />
    </AuthWrapper>
  );
}
