import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-white rounded-t-lg">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col lg:flex-row items-center justify-between py-8 sm:py-12 md:py-16 lg:py-20 gap-6 sm:gap-8 lg:gap-12">
          <div className="flex-1 w-full lg:max-w-none">
            <h1 className="text-black font-semibold text-[1.5rem] md:text-[1.875rem] lg:text-[2.125rem] xl:text-[2.5rem] leading-[1.2] font-inter mb-4 sm:mb-6">
              <div className="whitespace-nowrap">
                Smart Tools. Bigger Impact.
              </div>
              <div className="whitespace-nowrap">
                Built for Business Owners.
              </div>
            </h1>

            <p className="text-black font-normal text-base sm:text-lg md:text-xl lg:text-xl leading-relaxed font-inter mb-6 sm:mb-8 max-w-none lg:max-w-2xl">
              Access digital tools to plan your goals, grow your business,
              promote online, and run effective ads, all in one trusted spot.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* <Link
                href="/digital-products"
                className="bg-[#D7195B] text-white px-6 sm:px-8 py-3 rounded-lg font-medium hover:bg-[#B01548] transition-colors duration-200 text-center text-sm sm:text-base"
              >
                Explore Tools
              </Link> */}

              <Link
                href="/signup?vendor=true"
                className="bg-white text-[#D7195B] border border-[#D7195B] px-6 sm:px-8 py-3 rounded-lg font-medium hover:bg-[#D7195B] hover:text-white transition-colors duration-200 text-center text-sm sm:text-base"
              >
                Become a Seller
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
              <Image
                src="/images/hero-img.svg"
                alt="Digital Tools for Business"
                width={500}
                height={400}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
