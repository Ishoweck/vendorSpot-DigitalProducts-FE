"use client";

import { useState } from "react";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
  useClearAllNotifications,
} from "@/hooks/useAPI";
import { Bell, Check, Trash2, Filter, CheckCheck } from "lucide-react";
import UserSidebar from "@/components/dashboard/UserSidebar";
import SectionWrapper from "@/components/layout/SectionWrapper";
import AuthWrapper from "@/components/auth/AuthWrapper";
import ConfirmationModal from "@/components/modals/NotificationConfirmationModal";

function NotificationsPageContent() {
  const [filters, setFilters] = useState({
    category: "",
    isRead: undefined as boolean | undefined,
    priority: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const { data: notificationsData, isLoading } = useNotifications({
    ...filters,
    limit: 50,
  });
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();
  const clearAllNotifications = useClearAllNotifications();

  const notifications =
    (notificationsData?.data?.data as any)?.notifications || [];
  const unreadCount = (notificationsData?.data?.data as any)?.unreadCount || 0;

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
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "PAYMENT_SUCCESS":
        return "💰";
      case "PAYMENT_FAILED":
        return "❌";
      case "PAYMENT_REFUNDED":
        return "↩️";
      case "ORDER_PAYMENT_RECEIVED":
        return "📦";
      case "ORDER_CREATED":
        return "🛒";
      case "ORDER_CONFIRMED":
        return "✅";
      case "ORDER_SHIPPED":
        return "🚚";
      case "ORDER_DELIVERED":
        return "🎉";
      case "ORDER_CANCELLED":
        return "🚫";
      case "ORDER_REFUNDED":
        return "↩️";
      case "PRODUCT_APPROVED":
        return "✅";
      case "PRODUCT_REJECTED":
        return "❌";
      case "PRODUCT_UPDATED":
        return "🔄";
      case "REVIEW_ADDED":
        return "⭐";
      case "REVIEW_HELPFUL":
        return "👍";
      case "REVIEW_REPORTED":
        return "🚨";
      case "REVIEW_RESPONSE":
        return "💬";
      case "VENDOR_APPROVED":
        return "🎉";
      case "VENDOR_REJECTED":
        return "❌";
      case "VENDOR_SUSPENDED":
        return "⚠️";
      case "WELCOME":
        return "👋";
      case "PROFILE_UPDATED":
        return "👤";
      case "PASSWORD_CHANGED":
        return "🔒";
      case "ACCOUNT_VERIFIED":
        return "✅";
      case "SECURITY_ALERT":
        return "🚨";
      case "PRICE_DROP":
        return "📉";
      case "STOCK_ALERT":
        return "⚠️";
      case "NEW_FEATURE":
        return "🆕";
      case "MAINTENANCE_NOTICE":
        return "🔧";
      case "SYSTEM_ANNOUNCEMENT":
        return "📢";
      case "PROMOTION":
        return "🎁";
      default:
        return "🔔";
    }
  };

  const getNotificationColor = (type: string, isRead: boolean) => {
    if (isRead) return "bg-gray-50 border-gray-400";

    switch (type) {
      case "PAYMENT_SUCCESS":
      case "ORDER_DELIVERED":
      case "PRODUCT_APPROVED":
      case "VENDOR_APPROVED":
      case "ACCOUNT_VERIFIED":
        return "bg-green-50 border-green-400";
      case "PAYMENT_FAILED":
      case "ORDER_CANCELLED":
      case "PRODUCT_REJECTED":
      case "VENDOR_REJECTED":
      case "VENDOR_SUSPENDED":
      case "SECURITY_ALERT":
        return "bg-red-50 border-red-400";
      case "ORDER_PAYMENT_RECEIVED":
      case "ORDER_CREATED":
      case "WELCOME":
      case "NEW_FEATURE":
        return "bg-blue-50 border-blue-400";
      case "ORDER_CONFIRMED":
      case "ORDER_SHIPPED":
      case "PROFILE_UPDATED":
      case "PASSWORD_CHANGED":
        return "bg-purple-50 border-purple-400";
      case "REVIEW_ADDED":
      case "REVIEW_HELPFUL":
        return "bg-yellow-50 border-yellow-400";
      case "REVIEW_REPORTED":
      case "MAINTENANCE_NOTICE":
        return "bg-orange-50 border-orange-400";
      case "REVIEW_RESPONSE":
        return "bg-purple-50 border-purple-400";
      case "PRICE_DROP":
      case "STOCK_ALERT":
        return "bg-pink-50 border-pink-400";
      case "SYSTEM_ANNOUNCEMENT":
      case "PROMOTION":
        return "bg-indigo-50 border-indigo-400";
      default:
        return "bg-blue-50 border-blue-400";
    }
  };

  const getNotificationTextColor = (type: string, isRead: boolean) => {
    if (isRead) return "text-gray-900";

    switch (type) {
      case "PAYMENT_SUCCESS":
      case "ORDER_DELIVERED":
      case "PRODUCT_APPROVED":
      case "VENDOR_APPROVED":
      case "ACCOUNT_VERIFIED":
        return "text-green-900";
      case "PAYMENT_FAILED":
      case "ORDER_CANCELLED":
      case "PRODUCT_REJECTED":
      case "VENDOR_REJECTED":
      case "VENDOR_SUSPENDED":
      case "SECURITY_ALERT":
        return "text-red-900";
      case "ORDER_PAYMENT_RECEIVED":
      case "ORDER_CREATED":
      case "WELCOME":
      case "NEW_FEATURE":
        return "text-blue-900";
      case "ORDER_CONFIRMED":
      case "ORDER_SHIPPED":
      case "PROFILE_UPDATED":
      case "PASSWORD_CHANGED":
        return "text-purple-900";
      case "REVIEW_ADDED":
      case "REVIEW_HELPFUL":
        return "text-yellow-900";
      case "REVIEW_REPORTED":
      case "MAINTENANCE_NOTICE":
        return "text-orange-900";
      case "REVIEW_RESPONSE":
        return "text-purple-900";
      case "PRICE_DROP":
      case "STOCK_ALERT":
        return "text-pink-900";
      case "SYSTEM_ANNOUNCEMENT":
      case "PROMOTION":
        return "text-indigo-900";
      default:
        return "text-blue-900";
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
        <SectionWrapper className="pt-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-8">
              <UserSidebar />
              <main className="flex-1 bg-white rounded-lg shadow p-4 sm:p-6">
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
      <SectionWrapper className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            <UserSidebar />
            <main className="flex-1 bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
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

              {/* Filters */}
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
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No notifications
                  </h3>
                  <p className="text-gray-600">You&apos;re all caught up!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification: any) => (
                    <div
                      key={notification._id}
                      className={`border-l-4 p-4 transition-all duration-200 hover:shadow-md ${getNotificationColor(
                        notification.type,
                        notification.isRead
                      )}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p
                              className={`font-medium ${getNotificationTextColor(
                                notification.type,
                                notification.isRead
                              )}`}
                            >
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
                          <p
                            className={`text-sm mt-1 ${
                              notification.isRead
                                ? "text-gray-700"
                                : "text-gray-600"
                            }`}
                          >
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
                                <span className="inline-block bg-gray-100 px-2 py-1 rounded">
                                  ₦{notification.data.amount.toLocaleString()}
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
                        <div className="flex flex-col items-end space-y-2">
                          <span
                            className={`text-xs ${
                              notification.isRead
                                ? "text-gray-600"
                                : "text-blue-600"
                            }`}
                          >
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

export default function NotificationsPage() {
  return (
    <AuthWrapper requireAuth={true}>
      <NotificationsPageContent />
    </AuthWrapper>
  );
}
