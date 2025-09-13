"use client";

import {
  useUserProfile,
  useVendorDashboard,
  useVendorProfile,
} from "@/hooks/useAPI";
import {
  Mail,
  TrendingUp,
  Package,
  Star,
  DollarSign,
  ShoppingCart,
  Calendar,
  User,
} from "lucide-react";
import Link from "next/link";
import AuthWrapper from "@/components/auth/AuthWrapper";
import SectionWrapper from "@/components/layout/SectionWrapper";
import VendorSidebar from "@/components/dashboard/VendorSidebar";
import { useSocket } from "@/hooks/useSocket";
import { formatDistanceToNow } from "date-fns";
import { DashboardStatsSkeleton } from "@/components/ui/SkeletonCard";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { vendorsAPI } from "@/lib/api/vendors";
import { useEffect, useState } from "react";

function VendorDashboardContent() {
  const { data: userProfile } = useUserProfile();
  const { data: dashboardData } = useVendorDashboard();
  const { data: vendorProfile } = useVendorProfile();
  const user = userProfile?.data?.data;
  const vendor = vendorProfile?.data?.data;
  const stats = dashboardData?.data?.data?.stats;
  const recentOrders = dashboardData?.data?.data?.recentOrders || [];
  useSocket();

  const [salesData, setSalesData] = useState<any[]>([]);
  const [isLoadingSales, setIsLoadingSales] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await vendorsAPI.getSales("month");
        const rows = (res.data?.data || []).map((row: any) => {
          const d = row._id;
          const date = new Date(d.year, (d.month || 1) - 1, d.day || 1);
          return {
            date: date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            revenue: row.revenue || 0,
            orders: row.orders || 0,
          };
        });
        if (isMounted) setSalesData(rows);
      } catch (_) {
        if (isMounted) setSalesData([]);
      } finally {
        if (isMounted) setIsLoadingSales(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

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

  return (
    <div className="bg-gray-50 min-h-screen">
      <SectionWrapper className="pt-4 pb-4 md:pt-8 md:pb-8">
        <div className="max-w-7xl mx-auto px-2 md:px-4">
          <div className="flex gap-4 md:gap-8">
            <VendorSidebar />

            <main className="flex-1 bg-white rounded-lg shadow p-3 md:p-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 border-b border-gray-200 pb-2 md:pb-3">
                Vendor Dashboard
              </h1>

              {!user?.isEmailVerified && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-yellow-600 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">
                        Email Verification Required
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Please verify your email to start selling products.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!stats ? (
                <DashboardStatsSkeleton />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                  <div className="bg-gradient-to-r from-[#D7195B] to-[#B01548] text-white rounded-lg p-3 md:p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white text-sm md:text-base">
                        Total Sales
                      </h3>
                      <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <p className="text-xl md:text-3xl font-bold text-white">
                      ₦{stats?.totalRevenue?.toLocaleString() || "0"}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-3 md:p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white text-sm md:text-base">
                        Orders
                      </h3>
                      <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <p className="text-xl md:text-3xl font-bold text-white">
                      {stats?.totalOrders || 0}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-3 md:p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white text-sm md:text-base">
                        Products
                      </h3>
                      <Package className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <p className="text-xl md:text-3xl font-bold text-white">
                      {stats?.totalProducts || 0}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-3 md:p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white text-sm md:text-base">
                        Rating
                      </h3>
                      <Star className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <p className="text-xl md:text-3xl font-bold text-white">
                      {stats?.rating?.toFixed(1) || "0.0"}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Sales (This Month)
                  </h3>
                  <div className="h-32 md:h-48">
                    {isLoadingSales ? (
                      <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                        Loading chart...
                      </div>
                    ) : salesData.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                        No data
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={salesData}
                          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="colorRev"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#D7195B"
                                stopOpacity={0.4}
                              />
                              <stop
                                offset="95%"
                                stopColor="#D7195B"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                          <YAxis
                            tickFormatter={(v) => `₦${Math.round(v / 1000)}k`}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip
                            formatter={(v: any) => [
                              `₦${Number(v).toLocaleString()}`,
                              "Revenue",
                            ]}
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#D7195B"
                            fillOpacity={1}
                            fill="url(#colorRev)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                      Recent Orders
                    </h3>
                    <Link
                      href="/dashboard/vendor/orders"
                      className="text-sm text-[#D7195B] hover:text-[#B01548] transition-colors"
                    >
                      View All
                    </Link>
                  </div>
                  <div
                    className="h-32 md:h-48 overflow-y-auto space-y-3 pr-2"
                    style={{
                      scrollbarWidth: "thin",
                      scrollBehavior: "smooth",
                      scrollbarColor: "#D7195B transparent",
                    }}
                  >
                    {recentOrders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No orders yet</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Orders will appear here once customers make purchases
                        </p>
                      </div>
                    ) : (
                      recentOrders.slice(0, 5).map((order: any) => (
                        <div
                          key={order._id}
                          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-gray-500">
                                  #{order.orderNumber}
                                </span>
                                <span
                                  className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusColor(order.status)}`}
                                >
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {order.userId?.firstName}{" "}
                                {order.userId?.lastName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDistanceToNow(
                                  new Date(order.createdAt),
                                  {
                                    addSuffix: true,
                                  }
                                )}
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
                            {order.items
                              ?.slice(0, 2)
                              .map((item: any, index: number) => (
                                <div
                                  key={item._id || index}
                                  className="flex items-center justify-between text-xs"
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
                                      {(
                                        item.price * item.quantity
                                      )?.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            {order.items?.length > 2 && (
                              <p className="text-xs text-gray-500 text-center pt-1 border-t border-gray-100">
                                +{order.items.length - 2} more items
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Store Details
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Business Name:</span>{" "}
                      {vendor?.businessName || "Not set"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {user?.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Member Since:</span>{" "}
                      {new Date(user?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                      Quick Actions
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <Link
                      href="/dashboard/vendor/products"
                      className="block w-full bg-[#D7195B] text-white text-center py-2 px-4 rounded-lg hover:bg-[#B01548] transition-colors text-sm md:text-base"
                    >
                      Add New Product
                    </Link>
                    <Link
                      href="/dashboard/vendor/profile"
                      className="block w-full bg-gray-200 text-gray-700 text-center py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm md:text-base"
                    >
                      Update Profile
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

export default function VendorDashboardPage() {
  return (
    <AuthWrapper requireAuth={true}>
      <VendorDashboardContent />
    </AuthWrapper>
  );
}
