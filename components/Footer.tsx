import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <p className="text-white font-medium text-sm">
              Nigeria’s Most Trusted Marketplace — <br />
              Shop with Confidence on Vendorspot
            </p>
            <p className="text-white text-sm">
              Vendorspot is Nigeria’s most secure online marketplace for safe,
              stress-free buying and selling. Discover trusted vendors near you,
              shop a wide range of products, and enjoy fast delivery with secure
              payment options. Our platform is designed to protect both buyers
              and sellers from scams, ensuring a reliable shopping experience
              every time.
            </p>
          </div>

          <div className="space-y-4 max-w-[200px]">
            <h3 className="text-lg font-semibold">About Us</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://www.vendorspotng.com/terms"
                  className="text-neutral-400 hover:text-primary-500 transition-colors text-sm"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.vendorspotng.com/privacy-policy"
                  className="text-neutral-400 hover:text-primary-500 transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-neutral-400 hover:text-primary-500 transition-colors text-sm"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4 max-w-[200px]">
            <h3 className="text-lg font-semibold">Customer Care</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-neutral-400 hover:text-primary-500 transition-colors text-sm"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.vendorspotng.com/how-to-buy"
                  className="text-neutral-400 hover:text-primary-500 transition-colors text-sm"
                >
                  How to Buy
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.vendorspotng.com/return-policy"
                  className="text-neutral-400 hover:text-primary-500 transition-colors text-sm"
                >
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4 max-w-[250px]">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <p className="text-neutral-400 text-sm">Lagos, Nigeria</p>
              <p className="text-neutral-400 text-sm">
                Email: support@vendorspot.ng
              </p>
              <p className="text-neutral-400 text-sm">
                Phone: +234 704 588 2161
              </p>
            </div>
            <div className="flex space-x-4 mt-6">
              <a
                href="https://x.com/vendorsspot?s=21"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-primary-500 transition-colors"
                aria-label="X (Twitter)"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/onlinetradefair"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-primary-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@vendorsspot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-primary-500 transition-colors"
                aria-label="TikTok"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/vendorsspot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-primary-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/vendorspot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-primary-500 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
