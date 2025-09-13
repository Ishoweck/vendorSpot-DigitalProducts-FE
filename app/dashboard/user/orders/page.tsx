"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Download,
  Eye,
  Package,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import UserSidebar from "@/components/dashboard/UserSidebar";
import SectionWrapper from "@/components/layout/SectionWrapper";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { useOrders, useAddToCart, useDownloadProduct } from "@/hooks/useAPI";
import { useRouter } from "next/navigation";

function OrdersPageContent() {
  const [activeTab, setActiveTab] = useState("all");
  const { data: ordersData, isLoading } = useOrders();
  const addToCart = useAddToCart();
  const downloadProduct = useDownloadProduct();
  const router = useRouter();

  const orders = ordersData?.data?.data || [];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "text-green-600 bg-green-50";
      case "PROCESSING":
        return "text-yellow-600 bg-yellow-50";
      case "CANCELLED":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const filteredOrders = orders.filter((order: any) => {
    if (activeTab === "all") return true;
    return (order.status || "").toLowerCase() === activeTab;
  });

  const tabs = [
    { id: "all", label: "All Orders", count: orders.length },
    {
      id: "delivered",
      label: "Ready for Download",
      count: orders.filter((o: any) => o.status === "DELIVERED").length,
    },
    {
      id: "processing",
      label: "Processing",
      count: orders.filter((o: any) => o.status === "PROCESSING").length,
    },
    {
      id: "cancelled",
      label: "Cancelled",
      count: orders.filter((o: any) => o.status === "CANCELLED").length,
    },
  ];

  const handleDownload = (item: any, orderId: string) => {
    const productId = item.productId?._id || item.productId;
    if (productId && orderId) {
      downloadProduct.mutate({ productId, orderId });
    }
  };

  const handleReorder = async (item: any) => {
    const productId = item.productId?._id || item.productId;
    const quantity = item.quantity || 1;
    try {
      await addToCart.mutateAsync({ productId, quantity });
      router.push("/cart");
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <SectionWrapper className="pt-4 pb-4 md:pt-8 md:pb-8">
          <div className="max-w-7xl mx-auto px-2 md:px-4">
            <div className="flex gap-4 md:gap-8">
              <UserSidebar />
              <main className="flex-1 bg-white rounded-lg shadow p-3 md:p-6 overflow-hidden">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                  <div className="space-y-4 md:space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-gray-100 rounded-lg p-4 h-32"
                      ></div>
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
      <SectionWrapper className="pt-4 pb-4 md:pt-8 md:pb-8">
        <div className="max-w-7xl mx-auto px-2 md:px-4">
          <div className="flex gap-4 md:gap-8">
            <UserSidebar />
            <main className="flex-1 bg-white rounded-lg shadow p-3 md:p-6 overflow-hidden">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  My Orders
                </h1>
                <p className="text-gray-600">
                  Track and manage your digital product orders
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 mb-6">
                <div className="border-b border-gray-200">
                  <div className="overflow-x-auto scrollbar-hide">
                    <nav className="flex space-x-8 px-6 min-w-max">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
                            activeTab === tab.id
                              ? "border-[#D7195B] text-[#D7195B]"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          {tab.label}
                          <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            {tab.count}
                          </span>
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {filteredOrders.length === 0 ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No orders found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      You haven&apos;t placed any orders yet.
                    </p>
                    <Link
                      href="/products"
                      className="inline-flex items-center px-4 py-2 bg-[#D7195B] text-white rounded-md hover:bg-[#B01548] transition-colors"
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  filteredOrders.map((order: any) => (
                    <div
                      key={order._id}
                      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">
                                Order #{order.orderNumber}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Placed on{" "}
                                {order.createdAt
                                  ? new Date(
                                      order.createdAt
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })
                                  : ""}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(order.status)}
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                              >
                                {order.status === "DELIVERED"
                                  ? "Ready for Download"
                                  : order.status}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-xl text-[#D7195B]">
                              ₦{order.total?.toLocaleString() || "0"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.items?.length || 0}{" "}
                              {(order.items?.length || 0) === 1
                                ? "item"
                                : "items"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="space-y-4">
                          {order.items?.map((item: any) => (
                            <div
                              key={item._id || item.productId}
                              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 rounded-lg"
                            >
                              <div className="relative w-16 h-16 flex-shrink-0">
                                <Image
                                  src={
                                    item.productId?.thumbnail ||
                                    "/api/placeholder/80/80"
                                  }
                                  alt={
                                    item.name ||
                                    item.productId?.name ||
                                    "Product"
                                  }
                                  fill
                                  className="object-cover rounded-lg"
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/products/${item.productId?._id || item.productId}`}
                                  className="block"
                                >
                                  <h4 className="font-medium text-gray-900 hover:text-[#D7195B] transition-colors duration-200 mb-1">
                                    {item.name ||
                                      item.productId?.name ||
                                      "Product"}
                                  </h4>
                                </Link>
                                <p className="text-sm text-gray-500 mb-1">
                                  by{" "}
                                  {item.vendorId?.businessName ||
                                    item.productId?.vendorId?.businessName ||
                                    "Unknown Vendor"}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span>Qty: {item.quantity || 1}</span>
                                  <span>•</span>
                                  <span>
                                    Downloads: {item.downloadCount || 0}/
                                    {item.downloadLimit === -1
                                      ? "∞"
                                      : item.downloadLimit || "∞"}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-3">
                                <div className="font-semibold text-gray-900">
                                  ₦
                                  {(
                                    item.price * item.quantity
                                  )?.toLocaleString() || "0"}
                                </div>

                                {order.status === "DELIVERED" && (
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <button
                                      onClick={() =>
                                        handleDownload(item, order._id)
                                      }
                                      disabled={
                                        item.downloadCount >=
                                          item.downloadLimit &&
                                        item.downloadLimit !== -1
                                      }
                                      className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                                        item.downloadCount >=
                                          item.downloadLimit &&
                                        item.downloadLimit !== -1
                                          ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-100"
                                          : "border-[#D7195B] text-[#D7195B] hover:bg-[#D7195B] hover:text-white"
                                      }`}
                                    >
                                      <Download className="w-4 h-4 mr-2" />
                                      {item.downloadCount >=
                                        item.downloadLimit &&
                                      item.downloadLimit !== -1
                                        ? "Limit Reached"
                                        : "Download"}
                                    </button>

                                    <button
                                      onClick={() => handleReorder(item)}
                                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                      Reorder
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                          <Link
                            href={`/dashboard/user/orders/${order._id}`}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </main>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AuthWrapper requireAuth={true}>
      <OrdersPageContent />
    </AuthWrapper>
  );
}
