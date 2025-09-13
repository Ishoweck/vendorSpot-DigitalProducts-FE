"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Download,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  Star,
} from "lucide-react";
import UserSidebar from "@/components/dashboard/UserSidebar";
import SectionWrapper from "@/components/layout/SectionWrapper";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { useOrder, useDownloadProduct, useUserProfile } from "@/hooks/useAPI";
import ReviewModal from "@/components/modals/ReviewModal";

function OrderDetailsPageContent({ params }: { params: { id: string } }) {
  const { data: orderData, isLoading } = useOrder(params.id);
  const { data: userProfile } = useUserProfile();
  const downloadProduct = useDownloadProduct();
  const order = orderData?.data?.data;
  const user = userProfile?.data?.data;

  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    productId: string;
    orderId: string;
    productName: string;
  }>({
    isOpen: false,
    productId: "",
    orderId: "",
    productName: "",
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
      case "PROCESSING":
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
      default:
        return <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />;
    }
  };

  const handleDownload = (item: any, orderId: string) => {
    const productId = item.productId?._id || item.productId;
    if (productId && orderId) {
      downloadProduct.mutate({ productId, orderId });
    }
  };

  const handleReviewClick = (item: any) => {
    const productId = item.productId?._id || item.productId;
    if (productId) {
      setReviewModal({
        isOpen: true,
        productId,
        orderId: order._id,
        productName: item.productId?.name || "Product",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <SectionWrapper className="pt-4 pb-4 md:pt-8 md:pb-8">
          <div className="max-w-7xl mx-auto px-2 md:px-4">
            <div className="flex gap-4 md:gap-8">
              <UserSidebar />
              <main className="flex-1">
                <div className="animate-pulse h-40 bg-gray-200 rounded" />
              </main>
            </div>
          </div>
        </SectionWrapper>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <SectionWrapper className="pt-4 pb-4 md:pt-8 md:pb-8">
          <div className="max-w-7xl mx-auto px-2 md:px-4">
            <div className="flex gap-4 md:gap-8">
              <UserSidebar />
              <main className="flex-1">
                <div className="p-6 bg-white rounded-lg border border-gray-200">
                  Order not found
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
      <SectionWrapper className="pt-4 pb-4 md:pt-8 md:pb-8">
        <div className="max-w-7xl mx-auto px-2 md:px-4">
          <div className="flex gap-4 md:gap-8">
            <UserSidebar />
            <main className="flex-1">
              <div className="mb-4 md:mb-6">
                <Link
                  href="/dashboard/user/orders"
                  className="inline-flex items-center text-[#D7195B] hover:text-[#B01548] mb-3 md:mb-4 text-sm md:text-base"
                >
                  <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Back to Orders
                </Link>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Order #{order.orderNumber}
                </h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                  <div className="bg-white rounded-lg shadow p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-3">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <h2 className="font-semibold text-gray-900 text-sm md:text-base">
                            {order.status === "DELIVERED"
                              ? "Ready for Download"
                              : order.status}
                          </h2>
                          <p className="text-xs md:text-sm text-gray-500">
                            Order placed on{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      {order.items.map((item: any) => (
                        <div
                          key={item._id || item.productId}
                          className="border border-gray-200 rounded-lg p-3 md:p-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start gap-3 md:gap-4">
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                              <Image
                                src={
                                  item.productId?.thumbnail ||
                                  "/api/placeholder/80/80"
                                }
                                alt={item.productId?.name || "Product"}
                                fill
                                className="object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 text-sm md:text-base">
                                {item.productId?.name || "Product"}
                              </h3>
                              <p className="text-xs md:text-sm text-gray-500">
                                by{" "}
                                {item.productId?.vendorId?.businessName ||
                                  "Unknown Vendor"}
                              </p>
                              <p className="text-xs md:text-sm text-gray-600 mt-1">
                                {item.productId?.description ||
                                  "Digital product"}
                              </p>
                              <div className="mt-2 text-xs md:text-sm text-gray-500">
                                <span> Quantity: {item.quantity || 1}</span>
                                <span className="mx-2">•</span>
                                <span>
                                  Downloads: {item.downloadCount || 0}/
                                  {item.downloadLimit || "∞"}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="font-medium text-gray-900 text-sm md:text-base">
                                ₦
                                {(item.price * item.quantity)?.toLocaleString()}
                              </div>
                              {order.status === "DELIVERED" && (
                                <div className="flex flex-col gap-2">
                                  <button
                                    onClick={() => handleDownload(item, order._id)}
                                    disabled={
                                      item.downloadCount >=
                                        item.downloadLimit &&
                                      item.downloadLimit !== -1
                                    }
                                    className={`inline-flex items-center px-2 md:px-3 py-1 border rounded-md text-xs md:text-sm font-medium transition-colors ${
                                      item.downloadCount >=
                                        item.downloadLimit &&
                                      item.downloadLimit !== -1
                                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                        : "border-[#D7195B] text-[#D7195B] hover:bg-[#D7195B] hover:text-white"
                                    }`}
                                  >
                                    <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                                    {item.downloadCount >= item.downloadLimit &&
                                    item.downloadLimit !== -1
                                      ? "Limit Reached"
                                      : "Download"}
                                  </button>
                                  {user && user.role === "CUSTOMER" && (
                                    <button
                                      onClick={() => handleReviewClick(item)}
                                      className="inline-flex items-center px-2 md:px-3 py-1 border border-gray-300 rounded-md text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                      <Star className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                                      Review
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div className="bg-white rounded-lg shadow p-4 md:p-6">
                    <h3 className="font-semibold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">
                      Order Summary
                    </h3>
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-xs md:text-sm">
                          Subtotal
                        </span>
                        <span className="font-medium text-xs md:text-sm">
                          ₦{order.subtotal?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-xs md:text-sm">
                          Tax
                        </span>
                        <span className="font-medium text-xs md:text-sm">
                          ₦{order.tax?.toLocaleString()}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 md:pt-3 flex justify-between">
                        <span className="font-semibold text-gray-900 text-sm md:text-base">
                          Total
                        </span>
                        <span className="font-bold text-lg text-[#D7195B]">
                          ₦{order.total?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-4 md:p-6">
                    <h3 className="font-semibold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">
                      Payment Information
                    </h3>
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                        <span className="text-gray-600 text-xs md:text-sm">
                          {order.paymentMethod || "PAYSTACK"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                        <span className="text-gray-600 text-xs md:text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {order.shippingAddress && (
                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                      <h3 className="font-semibold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">
                        Shipping Address
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gray-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900 text-xs md:text-sm">
                              {order.shippingAddress.fullName}
                            </p>
                            <p className="text-gray-600 text-xs md:text-sm">
                              {order.shippingAddress.street}
                            </p>
                            <p className="text-gray-600 text-xs md:text-sm">
                              {order.shippingAddress.city},{" "}
                              {order.shippingAddress.state}{" "}
                              {order.shippingAddress.postalCode}
                            </p>
                            <p className="text-gray-600 text-xs md:text-sm">
                              {order.shippingAddress.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </SectionWrapper>

      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ ...reviewModal, isOpen: false })}
        productId={reviewModal.productId}
        orderId={reviewModal.orderId}
        productName={reviewModal.productName}
      />
    </div>
  );
}

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AuthWrapper requireAuth={true}>
      <OrderDetailsPageContent params={params} />
    </AuthWrapper>
  );
}
