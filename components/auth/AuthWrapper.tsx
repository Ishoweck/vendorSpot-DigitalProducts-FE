"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useAPI";

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthWrapper({
  children,
  requireAuth = true,
  redirectTo = "/login",
}: AuthWrapperProps) {
  const { data: userProfile, isLoading, error } = useUserProfile();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && requireAuth) {
      const { CookieService } = require("@/lib/cookies");
      const token = CookieService.get("auth_token");

      if (!token) {
        router.push(redirectTo);
        return;
      }

      if (error) {
        router.push(redirectTo);
        return;
      }
    }
  }, [mounted, error, requireAuth, redirectTo, router]);

  if (!mounted || (requireAuth && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#D7195B]"></div>
      </div>
    );
  }

  if (requireAuth && error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#D7195B]"></div>
      </div>
    );
  }

  if (requireAuth && !userProfile?.data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#D7195B]"></div>
      </div>
    );
  }

  return <>{children}</>;
}
