"use client";

import { useUserProfile, useVendorProfile } from "@/hooks/useAPI";
import { Package, Bell, ShoppingBag, Wallet, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function VendorSidebar() {
  const { data: userProfile } = useUserProfile();
  const { data: vendorProfile } = useVendorProfile();
  const user = userProfile?.data?.data;
  const vendor = vendorProfile?.data?.data;
  const pathname = usePathname();

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName) return "V";
    return (
      firstName.charAt(0).toUpperCase() +
      (lastName?.charAt(0).toUpperCase() || "")
    );
  };

  const navigationItems = [
    {
      href: "/dashboard/vendor/products",
      icon: Package,
      label: "Products",
    },
    {
      href: "/dashboard/vendor/orders",
      icon: ShoppingBag,
      label: "Orders",
    },
    {
      href: "/dashboard/vendor/notifications",
      icon: Bell,
      label: "Notifications",
    },
    {
      href: "/dashboard/vendor/wallet",
      icon: Wallet,
      label: "Wallet",
    },
    {
      href: "/dashboard/vendor/profile",
      icon: User,
      label: "Profile",
    },
  ];

  return (
    <aside className="w-64 bg-white rounded-lg shadow p-6 hidden lg:block">
      <div className="text-center mb-6 pb-6 border-b">
        <div className="w-16 h-16 bg-[#D7195B] rounded-full mx-auto mb-3 flex items-center justify-center">
          <span className="text-white text-xl font-semibold">
            {getInitials(user?.firstName, user?.lastName)}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900">
          {user?.firstName} {user?.lastName}
        </h3>
        <p className="text-sm text-gray-600">{user?.email}</p>
        <p className="text-xs text-[#D7195B] font-medium mt-1">Vendor</p>
        <div className="mt-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
              vendor?.verificationStatus === "APPROVED"
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : vendor?.verificationStatus === "PENDING"
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
            onClick={() =>
              (window.location.href = "/dashboard/vendor/profile#verification")
            }
          >
            {vendor?.verificationStatus === "APPROVED"
              ? "✓ Verified"
              : vendor?.verificationStatus === "PENDING"
              ? "⏳ Pending"
              : vendor?.verificationStatus === "NOT_VERIFIED"
              ? "⚪ Not Verified"
              : vendor?.verificationStatus === "REJECTED"
              ? "❌ Rejected"
              : ""}
          </span>
        </div>
      </div>

      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-gray-100 ${
                isActive ? "font-semibold" : "text-gray-900"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive
                    ? "text-[#ffdd00]"
                    : "text-red-900 group-hover:text-gray-900"
                }`}
              />
              <span
                className={`transition-colors ${
                  isActive
                    ? "text-gray-900"
                    : "text-gray-900 group-hover:text-gray-800"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
