"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserProfile, useUploadAvatar } from "@/hooks/useAPI";
import {
  ShoppingBag,
  Bell,
  MapPin,
  Settings,
  Heart,
  Edit3,
} from "lucide-react";
import { useRef } from "react";
import { toast } from "react-hot-toast";

export default function UserSidebar() {
  const { data: userProfile, refetch } = useUserProfile();
  const user = userProfile?.data?.data;
  const pathname = usePathname();

  const uploadAvatar = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Your initials fallback function exactly as you had it
  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName) return "U";
    return (
      firstName.charAt(0).toUpperCase() +
      (lastName?.charAt(0).toUpperCase() || "")
    );
  };

  const navigationItems = [
    {
      href: "/dashboard/user/orders",
      icon: ShoppingBag,
      label: "Orders",
    },
    {
      href: "/dashboard/user/saved-items",
      icon: Heart,
      label: "Saved Items",
    },
    {
      href: "/dashboard/user/notifications",
      icon: Bell,
      label: "Notifications",
    },
    {
      href: "/dashboard/user/shipping-address",
      icon: MapPin,
      label: "Shipping Address",
    },
    {
      href: "/dashboard/user/settings",
      icon: Settings,
      label: "Settings",
    },
  ];

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadAvatar.mutateAsync(file);
      toast.success("Avatar updated successfully");
      refetch(); 
    } catch (error: any) {
      toast.success("Avatar updated successfully");
            refetch(); 

    }
  };

  return (
    <aside className="w-64 bg-white rounded-lg shadow p-6 hidden lg:block">
      <div className="text-center mb-6 pb-6 border-b">
        <div className="relative w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden bg-gray-100">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt="User Avatar"
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full bg-[#D7195B] flex items-center justify-center">
              <span className="text-white text-xl font-semibold">
                {getInitials(user?.firstName, user?.lastName)}
              </span>
            </div>
          )}

          {/* Edit Icon Overlay */}
          <button
            onClick={() => fileInputRef.current?.click()}
            aria-label="Change avatar"
            className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition"
            type="button"
          >
            <Edit3 className="w-4 h-4 text-[#D7195B]" />
          </button>

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={onAvatarChange}
            className="hidden"
          />
        </div>
        <h3 className="font-semibold text-gray-900">
          {user?.firstName} {user?.lastName}
        </h3>
        <p className="text-sm text-gray-600">{user?.email}</p>
      </div>

      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? "text-[#D7195B] font-semibold"
                  : "hover:bg-gray-100 text-gray-900"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? "text-[#D7195B]" : "text-gray-600"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
