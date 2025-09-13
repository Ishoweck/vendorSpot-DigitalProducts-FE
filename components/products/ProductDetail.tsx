"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Star,
  Facebook,
  Twitter,
  Instagram,
  ChevronDown,
  ChevronUp,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  User,
  FileText,
  BarChart3,
  Grid3X3,
} from "lucide-react";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import {
  useProduct,
  useProducts,
  useUserProfile,
  useSyncTempStore,
  useAllWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
  useCart,
  useAddToCart,
  useUpdateCartItem,
} from "@/hooks/useAPI";
import { useTempStore } from "@/stores/tempStore";
import { ProductThumbnail } from "./ProductThumbnail";
import ReviewsSection from "./ReviewsSection";
import { Notification } from "@/components/ui/Notification";
import { Skeleton } from "@/components/ui/skeleton";
import { smoothScrollToSection } from "@/lib/utils";
import { getCartItems, normalizeCartItem } from "@/lib/utils/cartUtils";

export default function ProductDetail() {
  const params = useParams();
  const productId = params.id as string;
  const router = useRouter();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [productDetailsExpanded, setProductDetailsExpanded] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({ message: "", type: "success", isVisible: false });

  const { data: productData, isLoading: productLoading } =
    useProduct(productId);
  const { data: userProfile } = useUserProfile();
  const user = userProfile?.data?.data;
  const isVendor = user?.role === "VENDOR";

  const {
    savedItems,
    cartItems,
    addSavedItem,
    removeSavedItem,
    addCartItem,
    updateCartQuantity,
  } = useTempStore();

  const { handleGuestAction, handleVendorAction } = useSyncTempStore();

  const { data: wishlistData } = useAllWishlist(!!user && !isVendor);
  const { data: backendCartData } = useCart(!!user && !isVendor);
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const addToCartMutation = useAddToCart();
  const updateCartMutation = useUpdateCartItem();

  const backendWishlist = wishlistData?.data?.data || [];

  const backendCartItems = getCartItems(backendCartData);

  const isSaved =
    user && !isVendor
      ? Array.isArray(backendWishlist)
        ? backendWishlist.some((item: any) => item._id === productId)
        : backendWishlist.items?.some(
            (item: any) => item.productId === productId
          )
      : savedItems.includes(productId);

  const cartItem =
    user && !isVendor
      ? backendCartItems.find(
          (item: any) =>
            item.productId === productId ||
            item.productId?._id === productId ||
            item._id === productId
        )
      : cartItems.find((item) => item.productId === productId);

  const normalizedCartItem = normalizeCartItem(cartItem);

  const { data: relatedProductsData } = useProducts({
    category: productData?.data?.data?.categoryId?._id,
    limit: 4,
  });

  const product = productData?.data?.data;
  const relatedProducts =
    relatedProductsData?.data?.data?.filter((p) => p._id !== productId) || [];

  const shouldShowRelatedProducts = relatedProducts.length > 0;

  const showNotification = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setNotification({ message, type, isVisible: true });
  };

  const handleVendorClick = () => {
    if (product?.vendorId?.businessName) {
      router.push(
        `/products?vendor=${encodeURIComponent(product.vendorId.businessName)}`
      );
    }
  };

  const handleSavedItemToggle = () => {
    if (!user) {
      addSavedItem(productId);
      handleGuestAction("save");
      return;
    }

    if (isVendor) {
      handleVendorAction("save");
      return;
    }

    if (isSaved) {
      removeFromWishlistMutation.mutate(productId, {
        onSuccess: () => showNotification("Item removed from saved items"),
        onError: (error: any) => {
          console.error("Remove wishlist error:", error);
          showNotification("Failed to remove item", "error");
        },
      });
    } else {
      addToWishlistMutation.mutate(productId, {
        onSuccess: () => showNotification("Item added to saved items"),
        onError: (error: any) => {
          console.error("Add wishlist error:", error);
          showNotification("Failed to add item", "error");
        },
      });
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      addCartItem(productId);
      handleGuestAction("cart");
      return;
    }

    if (isVendor) {
      handleVendorAction("cart");
      return;
    }

    addToCartMutation.mutate(
      { productId, quantity: 1 },
      {
        onSuccess: () => showNotification("Item added to cart"),
        onError: (error: any) => {
          console.error("Add to cart error:", error);
          showNotification("Failed to add to cart", "error");
        },
      }
    );
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (!user) {
      if (newQuantity === 0) {
        updateCartQuantity(productId, 0);
        showNotification("Item was removed from cart successfully");
      } else {
        updateCartQuantity(productId, newQuantity);
        showNotification("Item quantity has been updated");
      }
    } else {
      updateCartMutation.mutate(
        { productId, quantity: newQuantity },
        {
          onSuccess: () =>
            showNotification(
              newQuantity === 0
                ? "Item removed from cart"
                : "Item quantity updated"
            ),
          onError: () => showNotification("Failed to update cart", "error"),
        }
      );
    }
  };

  const navigationLinks = [
    {
      icon: FileText,
      label: "Product Details",
      targetId: "product-details",
    },
    {
      icon: BarChart3,
      label: "Product Statistics",
      targetId: "product-statistics",
    },
    ...(shouldShowRelatedProducts
      ? [
          {
            icon: Grid3X3,
            label: "Related Products",
            targetId: "related-products",
          },
        ]
      : []),
  ];

  if (productLoading) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <Skeleton className="w-full h-96 rounded-lg" />
          </div>
          <div className="flex-1">
            <Skeleton className="w-3/4 h-8 mb-4" />
            <Skeleton className="w-1/2 h-6 mb-4" />
            <Skeleton className="w-full h-24 mb-4" />
            <Skeleton className="w-1/3 h-12 mb-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Product not found
        </h2>
        <p className="text-gray-600">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
      </div>
    );
  }

  const allImages = [
    product.thumbnail,
    product.previewUrl,
    ...(product.images || []),
  ].filter(Boolean);

  return (
    <>
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() =>
          setNotification((prev) => ({ ...prev, isVisible: false }))
        }
      />

      <section className="bg-white rounded-lg shadow-sm">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:bg-white lg:rounded-lg lg:border lg:border-gray-200 lg:p-6">
            <div className="flex-1 max-w-fit">
              <div className="relative mb-4">
                <Image
                  src={
                    allImages[currentImageIndex] || "/api/placeholder/500/400"
                  }
                  alt={product.name}
                  width={305}
                  height={305}
                  className="w-full max-w-[305px] h-[305px] object-cover rounded-lg mx-auto lg:mx-0"
                  priority
                />
              </div>
              {allImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex
                          ? "border-[#D7195B]"
                          : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={image || "/api/placeholder/80/80"}
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 lg:max-w-[38rem]">
              <div className="flex items-start justify-between">
                <h1 className="text-xl font-semibold text-gray-900 leading-tight mt-auto mb-auto">
                  {product.name}
                </h1>
                {!isVendor && (
                  <button
                    onClick={handleSavedItemToggle}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Heart
                      className={`w-6 h-6 ${isSaved ? "text-red-500 fill-current" : "text-gray-400"}`}
                    />
                  </button>
                )}
              </div>

              <div className="lg:hidden">
                <div className="flex gap-1 pb-1 border-b border-gray-200 mb-4">
                  <p className="text-sm text-gray-600">Vendor:</p>
                  <button
                    onClick={handleVendorClick}
                    className="text-[#D7195B] hover:underline font-medium text-sm"
                  >
                    {product.vendorId?.businessName || "Unknown Vendor"}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold text-[#D7195B]">
                    ₦{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <span className="text-base text-gray-500 line-through">
                        ₦{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  {product.discountPercentage &&
                    product.discountPercentage > 0 && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        -{product.discountPercentage}%
                      </span>
                    )}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 0)
                          ? "text-[#FC5991] fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 text-xs">
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>

              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mb-4">
                {normalizedCartItem && normalizedCartItem.quantity > 0 ? (
                  <div className="flex items-center justify-center gap-3 bg-[#D7195B] text-white py-2.5 px-4 rounded-lg">
                    <button
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                      onClick={() =>
                        handleQuantityChange(normalizedCartItem.quantity - 1)
                      }
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="min-w-[28px] text-center font-medium">
                      {normalizedCartItem.quantity}
                    </span>
                    <button
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                      onClick={() =>
                        handleQuantityChange(normalizedCartItem.quantity + 1)
                      }
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isLoading}
                    className="w-full bg-[#D7195B] text-white py-2.5 px-4 rounded-lg hover:bg-[#b8154d] transition-colors font-medium flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addToCartMutation.isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Adding to Cart...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </>
                    )}
                  </button>
                )}
              </div>

              <hr className="mb-4" />

              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="px-3 py-2 rounded-lg bg-[#FFF3F7] text-sm">
                  <span className="text-gray-600">Need Help? </span>
                  <span className="text-[#D7195B] font-semibold">
                    Call 07045882161
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">
                    SHARE THIS PRODUCT
                  </span>
                  <Facebook className="w-4 h-4 text-[#FC5991]" />
                  <Twitter className="w-4 h-4 text-[#FC5991]" />
                  <Instagram className="w-4 h-4 text-[#FC5991]" />
                  <IconBrandWhatsapp className="w-4 h-4 text-[#FC5991]" />
                </div>
              </div>
            </div>

            <div className="hidden lg:block w-56">
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                <div className="border-b border-gray-200 pb-3 mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    VENDOR INFORMATION
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#D7195B] rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <button
                      onClick={handleVendorClick}
                      className="text-[#D7195B] hover:underline font-medium text-sm"
                    >
                      {product.vendorId?.businessName || "Unknown Vendor"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="space-y-1">
                  {navigationLinks.map((link, index) => (
                    <div key={link.targetId}>
                      <button
                        onClick={() => smoothScrollToSection(link.targetId)}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <link.icon className="w-5 h-5 text-[#D7195B]" />
                        <span className="text-sm font-medium text-gray-900">
                          {link.label}
                        </span>
                      </button>
                      {index < navigationLinks.length - 1 && (
                        <div className="border-b border-gray-100 mx-3" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="border-t border-gray-200 p-6 lg:p-8"
          id="product-details"
        >
          <button
            onClick={() => setProductDetailsExpanded(!productDetailsExpanded)}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <h2 className="text-2xl font-semibold text-gray-900">
              Product Details
            </h2>
            {productDetailsExpanded ? (
              <ChevronUp className="w-6 h-6 text-gray-500" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-500" />
            )}
          </button>

          {productDetailsExpanded && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                <span className="font-medium text-gray-900">Key Features</span>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  {product.features?.map((feature: string, index: number) => (
                    <li key={index} className="text-gray-700">
                      {feature}
                    </li>
                  )) || <li className="text-gray-500">No features listed</li>}
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                <span className="font-medium text-gray-900">Requirements</span>
                <div className="text-sm text-gray-700">
                  {product.requirements || "Not specified"}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                <span className="font-medium text-gray-900">License</span>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium">
                      {product.licenseType?.replace(/_/g, " ") ||
                        "Not specified"}
                    </span>
                  </div>
                  {product.licenseDuration && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">
                        {product.licenseDuration} days
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {product.instructions && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 lg:col-span-3">
                  <span className="font-medium text-gray-900">
                    Instructions
                  </span>
                  <div className="text-sm text-gray-700">
                    {product.instructions}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className="border-t border-gray-200 p-6 lg:p-8 bg-gray-50"
          id="product-statistics"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Product Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#D7195B]">
                {product.soldCount || 0}
              </div>
              <div className="text-sm text-gray-600">Sold</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#D7195B]">
                {product.viewCount || 0}
              </div>
              <div className="text-sm text-gray-600">Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#D7195B]">
                {product.reviewCount || 0}
              </div>
              <div className="text-sm text-gray-600">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#D7195B]">
                {product.rating?.toFixed(1) || "0.0"}
              </div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
          </div>

          <div className="mt-8">
            <ReviewsSection productId={productId} />
          </div>
        </div>

        {shouldShowRelatedProducts && (
          <div
            className="border-t border-gray-200 p-6 lg:p-8"
            id="related-products"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductThumbnail
                  key={relatedProduct._id}
                  product={relatedProduct}
                  className="h-80"
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
