"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  X,
  Users,
  Menu,
  UserRoundCheck,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  Package,
  Wallet,
} from "lucide-react";
import { useUserProfile, useLogout, useCategories } from "@/hooks/useAPI";
import MobileSidebar from "./MobileSidebar";
import { performGlobalSearch, SearchResult } from "@/lib/utils/searchUtils";
import { useTempStore } from "@/stores/tempStore";

export default function Header() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] =
    useState(false);
  const [advertState, setAdvertState] = useState<
    "expanded" | "compact" | "hidden"
  >("expanded");
  const [showBanner, setShowBanner] = useState(true);

  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const { data: userProfile } = useUserProfile();
  const { data: categoriesData } = useCategories();
  const logoutMutation = useLogout();
  const user = userProfile?.data?.data;
  const categories = categoriesData?.data?.data || [];

  const { cartItems } = useTempStore();
  const tempCartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const { useCart } = require("@/hooks/useAPI");
  const { data: backendCartData } = useCart(!!user && user.role !== "VENDOR");
  const backendCartCount =
    backendCartData?.data?.data?.items?.reduce(
      (t: number, it: any) => t + (it.quantity || 1),
      0
    ) || 0;

  const cartItemCount = user ? backendCartCount : tempCartCount;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY === 0) {
        setAdvertState("expanded");
      } else if (scrollY > 0 && scrollY <= 100) {
        setAdvertState("compact");
      } else if (scrollY > 100) {
        setAdvertState("hidden");
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".user-dropdown")) {
        setIsUserDropdownOpen(false);
      }
      if (!target.closest(".categories-dropdown")) {
        setIsCategoriesDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setShowSearchDropdown(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const hideOn = [
      /^\/dashboard\//,
      /^\/cart(\/|$)/,
      /^\/checkout(\/|$)/,
      /^\/products\/[^\/]+$/,
    ];
    setShowBanner(!hideOn.some((re) => re.test(pathname)));
  }, [pathname]);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchValue.trim()) {
        setIsSearching(true);
        try {
          const results = await performGlobalSearch(searchValue);
          setSearchResults(results);
          setShowSearchDropdown(true);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowSearchDropdown(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchValue]);

  const clearSearch = () => {
    setSearchValue("");
    setSearchResults([]);
    setShowSearchDropdown(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchValue.trim())}`);
      setShowSearchDropdown(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    setSearchValue("");
    setShowSearchDropdown(false);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case "product":
        return <Package className="w-4 h-4" />;
      case "category":
        return <Menu className="w-4 h-4" />;
      case "vendor":
        return <Users className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  return (
    <header className="sticky top-0 z-[60]">
      {showBanner && (
  <div
    className={`overflow-hidden transition-all duration-300 ease-out ${
      advertState === "expanded"
        ? "h-[60px]"
        : advertState === "compact"
          ? "h-[40px]"
          : "h-0"
    }`}
  >
    <Link href="/promotions/special-offer">
      <Image
        src="/headerImg.gif" 
        alt="Advert Banner"
        fill={false} 
        width={1440}
        height={60}
        className="w-full object-cover"
        unoptimized
        priority
      />
    </Link>
  </div>
)}


      <div className="bg-main-bg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-3"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <Menu className="w-6 h-6 text-black" />
              </button>

              <div className="relative hidden lg:block mr-4 categories-dropdown">
                <button
                  onClick={() =>
                    setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)
                  }
                  className="items-center text-black hover:text-primary-500 transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {isCategoriesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {categories.map((category: any) => (
                      <Link
                        key={category._id}
                        href={`/products?category=${category.slug}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsCategoriesDropdownOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/images/vendorspot-logo.svg"
                  alt="Vendorspot"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative hidden lg:block user-dropdown">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 text-black hover:text-primary-500 transition-colors group"
                  >
                    <UserRoundCheck className="w-5 h-5 group-hover:text-primary-500 transition-colors" />
                    <span className="font-medium">Hi, {user.firstName}</span>
                    {isUserDropdownOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link
                        href={
                          user.role === "VENDOR"
                            ? "/dashboard/vendor"
                            : "/dashboard/user"
                        }
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <Users className="w-4 h-4" />
                        <span>My Account</span>
                      </Link>

                      {user.role === "VENDOR" ? (
                        <>
                          <Link
                            href="/dashboard/vendor/products"
                            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <Package className="w-4 h-4" />
                            <span>Products</span>
                          </Link>
                          <Link
                            href="/dashboard/vendor/wallet"
                            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <Wallet className="w-4 h-4" />
                            <span>Wallet</span>
                          </Link>
                          <Link
                            href="/dashboard/vendor/profile"
                            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            <span>Profile</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/dashboard/user/orders"
                            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span>Orders</span>
                          </Link>
                          <Link
                            href="/dashboard/user/saved-items"
                            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <Heart className="w-4 h-4" />
                            <span>Saved Items</span>
                          </Link>
                          <Link
                            href="/dashboard/user/settings"
                            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </Link>
                        </>
                      )}
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          logoutMutation.mutate();
                        }}
                        className="flex items-center space-x-3 px-4 py-2 text-[#D7195B] hover:bg-gray-100 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden lg:flex items-center space-x-2 text-black hover:text-primary-500 transition-colors group"
                >
                  <Users className="w-5 h-5 group-hover:text-primary-500 transition-colors" />
                  <span className="font-medium">Login/Signup</span>
                </Link>
              )}

              <Link
                href="/cart"
                className="flex items-center space-x-2 text-black hover:text-primary-500 transition-colors"
              >
                <div className="relative">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-medium">Cart</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-nav-bg text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center py-3">
            <div
              className="flex-1 max-w-2xl flex items-center space-x-2"
              ref={searchRef}
            >
              <form onSubmit={handleSearchSubmit} className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search for products, brand, categories and vendors"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}

                {showSearchDropdown &&
                  (searchResults.length > 0 || isSearching) && (
                    <div
                      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50"
                      style={{
                        scrollbarWidth: "thin",
                        scrollBehavior: "smooth",
                        scrollbarColor: "#D7195B transparent",
                      }}
                    >
                      {isSearching ? (
                        <div className="p-4 text-center text-gray-500">
                          Searching...
                        </div>
                      ) : (
                        <>
                          {searchResults.map((result, index) => (
                            <button
                              key={`${result.type}-${result.id}-${index}`}
                              onClick={() => handleResultClick(result)}
                              className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                            >
                              <div className="text-gray-400">
                                {getResultIcon(result.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 text-sm">
                                  {result.name}
                                </div>
                                {result.description && (
                                  <div className="text-xs text-gray-500 truncate">
                                    {result.description}
                                  </div>
                                )}
                              </div>
                            </button>
                          ))}
                          <div className="p-2 border-t border-gray-100">
                            <button
                              type="submit"
                              className="w-full text-center text-sm text-[#D7195B] hover:text-[#b8154d] font-medium"
                            >
                              View all results for "{searchValue}"
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
              </form>
              <button
                type="submit"
                onClick={handleSearchSubmit}
                className="bg-search-btn text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
    </header>
  );
}
