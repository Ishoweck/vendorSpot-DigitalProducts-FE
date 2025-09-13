"use client";

import { useVendorOrders } from "@/hooks/useAPI";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Package, Filter, Search } from "lucide-react";
import Link from "next/link";
import AuthWrapper from "@/components/auth/AuthWrapper";
import SectionWrapper from "@/components/layout/SectionWrapper";
import VendorSidebar from "@/components/dashboard/VendorSidebar";

function VendorOrdersContent() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "DELIVERED",
    paymentStatus: "PAID",
  });

  const { data: ordersData, isLoading } = useVendorOrders(filters);
  const orders = ordersData?.data?.data || [];
  const pagination = ordersData?.data?.pagination;

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-700 bg-yellow-50 border border-yellow-200";
      case "CONFIRMED":
        return "text-blue-700 bg-blue-50 border border-blue-200";
      case "PROCESSING":
        return "text-purple-700 bg-purple-50 border border-purple-200";
      case "SHIPPED":
        return "text-indigo-700 bg-indigo-50 border border-indigo-200";
      case "DELIVERED":
        return "text-green-700 bg-green-50 border border-green-200";
      case "CANCELLED":
        return "text-red-700 bg-red-50 border border-red-200";
      case "REFUNDED":
        return "text-gray-700 bg-gray-50 border border-gray-200";
      default:
        return "text-gray-700 bg-gray-50 border border-gray-200";
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SectionWrapper className="pt-4 pb-4 md:pt-8 md:pb-8">
        <div className="max-w-7xl mx-auto px-2 md:px-4">
          <div className="flex gap-4 md:gap-8">
            <VendorSidebar />

            <main className="flex-1 bg-white rounded-lg shadow p-3 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Successful Orders
                </h1>
                <p className="text-sm text-gray-500">
                  Showing delivered and paid orders only
                </p>
              </div>



              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-24 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No orders found
                  </h3>
                  <p className="text-gray-500">
                    No successful orders found yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div
                      key={order._id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-500">
                              #{order.orderNumber}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusColor(order.status)}`}
                            >
                              {order.status}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                order.paymentStatus === "PAID"
                                  ? "text-green-700 bg-green-50 border border-green-200"
                                  : order.paymentStatus === "PENDING"
                                    ? "text-yellow-700 bg-yellow-50 border border-yellow-200"
                                    : "text-red-700 bg-red-50 border border-red-200"
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            {order.userId?.firstName} {order.userId?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(order.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm font-semibold text-gray-900">
                            ₦{order.total?.toLocaleString() || "0"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.items?.length || 0} item
                            {order.items?.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {order.items?.map((item: any, index: number) => (
                          <div
                            key={item._id || index}
                            className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-700 font-medium truncate">
                                {item.name}
                              </p>
                              <p className="text-gray-500">
                                Qty: {item.quantity} × ₦
                                {item.price?.toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right ml-2">
                              <p className="text-gray-700 font-medium">
                                ₦
                                {(item.price * item.quantity)?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} results
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-700">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

export default function VendorOrdersPage() {
  return (
    <AuthWrapper requireAuth={true}>
      <VendorOrdersContent />
    </AuthWrapper>
  );
}
