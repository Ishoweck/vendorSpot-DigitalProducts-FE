"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useTempStore } from "@/stores/tempStore";
import {
  useUserProfile,
  useCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
} from "@/hooks/useAPI";

export default function CartPage() {
  const { data: userProfile } = useUserProfile();
  const user = userProfile?.data?.data;

  const {
    cartItems: guestCartItems,
    updateCartQuantity: updateGuestQty,
    removeCartItem: removeGuestItem,
    clearCart: clearGuestCart,
  } = useTempStore();

  const { data: backendCartData, isLoading } = useCart(!!user);
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();

  const cartItems = useMemo(() => {
    if (user) {
      const items = backendCartData?.data?.data?.items || [];
      return items.map((it: any) => ({
        id: it.productId?._id || it.productId,
        product: it.productId,
        quantity: it.quantity || 1,
      }));
    }
    return guestCartItems.map((it: any) => ({
      id: it.productId,
      product: null,
      quantity: it.quantity,
    }));
  }, [user, backendCartData, guestCartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum: number, it: any) => {
      const price = user ? it.product?.price || 0 : 0;
      if (user) return sum + price * it.quantity;
      return sum;
    }, 0);
  }, [cartItems, user]);

  const handleQuantityChange = async (
    productId: string,
    newQuantity: number
  ) => {
    if (user) {
      if (newQuantity < 1) {
        await removeFromCart.mutateAsync(productId);
      } else {
        await updateCartItem.mutateAsync({ productId, quantity: newQuantity });
      }
    } else {
      if (newQuantity < 1) {
        removeGuestItem(productId);
      } else {
        updateGuestQty(productId, newQuantity);
      }
    }
  };

  const handleRemoveItem = async (productId: string) => {
    if (user) await removeFromCart.mutateAsync(productId);
    else removeGuestItem(productId);
  };

  const handleClearCart = async () => {
    if (user) await clearCart.mutateAsync();
    else clearGuestCart();
  };

  if (user && isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-neutral-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-neutral-600 mb-8">
              Looks like you haven&apos;t added any products to your cart yet.
            </p>
            <Link href="/products" className="btn-primary">
              Browse Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 font-display mb-2">
            Shopping Cart
          </h1>
          <p className="text-neutral-600">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-sm">
              {cartItems.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className={`p-6 ${index !== cartItems.length - 1 ? "border-b border-neutral-200" : ""}`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:space-x-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={
                          user
                            ? item.product?.thumbnail ||
                              "/api/placeholder/200/150"
                            : "/api/placeholder/200/150"
                        }
                        alt={user ? item.product?.name || "Product" : "Product"}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 min-w-0 w-full">
                      <Link
                        href={`/products/${user ? item.product?._id || item.id : item.id}`}
                      >
                        <h3 className="font-semibold text-neutral-900 hover:text-primary-500 transition-colors duration-200 break-words">
                          {user ? item.product?.name || "Product" : item.id}
                        </h3>
                      </Link>
                      <p className="text-sm text-neutral-500 mb-1">
                        {user
                          ? item.product?.vendorId?.businessName ||
                            "Unknown Vendor"
                          : ""}
                      </p>
                      <p className="text-sm text-neutral-400">
                        {user
                          ? item.product?.categoryId?.name || "Digital Product"
                          : "Digital Product"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                      <div className="flex items-center border border-neutral-200 rounded-lg">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="p-2 hover:bg-neutral-50 transition-colors duration-200"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-2 text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-neutral-50 transition-colors duration-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right min-w-0 ml-auto sm:ml-0">
                        <div className="font-semibold text-neutral-900">
                          ₦
                          {(user
                            ? (item.product?.price || 0) * item.quantity
                            : 0
                          ).toLocaleString()}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-neutral-400 hover:text-error-500 transition-colors duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">VAT (7.5%)</span>
                  <span className="font-medium">
                    ₦{(subtotal * 0.075).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-neutral-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-neutral-900">
                      Total
                    </span>
                    <span className="text-lg font-semibold text-neutral-900">
                      ₦{(subtotal * 1.075).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full btn-primary mb-4 block text-center"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 w-5 h-5 inline" />
              </Link>

              <Link
                href="/products"
                className="block w-full btn-outline text-center mb-4"
              >
                Continue Shopping
              </Link>

              <button
                onClick={handleClearCart}
                className="block w-full btn-outline text-center"
              >
                Clear Cart
              </button>

              <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-center text-sm text-neutral-600">
                  <svg
                    className="w-5 h-5 text-success-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Secure checkout with escrow protection
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
