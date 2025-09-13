export interface Product {
  _id: string;
  vendorId: string | { _id: string; businessName: string };
  categoryId: string | { _id: string; name: string };
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  isDigital: boolean;
  fileUrl?: string;
  fileSize?: number;
  fileType?: string;
  previewUrl?: string;
  thumbnail?: string;
  images: string[];
  tags: string[];
  features: string[];
  requirements?: string;
  instructions?: string;
  licenseType?: "SINGLE_USE" | "MULTIPLE_USE" | "UNLIMITED" | "TIME_LIMITED" | "SUBSCRIPTION";
  licenseDuration?: number;
  downloadLimit?: number;
  isActive: boolean;
  isFeatured: boolean;
  isApproved: boolean;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
  viewCount: number;
  downloadCount: number;
  soldCount: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface SidebarProps {
  categories: any[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedVendor: string;
  setSelectedVendor: (vendor: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  onPriceRangeChange?: (index: number, value: number) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  onApplyPriceFilter: () => void;
  onResetRating: () => void;
  products: any[];
  isPriceRangeChanged?: boolean;
  setIsPriceRangeChanged?: (changed: boolean) => void;
}

export interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
}

export interface SortDropdownProps {
  sortBy: string;
  setSortBy: (sort: string) => void;
}
