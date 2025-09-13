"use client";

import { useState } from "react";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
  useClearAllNotifications,
} from "@/hooks/useAPI";
import {
  Bell,
  Check,
  Trash2,
  Filter,
  Package,
  ShoppingCart,
  Star,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  CheckCheck,
} from "lucide-react";
import VendorSidebar from "@/components/dashboard/VendorSidebar";
import SectionWrapper from "@/components/layout/SectionWrapper";
import Pagination from "@/components/ui/Pagination";
import ConfirmationModal from "@/components/modals/NotificationConfirmationModal";
import AuthWrapper from "@/components/auth/AuthWrapper";

function VendorNotificationsContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: "",
    isRead: undefined as boolean | undefined,
    priority: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const notificationsPerPage = 10;
  const { data: notificationsData, isLoading } = useNotifications({
    ...filters,
    page: currentPage,
    limit: notificationsPerPage,
  });

  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();
  const clearAllNotifications = useClearAllNotifications();

  const notifications =
    (notificationsData?.data?.data as any)?.notifications || [];
  const unreadCount = (notificationsData?.data?.data as any)?.unreadCount || 0;
  const total = (notificationsData?.data?.pagination as any)?.total || 0;
  const totalPages = Math.ceil(total / notificationsPerPage);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead.mutateAsync(id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead.mutateAsync();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification.mutateAsync(id);
      setShowDeleteModal(null);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllNotifications.mutateAsync();
      setShowClearAllModal(false);
    } catch (error) {
      console.error("Failed to clear all notifications:", error);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      isRead: undefined,
      priority: "",
    });
    setCurrentPage(1);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ORDER_CREATED":
      case "ORDER_PAYMENT_RECEIVED":
        return <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />;
      case "ORDER_CONFIRMED":
      case "ORDER_SHIPPED":
      case "ORDER_DELIVERED":
        return <Package className="w-4 h-4 md:w-5 md:h-5 text-green-600" />;
      case "ORDER_CANCELLED":
      case "ORDER_REFUNDED":
        return <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />;
      case "REVIEW_ADDED":
      case "REVIEW_HELPFUL":
        return <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />;
      case "REVIEW_REPORTED":
        return (
          <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
        );
      case "REVIEW_RESPONSE":
        return <Package className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />;
      case "PAYMENT_SUCCESS":
      case "PAYMENT_REFUNDED":
        return <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-green-600" />;
      case "PAYMENT_FAILED":
        return <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />;
      case "PRODUCT_APPROVED":
        return <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />;
      case "PRODUCT_REJECTED":
        return <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />;
      case "PRODUCT_UPDATED":
        return <Package className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />;
      case "VENDOR_APPROVED":
        return <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />;
      case "VENDOR_REJECTED":
      case "VENDOR_SUSPENDED":
        return <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />;
      case "SYSTEM_ANNOUNCEMENT":
      case "MAINTENANCE_NOTICE":
        return (
          <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
        );
      case "NEW_FEATURE":
        return <Package className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />;
      case "PROMOTION":
      case "PRICE_DROP":
        return <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-pink-600" />;
      default:
        return <Bell className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string, isRead: boolean) => {
    if (isRead) return "bg-gray-50 border-gray-400";

    switch (type) {
      case "ORDER_CREATED":
      case "ORDER_PAYMENT_RECEIVED":
        return "bg-blue-50 border-blue-400";
      case "ORDER_CONFIRMED":
      case "ORDER_SHIPPED":
      case "ORDER_DELIVERED":
      case "PAYMENT_SUCCESS":
      case "PRODUCT_APPROVED":
      case "VENDOR_APPROVED":
        return "bg-green-50 border-green-400";
      case "ORDER_CANCELLED":
      case "ORDER_REFUNDED":
      case "PAYMENT_FAILED":
      case "PRODUCT_REJECTED":
      case "VENDOR_REJECTED":
      case "VENDOR_SUSPENDED":
        return "bg-red-50 border-red-400";
      case "REVIEW_ADDED":
      case "REVIEW_HELPFUL":
        return "bg-yellow-50 border-yellow-400";
      case "REVIEW_REPORTED":
      case "SYSTEM_ANNOUNCEMENT":
      case "MAINTENANCE_NOTICE":
        return "bg-orange-50 border-orange-400";
      case "REVIEW_RESPONSE":
        return "bg-purple-50 border-purple-400";
      case "NEW_FEATURE":
        return "bg-purple-50 border-purple-400";
      case "PROMOTION":
      case "PRICE_DROP":
        return "bg-pink-50 border-pink-400";
      default:
        return "bg-gray-50 border-gray-400";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full";
      case "HIGH":
        return "bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full";
      case "NORMAL":
        return "bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full";
      case "LOW":
        return "bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full";
      default:
        return "bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <SectionWrapper className="pt-4 pb-4 md:pt-8 md:pb-8">
          <div className="max-w-7xl mx-auto px-2 md:px-4">
            <div className="flex gap-4 md:gap-8">
              <VendorSidebar />
              <main className="flex-1 bg-white rounded-lg shadow p-3 md:p-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-20 bg-gray-100 rounded border-l-4 border-gray-300"
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
            <VendorSidebar />
            <main className="flex-1 bg-white rounded-lg shadow p-3 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                    Notifications
                  </h1>
                  {unreadCount > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full mt-2 inline-block">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filters</span>
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      disabled={markAllAsRead.isLoading}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#D7195B] rounded-md hover:bg-[#AD003C] disabled:opacity-50"
                    >
                      <CheckCheck className="w-4 h-4" />
                      <span className="hidden sm:inline"> Mark All Read</span>
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={() => setShowClearAllModal(true)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {showFilters && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700">
                      Filters
                    </h3>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      value={filters.category}
                      onChange={(e) =>
                        setFilters({ ...filters, category: e.target.value })
                      }
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Categories</option>
                      <option value="ORDER">Orders</option>
                      <option value="PAYMENT">Payments</option>
                      <option value="PRODUCT">Products</option>
                      <option value="REVIEW">Reviews</option>
                      <option value="ACCOUNT">Account</option>
                      <option value="SYSTEM">System</option>
                      <option value="PROMOTION">Promotions</option>
                      <option value="SECURITY">Security</option>
                      <option value="FEATURE">Features</option>
                    </select>
                    <select
                      value={
                        filters.isRead === undefined
                          ? ""
                          : filters.isRead.toString()
                      }
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          isRead:
                            e.target.value === ""
                              ? undefined
                              : e.target.value === "true",
                        })
                      }
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Status</option>
                      <option value="false">Unread</option>
                      <option value="true">Read</option>
                    </select>
                    <select
                      value={filters.priority}
                      onChange={(e) =>
                        setFilters({ ...filters, priority: e.target.value })
                      }
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Priorities</option>
                      <option value="URGENT">Urgent</option>
                      <option value="HIGH">High</option>
                      <option value="NORMAL">Normal</option>
                      <option value="LOW">Low</option>
                    </select>
                  </div>
                </div>
              )}

              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                    No notifications
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 md:space-y-4">
                    {notifications.map((notification: any) => (
                      <div
                        key={notification._id}
                        className={`border-l-4 p-3 md:p-4 ${getNotificationColor(notification.type, notification.isRead)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2 md:gap-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-gray-900 text-sm md:text-base">
                                  {notification.title}
                                </p>
                                <span
                                  className={getPriorityBadge(
                                    notification.priority
                                  )}
                                >
                                  {notification.priority}
                                </span>
                              </div>
                              <p className="text-gray-700 text-xs md:text-sm">
                                {notification.message}
                              </p>
                              {notification.data && (
                                <div className="mt-2 text-xs text-gray-500">
                                  {notification.data.orderNumber && (
                                    <span className="inline-block bg-gray-100 px-2 py-1 rounded mr-2">
                                      Order: {notification.data.orderNumber}
                                    </span>
                                  )}
                                  {notification.data.amount && (
                                    <span className="inline-block bg-gray-100 px-2 py-1 rounded mr-2">
                                      ₦
                                      {notification.data.amount.toLocaleString()}
                                    </span>
                                  )}
                                  {notification.data.productName && (
                                    <span className="inline-block bg-gray-100 px-2 py-1 rounded">
                                      {notification.data.productName}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-xs text-gray-600">
                              {new Date(
                                notification.createdAt
                              ).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-1">
                              {!notification.isRead && (
                                <button
                                  onClick={() =>
                                    handleMarkAsRead(notification._id)
                                  }
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                  title="Mark as read"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  setShowDeleteModal(notification._id)
                                }
                                className="p-1 text-red-600 hover:text-red-800"
                                title="Delete notification"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      className="mt-6"
                    />
                  )}
                </>
              )}

              <ConfirmationModal
                isOpen={showClearAllModal}
                onClose={() => setShowClearAllModal(false)}
                onConfirm={handleClearAll}
                title="Clear All Notifications"
                message="Are you sure you want to delete all notifications? This action cannot be undone."
                confirmText="Clear All"
                confirmVariant="danger"
                isLoading={clearAllNotifications.isLoading}
              />

              <ConfirmationModal
                isOpen={!!showDeleteModal}
                onClose={() => setShowDeleteModal(null)}
                onConfirm={() =>
                  showDeleteModal && handleDeleteNotification(showDeleteModal)
                }
                title="Delete Notification"
                message="Are you sure you want to delete this notification? This action cannot be undone."
                confirmText="Delete"
                confirmVariant="danger"
                isLoading={deleteNotification.isLoading}
              />
            </main>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

export default function VendorNotificationsPage() {
  return (
    <AuthWrapper requireAuth={true}>
      <VendorNotificationsContent />
    </AuthWrapper>
  );
}
