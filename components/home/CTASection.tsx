import Link from "next/link";

export default function CTASection() {
  return (
    <section
      className="py-6 sm:py-8 md:py-11 bg-[#9F9F9F]"
      style={{ marginTop: "41px" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link
            href="/signup?vendor=true"
            className="bg-[#D7195B] text-white px-6 sm:px-8 py-3 font-medium hover:bg-[#B91548] transition-colors duration-200 text-sm sm:text-base"
            style={{ borderRadius: "15px" }}
          >
            Become a Vendor
          </Link>

          <div
            className="flex w-full sm:w-auto"
            style={{ maxWidth: "700px", width: "100%" }}
          >
            <input
              type="email"
              placeholder="Email Address"
              className="flex-1 px-4 py-3 border-none outline-none text-base"
              style={{
                borderRadius: "15px 0 0 15px",
                backgroundColor: "white",
                color: "#9D9C9C",
              }}
            />
            <button
              className="bg-black text-white px-4 sm:px-6 py-3 font-medium hover:bg-gray-800 transition-colors duration-200 text-base"
              style={{
                borderRadius: "0 15px 15px 0",
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
