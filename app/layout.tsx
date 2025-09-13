import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import QueryProvider from "@/components/providers/QueryProvider";
import ScrollToTop from "@/components/ui/ScrollToTop";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "Vendorspot - Nigeria's Most Secure Digital Marketplace",
    template: "%s | Vendorspot",
  },
  description:
    "Discover trusted vendors, shop a wide range of digital products, and enjoy instant delivery with secure payment options. Nigeria's leading digital marketplace.",
  keywords: [
    "digital products",
    "marketplace",
    "nigeria",
    "vendors",
    "secure payments",
    "instant delivery",
    "digital downloads",
    "online marketplace",
    "digital assets",
    "e-commerce",
  ],
  authors: [{ name: "Vendorspot Team" }],
  creator: "Vendorspot",
  publisher: "Vendorspot",
  category: "E-commerce",
  classification: "Digital Marketplace",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://vendorspot.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Vendorspot - Nigeria's Most Secure Digital Marketplace",
    description:
      "Discover trusted vendors, shop a wide range of digital products, and enjoy instant delivery with secure payment options.",
    url: "https://vendorspot.com",
    siteName: "Vendorspot",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vendorspot Digital Marketplace - Buy and Sell Digital Products",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vendorspot - Nigeria's Most Secure Digital Marketplace",
    description:
      "Discover trusted vendors, shop a wide range of digital products, and enjoy instant delivery with secure payment options.",
    images: ["/og-image.png"],
    creator: "@vendorspot",
    site: "@vendorspot",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-sans antialiased">
        <QueryProvider>
          {children}
          <ScrollToTop />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#10B981",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: "#EF4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
