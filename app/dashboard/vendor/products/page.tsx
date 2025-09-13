"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useVendorProducts, useDeleteProduct } from "@/hooks/useAPI";
import VendorSidebar from "@/components/dashboard/VendorSidebar";
import SectionWrapper from "@/components/layout/SectionWrapper";
import AuthWrapper from "@/components/auth/AuthWrapper";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import Pagination from "@/components/ui/Pagination";
import { useSocket } from "@/hooks/useSocket";

function VendorProductsContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
  }>({
    isOpen: false,
    productId: "",
    productName: "",
  });
  const [showLeftIndicator, setShowLeftIndicator] = useState(false);
  const [showRightIndicator, setShowRightIndicator] = useState(false);

  const { data: productsData, isLoading } = useVendorProducts({
    page: currentPage,
    limit: 5,
  });
  const deleteProductMutation = useDeleteProduct();
  useSocket();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".dropdown-container")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTableScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const { scrollLeft, scrollWidth, clientWidth } = target;

    setShowLeftIndicator(scrollLeft > 0);
    setShowRightIndicator(scrollLeft < scrollWidth - clientWidth - 1);
  };

  const scrollTable = (direction: "left" | "right") => {
    const tableContainer = document.querySelector(
      ".table-scroll-container"
    ) as HTMLDivElement;
    if (tableContainer) {
      const scrollAmount = 200;
      tableContainer.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const products = productsData?.data?.data || [];
  const pagination = productsData?.data?.pagination;

  const handleDeleteProduct = (productId: string, productName: string) => {
    setDeleteModal({
      isOpen: true,
      productId,
      productName,
    });
    setActiveDropdown(null);
  };

  const confirmDelete = () => {
    deleteProductMutation.mutate(deleteModal.productId);
    setDeleteModal({ isOpen: false, productId: "", productName: "" });
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, productId: "", productName: "" });
  };

  const toggleDropdown = (productId: string) => {
    setActiveDropdown(activeDropdown === productId ? null : productId);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SectionWrapper className="pt-4 pb-4 md:pt-8 md:pb-8">
        <div className="max-w-7xl mx-auto px-2 md:px-4">
          <div className="flex gap-4 md:gap-8">
            <VendorSidebar />

            <main className="flex-1 bg-white rounded-lg shadow p-3 md:p-6 min-w-0">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Products
                </h1>
                <Link
                  href="/dashboard/vendor/products/create"
                  className="bg-[#D7195B] text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-[#B01548] transition-colors flex items-center gap-2 text-sm md:text-base"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Product</span>
                  <span className="sm:hidden">Add</span>
                </Link>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#D7195B] border-t-transparent"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No products yet
                  </h3>
                  <p className="text-gray-600">
                    Start selling by adding your first digital product
                  </p>
                </div>
              ) : (
                <>
                  <div className="block md:hidden">
                    <div className="space-y-4 max-w-full">
                      {products.map((product: any) => (
                        <div
                          key={product._id}
                          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm w-full"
                        >
                          <div className="flex items-start gap-4 w-full">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              {product.thumbnail ? (
                                <img
                                  src={product.thumbnail}
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gray-400 rounded"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 overflow-hidden">
                              <div className="flex items-start justify-between w-full">
                                <div className="flex-1 min-w-0 pr-2">
                                  <h3 className="font-medium text-gray-900 truncate">
                                    {product.name}
                                  </h3>
                                  <p className="text-sm text-gray-600 line-clamp-2 mt-1 break-words">
                                    {product.description}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 flex-wrap">
                                    <span className="font-medium text-gray-900 whitespace-nowrap">
                                      ₦{product.price.toLocaleString()}
                                    </span>
                                    <span className="whitespace-nowrap">
                                      {product.soldCount || 0} sold
                                    </span>
                                  </div>
                                </div>
                                <div className="relative flex-shrink-0 dropdown-container">
                                  <button
                                    onClick={() => toggleDropdown(product._id)}
                                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                  {activeDropdown === product._id && (
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                      <Link
                                        href={`/products/${product._id}`}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => setActiveDropdown(null)}
                                      >
                                        <Eye className="w-4 h-4" />
                                        View Product
                                      </Link>
                                      <Link
                                        href={`/dashboard/vendor/products/${product._id}/edit`}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => setActiveDropdown(null)}
                                      >
                                        <Edit className="w-4 h-4" />
                                        Edit Product
                                      </Link>
                                      <button
                                        onClick={() =>
                                          handleDeleteProduct(
                                            product._id,
                                            product.name
                                          )
                                        }
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                        disabled={
                                          deleteProductMutation.isLoading
                                        }
                                      >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Product
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="mt-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    product.approvalStatus === "APPROVED"
                                      ? "bg-green-100 text-green-800"
                                      : product.approvalStatus === "PENDING"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {product.approvalStatus}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="hidden md:block">
                    <div
                      className="border border-gray-200 rounded-lg relative group overflow-hidden overflow-y-auto"
                      style={{ maxHeight: "400px", minHeight: "200px", scrollbarWidth: "thin", scrollBehavior: "smooth", scrollbarColor: "#D7195B transparent" }}
                    >
                      {/* Left scroll indicator - always visible on hover */}
                      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-20 flex items-center justify-start pl-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => scrollTable("left")}
                          className="w-6 h-6 bg-white border border-gray-300 rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                          title="Scroll left"
                        >
                          <svg
                            className="w-3 h-3 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Right scroll indicator - always visible on hover */}
                      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-20 flex items-center justify-end pr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => scrollTable("right")}
                          className="w-6 h-6 bg-white border border-gray-300 rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                          title="Scroll right"
                        >
                          <svg
                            className="w-3 h-3 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>

                      <div
                        className="h-full overflow-auto table-scroll-container"
                        onScroll={handleTableScroll}
                        style={{ scrollbarWidth: "thin", scrollBehavior: "smooth", scrollbarColor: "#D7195B transparent" }}
                      >
                        <table className="w-full divide-y divide-gray-200 min-w-[800px]">
                          <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                              <th className="text-left py-4 px-6 font-semibold text-gray-900 border-r border-gray-200">
                                Product
                              </th>
                              <th className="text-left py-4 px-6 font-semibold text-gray-900 border-r border-gray-200">
                                Price
                              </th>
                              <th className="text-left py-4 px-6 font-semibold text-gray-900 border-r border-gray-200">
                                Status
                              </th>
                              <th className="text-left py-4 px-6 font-semibold text-gray-900 border-r border-gray-200">
                                Sold
                              </th>
                              <th className="text-center py-4 px-6 font-semibold text-gray-900">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product: any) => (
                              <tr
                                key={product._id}
                                className="hover:bg-gray-50 transition-colors group/row"
                              >
                                <td className="py-4 px-6 border-r border-gray-200">
                                  <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                      {product.thumbnail ? (
                                        <img
                                          src={product.thumbnail}
                                          alt={product.name}
                                          className="w-full h-full object-cover rounded-lg"
                                        />
                                      ) : (
                                        <div className="w-8 h-8 bg-gray-400 rounded"></div>
                                      )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <h3 className="font-semibold text-gray-900 truncate">
                                        {product.name}
                                      </h3>
                                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                        {product.description}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-6 border-r border-gray-200">
                                  <span className="font-semibold text-gray-900">
                                    ₦{product.price.toLocaleString()}
                                  </span>
                                </td>
                                <td className="py-4 px-6 border-r border-gray-200">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      product.approvalStatus === "APPROVED"
                                        ? "bg-green-100 text-green-800"
                                        : product.approvalStatus === "PENDING"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {product.approvalStatus}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-gray-600 border-r border-gray-200">
                                  {product.soldCount || 0}
                                </td>
                                <td className="py-4 px-6">
                                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                    <Link
                                      href={`/products/${product._id}`}
                                      className="p-2 text-gray-600 hover:text-[#D7195B] transition-colors rounded-lg hover:bg-gray-100"
                                      title="View Product"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Link>
                                    <Link
                                      href={`/dashboard/vendor/products/${product._id}/edit`}
                                      className="p-2 text-gray-600 hover:text-[#D7195B] transition-colors rounded-lg hover:bg-gray-100"
                                      title="Edit Product"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Link>
                                    <button
                                      onClick={() =>
                                        handleDeleteProduct(
                                          product._id,
                                          product.name
                                        )
                                      }
                                      className="p-2 text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-100"
                                      disabled={deleteProductMutation.isLoading}
                                      title="Delete Product"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {pagination && pagination.totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={setCurrentPage}
                      className="mt-6"
                    />
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </SectionWrapper>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteModal.productName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default function VendorProductsPage() {
  return (
    <AuthWrapper requireAuth={true}>
      <VendorProductsContent />
    </AuthWrapper>
  );
}
