"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Users,
  UserRoundCheck,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  CreditCard,
  Bell,
  MapPin,
  Package,
  Wallet,
} from "lucide-react";
import { useUserProfile, useLogout, useCategories } from "@/hooks/useAPI";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const { data: userProfile } = useUserProfile();
  const { data: categoriesData } = useCategories();
  const logoutMutation = useLogout();
  const user = userProfile?.data?.data;
  const pathname = usePathname();
  const categories = categoriesData?.data?.data || [];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-50 lg:hidden ${
          isOpen ? "bg-opacity-50" : "bg-opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-50 lg:hidden transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold text-black">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1 overscroll-contain">
          <div className="space-y-3 pb-4 border-b">
            {user ? (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <UserRoundCheck className="w-5 h-5 text-[#D7195B]" />
                <span className="font-medium text-black">
                  Hi, {user.firstName}
                </span>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Users color="pink" className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-black">Login/Signup</span>
              </Link>
            )}
          </div>

          <div className="space-y-2 pb-4 border-b">
            <h3 className="text-sm font-medium text-gray-900 px-3 mb-2">
              Categories
            </h3>
            {categories.map((category: any) => (
              <Link
                key={category._id}
                href={`/products?category=${category.slug}`}
                onClick={onClose}
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Package color="pink" className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-black">{category.name}</span>
              </Link>
            ))}
          </div>

          {user && (
            <div className="space-y-2 pb-4 border-b">
              <Link
                href={
                  user.role === "VENDOR"
                    ? "/dashboard/vendor"
                    : "/dashboard/user"
                }
                onClick={onClose}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  pathname ===
                  (user.role === "VENDOR"
                    ? "/dashboard/vendor"
                    : "/dashboard/user")
                    ? "text-[#D7195B]"
                    : "hover:bg-gray-100 text-black"
                }`}
              >
                <Users 
                  className={`w-5 h-5 ${
                    pathname ===
                    (user.role === "VENDOR"
                      ? "/dashboard/vendor"
                      : "/dashboard/user")
                      ? "text-[#D7195B]"
                      : "text-gray-600"
                  }`}
                />
                <span className="font-medium">My Account</span>
              </Link>

              {user.role === "VENDOR" ? (
                <>
                  <Link
                    href="/dashboard/vendor/products"
                    onClick={onClose}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      pathname === "/dashboard/vendor/products"
                        ? "text-[#D7195B]"
                        : "hover:bg-gray-100 text-black"
                    }`}
                  >
                    <Package color="pink"
                      className={`w-5 h-5 ${
                        pathname === "/dashboard/vendor/products"
                          ? "text-[#D7195B]"
                          : "text-gray-600"
                      }`}
                    />
                    <span className="font-medium">Products</span>
                  </Link>

                  <Link
                    href="/dashboard/vendor/notifications"
                    onClick={onClose}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      pathname === "/dashboard/vendor/notifications"
                        ? "text-[#D7195B]"
                        : "hover:bg-gray-100 text-black"
                    }`}
                  >
                    <Bell 
                      className={`w-5 h-5 ${
                        pathname === "/dashboard/vendor/notifications"
                          ? "text-[#D7195B]"
                          : "text-gray-600"
                      }`}
                    />
                    <span className="font-medium">Notifications</span>
                  </Link>

                  <Link
                    href="/dashboard/vendor/wallet"
                    onClick={onClose}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      pathname === "/dashboard/vendor/wallet"
                        ? "text-[#D7195B]"
                        : "hover:bg-gray-100 text-black"
                    }`}
                  >
                    <Wallet color="pink"
                      className={`w-5 h-5 ${
                        pathname === "/dashboard/vendor/wallet"
                          ? "text-[#D7195B]"
                          : "text-gray-600"
                      }`}
                    />
                    <span className="font-medium">Wallet</span>
                  </Link>

                  <Link
                    href="/dashboard/vendor/profile"
                    onClick={onClose}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      pathname === "/dashboard/vendor/profile"
                        ? "text-[#D7195B]"
                        : "hover:bg-gray-100 text-black"
                    }`}
                  >
                    <Settings
                      className={`w-5 h-5 ${
                        pathname === "/dashboard/vendor/profile"
                          ? "text-[#D7195B]"
                          : "text-gray-600"
                      }`}
                    />
                    <span className="font-medium">Profile</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard/user/orders"
                    onClick={onClose}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      pathname === "/dashboard/user/orders"
                        ? "text-[#D7195B]"
                        : "hover:bg-gray-100 text-black"
                    }`}
                  >
                    <ShoppingBag color="pink"
                      className={`w-5 h-5 ${
                        pathname === "/dashboard/user/orders"
                          ? "text-[#D7195B]"
                          : "text-gray-600"
                      }`}
                    />
                    <span className="font-medium">Orders</span>
                  </Link>

                  <Link
                    href="/dashboard/user/saved-items"
                    onClick={onClose}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      pathname === "/dashboard/user/saved-items"
                        ? "text-[#D7195B]"
                        : "hover:bg-gray-100 text-black"
                    }`}
                  >
                    <Heart color="pink"
                      className={`w-5 h-5 ${
                        pathname === "/dashboard/user/saved-items"
                          ? "text-[#D7195B]"
                          : "text-gray-600"
                      }`}
                    />
                    <span className="font-medium">Saved Items</span>
                  </Link>

                  <Link
                    href="/dashboard/user/notifications"
                    onClick={onClose}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      pathname === "/dashboard/user/notifications"
                        ? "text-[#D7195B]"
                        : "hover:bg-gray-100 text-black"
                    }`}
                  >
                    <Bell color="pink"
                      className={`w-5 h-5 ${
                        pathname === "/dashboard/user/notifications"
                          ? "text-[#D7195B]"
                          : "text-gray-600"
                      }`}
                    />
                    <span className="font-medium">Notifications</span>
                  </Link>

                  <Link
                    href="/dashboard/user/shipping-address"
                    onClick={onClose}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      pathname === "/dashboard/user/shipping-address"
                        ? "text-[#D7195B]"
                        : "hover:bg-gray-100 text-black"
                    }`}
                  >
                    <MapPin color="pink"
                      className={`w-5 h-5 ${
                        pathname === "/dashboard/user/shipping-address"
                          ? "text-[#D7195B]"
                          : "text-gray-600"
                      }`}
                    />
                    <span className="font-medium">Shipping Address</span>
                  </Link>

                  <Link
                    href="/dashboard/user/settings"
                    onClick={onClose}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      pathname === "/dashboard/user/settings"
                        ? "text-[#D7195B]"
                        : "hover:bg-gray-100 text-black"
                    }`}
                  >
                    <Settings color="pink"
                      className={`w-5 h-5 ${
                        pathname === "/dashboard/user/settings"
                          ? "text-[#D7195B]"
                          : "text-gray-600"
                      }`}
                    />
                    <span className="font-medium">Settings</span>
                  </Link>
                </>
              )}

              <button
                onClick={() => {
                  onClose();
                  logoutMutation.mutate();
                }}
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors w-full text-left"
              >
                <LogOut className="w-5 h-5 text-[#D7195B]" />
                <span className="font-medium text-[#D7195B]">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
