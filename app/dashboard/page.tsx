"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useAPI";
import AuthWrapper from "@/components/auth/AuthWrapper";

function DashboardRedirect() {
  const router = useRouter();
  const { data: userProfile } = useUserProfile();

  useEffect(() => {
    if (userProfile?.data?.data) {
      const user = userProfile.data.data;
      if (user.role === "VENDOR") {
        router.push("/dashboard/vendor");
      } else {
        router.push("/dashboard/user");
      }
    }
  }, [userProfile, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D7195B]"></div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthWrapper requireAuth={true}>
      <DashboardRedirect />
    </AuthWrapper>
  );
}
