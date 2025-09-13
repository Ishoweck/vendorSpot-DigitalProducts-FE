"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { SidebarProps } from "@/types/product";
import { StarRating } from "./StarRating";

export function ProductSidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  selectedVendor,
  setSelectedVendor,
  priceRange,
  setPriceRange,
  onPriceRangeChange,
  minRating,
  setMinRating,
  showFilters,
  setShowFilters,
  onApplyPriceFilter,
  onResetRating,
  products,
  isPriceRangeChanged,
  setIsPriceRangeChanged,
}: SidebarProps) {
  const [vendorSearch, setVendorSearch] = useState("");
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);

  const allCategories = [
    "All Categories",
    ...categories.map((cat: any) => cat.name),
  ];

  const vendors = Array.from(
    new Set(
      products
        .map((p: any) => p.vendorId?.businessName)
        .filter((name: string) => name)
    )
  );

  const filteredVendors = vendors.filter((vendor) =>
    vendor.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  const handlePriceRangeChange = (index: number, value: number) => {
    if (onPriceRangeChange) {
      onPriceRangeChange(index, value);
    } else {
      const newRange = [...priceRange] as [number, number];
      newRange[index] = value;
      setPriceRange(newRange);
    }
  };

  return (
    <>
      {showFilters && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[45] lg:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-full lg:h-auto w-80 bg-white shadow-lg lg:shadow-sm lg:rounded-lg p-4 lg:p-6 space-y-4 lg:space-y-5 lg:z-0 z-[70] transform transition-transform duration-300 overflow-y-auto ${
          showFilters ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between lg:hidden border-b border-gray-200 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            onClick={() => setShowFilters(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="border-b border-gray-200 pb-4">
          <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
          <div className="space-y-1">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                  selectedCategory === category
                    ? "text-[#D7195B] bg-pink-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="border-b border-gray-200 pb-4">
          <h3 className="font-medium text-gray-900 mb-3">Search</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D7195B] focus:border-[#D7195B] text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="border-b border-gray-200 pb-4">
          <h3 className="font-medium text-gray-900 mb-3">Vendor</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search vendors..."
              value={vendorSearch}
              onChange={(e) => setVendorSearch(e.target.value)}
              onFocus={() => setShowVendorDropdown(true)}
              onBlur={() => setTimeout(() => setShowVendorDropdown(false), 200)}
              className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D7195B] focus:border-[#D7195B] text-sm"
            />
            {(vendorSearch || selectedVendor) && (
              <button
                onClick={() => {
                  setVendorSearch("");
                  setSelectedVendor("");
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {showVendorDropdown && vendorSearch && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                {filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor) => (
                    <button
                      key={vendor}
                      onClick={() => {
                        setSelectedVendor(vendor);
                        setVendorSearch(vendor);
                        setShowVendorDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                    >
                      {vendor}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No vendors found
                  </div>
                )}
              </div>
            )}
          </div>
          {selectedVendor && (
            <div className="mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-[#D7195B] rounded text-xs">
                {selectedVendor}
                <button
                  onClick={() => {
                    setSelectedVendor("");
                    setVendorSearch("");
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}
        </div>

        <div className="border-b border-gray-200 pb-4">
          <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0] || ""}
                onChange={(e) =>
                  handlePriceRangeChange(0, Number(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D7195B] focus:border-[#D7195B] text-sm"
              />
              <span className="text-gray-500 text-sm">to</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1] || ""}
                onChange={(e) =>
                  handlePriceRangeChange(1, Number(e.target.value) || 100000)
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D7195B] focus:border-[#D7195B] text-sm"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setPriceRange([0, 100000]);
                  {setIsPriceRangeChanged && setIsPriceRangeChanged(false);}
                }}
                className="px-4 py-1 text-gray-600 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={onApplyPriceFilter}
                disabled={!isPriceRangeChanged}
                className="px-4 py-1 bg-[#D7195B] text-white rounded text-sm hover:bg-[#b8154d] disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Product Rating</h3>
            <button
              onClick={onResetRating}
              className="text-xs text-[#D7195B] hover:text-[#b8154d]"
            >
              Reset
            </button>
          </div>
          <div className="space-y-2">
            {[4, 3, 2, 1, 0].map((rating) => (
              <label
                key={rating}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === rating}
                  onChange={() => setMinRating(rating)}
                  className="text-[#D7195B] focus:ring-[#D7195B]"
                />
                <div className="flex items-center gap-1">
                  <StarRating rating={rating} />
                  <span className="text-sm text-gray-600">& up</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
