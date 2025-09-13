import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F8F8] relative">
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-gray-200">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#D7195B] transition-colors duration-200">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Homepage
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-6 mt-16 sm:mt-0">
            <Link href="/" className="inline-block">
              <Image
                src="/images/vendorspot-logo.svg"
                alt="Vendorspot"
                width={150}
                height={50}
                className="h-12 w-auto"
              />
            </Link>
          </div>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
