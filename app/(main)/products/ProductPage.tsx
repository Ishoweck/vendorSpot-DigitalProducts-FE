"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Grid3X3, List } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductSidebar } from "@/components/products/ProductSidebar";
import { ProductCard } from "@/components/products/ProductCard";
import { SortDropdown } from "@/components/products/SortDropdown";
import Pagination from "@/components/ui/Pagination";
import { useProducts, useCategories } from "@/hooks/useAPI";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [appliedPriceRange, setAppliedPriceRange] = useState<[number, number]>([
    0, 100000,
  ]);
  const [isPriceRangeChanged, setIsPriceRangeChanged] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const productsPerPage = 20;

  const { data: categoriesData } = useCategories();
  const { data: productsData, isLoading } = useProducts({
    page: currentPage,
    limit: productsPerPage,
    category: selectedCategoryId,
    search: searchQuery,
    minPrice: appliedPriceRange[0] > 0 ? appliedPriceRange[0] : undefined,
    maxPrice: appliedPriceRange[1] < 100000 ? appliedPriceRange[1] : undefined,
    minRating: minRating > 0 ? minRating : undefined,
    vendor: selectedVendor || undefined,
    sortBy:
      sortBy === "newest"
        ? "createdAt"
        : sortBy === "oldest"
          ? "createdAt"
          : sortBy === "popular"
            ? "soldCount"
            : sortBy.includes("price")
              ? "price"
              : "rating",
    sortOrder:
      sortBy === "newest"
        ? "desc"
        : sortBy === "oldest"
          ? "asc"
          : sortBy === "price-high" ||
              sortBy === "rating" ||
              sortBy === "popular"
            ? "desc"
            : "asc",
  });

  const categories = categoriesData?.data?.data || [];
  const products = productsData?.data?.data || [];
  const totalProducts = productsData?.data?.pagination?.total || 0;
  const totalPages = productsData?.data?.pagination?.totalPages || 1;

  useEffect(() => {
    if (categories.length > 0) {
      const categoryParam = searchParams.get("category");
      if (categoryParam) {
        const matchingCategory = categories.find(
          (cat: any) => cat.slug === categoryParam
        );
        if (matchingCategory) {
          setSelectedCategory(matchingCategory.name);
          setSelectedCategoryId(matchingCategory._id);
        }
      }
    }
  }, [categories, searchParams]);

  useEffect(() => {
    const vendorParam = searchParams.get("vendor");
    if (vendorParam) {
      setSelectedVendor(vendorParam);
    }
  }, [searchParams]);

  const updateURL = (categorySlug?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug) {
      params.set("category", categorySlug);
    } else {
      params.delete("category");
    }
    router.push(`/products?${params.toString()}`);
  };

  const handlePriceRangeChange = (index: number, value: number) => {
    const newRange = [...priceRange] as [number, number];
    newRange[index] = value;
    setPriceRange(newRange);

    const defaultRange: [number, number] = [0, 100000];
    const hasChanged =
      newRange[0] !== defaultRange[0] || newRange[1] !== defaultRange[1];
    setIsPriceRangeChanged(hasChanged);
  };

  const handleApplyPriceFilter = () => {
    setAppliedPriceRange(priceRange);
    setCurrentPage(1);
    setIsPriceRangeChanged(false);
  };

  const handleResetRating = () => {
    setMinRating(0);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "All Categories") {
      setSelectedCategoryId("");
      updateURL();
    } else {
      const matchingCategory = categories.find(
        (cat: any) => cat.name === category
      );
      if (matchingCategory) {
        setSelectedCategoryId(matchingCategory._id);
        updateURL(matchingCategory.slug);
      }
    }
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleVendorSearch = (query: string) => {
    setSelectedVendor(query);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const categoryName =
    selectedCategory === "All Categories" ? "Products" : selectedCategory;

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-6">
          <ProductSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            selectedVendor={selectedVendor}
            setSelectedVendor={handleVendorSearch}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            onPriceRangeChange={handlePriceRangeChange}
            minRating={minRating}
            setMinRating={setMinRating}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            onApplyPriceFilter={handleApplyPriceFilter}
            onResetRating={handleResetRating}
            products={products}
            isPriceRangeChanged={isPriceRangeChanged}
            setIsPriceRangeChanged={setIsPriceRangeChanged}
          />

          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      <Filter className="w-4 h-4" />
                      Filters
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900">
                      <span className="font-bold">{categoryName}</span> (
                      {totalProducts} products found)
                    </h1>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === "grid"
                            ? "bg-[#D7195B] text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === "list"
                            ? "bg-[#D7195B] text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>

                    <SortDropdown
                      sortBy={sortBy}
                      setSortBy={handleSortChange}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Loading products...
                    </h3>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                ) : (
                  <>
                    {viewMode === "grid" ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {products.map((product) => (
                          <ProductCard
                            key={product._id}
                            product={product}
                            viewMode={viewMode}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {products.map((product) => (
                          <ProductCard
                            key={product._id}
                            product={product}
                            viewMode={viewMode}
                          />
                        ))}
                      </div>
                    )}

                    {totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        className="mt-8"
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
