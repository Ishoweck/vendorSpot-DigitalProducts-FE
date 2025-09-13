"use client";

import CreateProductForm from "@/components/products/CreateProductForm";
import VendorSidebar from "@/components/dashboard/VendorSidebar";
import SectionWrapper from "@/components/layout/SectionWrapper";
import AuthWrapper from "@/components/auth/AuthWrapper";

function CreateProductContent() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <SectionWrapper className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            <VendorSidebar />
            <main className="flex-1">
              <CreateProductForm />
            </main>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

export default function CreateProductPage() {
  return (
    <AuthWrapper requireAuth={true}>
      <CreateProductContent />
    </AuthWrapper>
  );
}
