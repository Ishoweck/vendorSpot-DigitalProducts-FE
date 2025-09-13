"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit2, ArrowRight, MapPin, CreditCard } from "lucide-react";
import {
  useUserProfile,
  useCart,
  useAddresses,
  useCreateOrder,
  useInitializePayment,
} from "@/hooks/useAPI";

export default function CheckoutPage() {
  const { data: userProfile } = useUserProfile();
  const user = userProfile?.data?.data;
  const { data: backendCartData, isLoading } = useCart(!!user);
  const { data: addressesData } = useAddresses();
  const createOrder = useCreateOrder();
  const initializePayment = useInitializePayment();

  const cartProducts = useMemo(() => {
    if (user) {
      const items = backendCartData?.data?.data?.items || [];
      return items.map((it: any) => ({
        _id: it.productId?._id || it.productId,
        name: it.productId?.name,
        price: it.productId?.price,
        quantity: it.quantity,
        thumbnail: it.productId?.thumbnail,
        vendorId: it.productId?.vendorId,
        categoryId: it.productId?.categoryId,
      }));
    }
    return [];
  }, [user, backendCartData]);

  const [selectedAddress, setSelectedAddress] = useState<{
    fullName?: string;
    street: string;
    city: string;
    state: string;
    country: string;
    phone: string;
  } | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<{
    id: string;
    name: string;
    description: string;
    price: number;
    estimatedDays: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user?.shippingAddresses && user.shippingAddresses.length > 0) {
      const defaultAddress =
        user.shippingAddresses.find((addr: any) => addr.isDefault) ||
        user.shippingAddresses[0];
      setSelectedAddress(defaultAddress);
    } else if (addressesData?.data && addressesData.data.length > 0) {
      const defaultAddress =
        addressesData.data.find((addr: any) => addr.isDefault) ||
        addressesData.data[0];
      setSelectedAddress(defaultAddress);
    }
    const saved = localStorage.getItem("selectedShipping");
    if (saved) setSelectedShipping(JSON.parse(saved));
  }, [user, addressesData]);

  const subtotal = useMemo(() => {
    return cartProducts.reduce(
      (sum: number, item: (typeof cartProducts)[0]) =>
        sum + (item.price || 0) * (item.quantity || 1),
      0
    );
  }, [cartProducts]);
  const tax = subtotal * 0.075;
  const shippingFee = selectedShipping?.price || 0;
  const total = subtotal + tax + shippingFee;

  const handlePayment = async () => {
    if (!selectedAddress || !user) return;

    setIsProcessing(true);

    try {
      const orderData = {
        items: cartProducts.map((item: any) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: selectedAddress,
        shippingMethod: "STANDARD",
        paymentMethod: "PAYSTACK",
      };

      const orderResponse = await createOrder.mutateAsync(orderData);
      const orderId = orderResponse.data.data._id;

      const idempotencyKey = `order_${orderId}_${Date.now()}`;

      await initializePayment.mutateAsync({
        orderId,
        idempotencyKey,
      });
    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-40" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4 lg:col-span-2">
                <div className="h-32 bg-gray-200 rounded" />
                <div className="h-32 bg-gray-200 rounded" />
                <div className="h-32 bg-gray-200 rounded" />
              </div>
              <div className="h-72 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartProducts.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              No items to checkout
            </h2>
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
            Checkout
          </h1>
          <p className="text-neutral-600">
            Review your order and complete your purchase
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-neutral-400 mr-2" />
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Delivery Address
                  </h2>
                </div>
                <Link
                  href="/checkout/addresses"
                  className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Change
                </Link>
              </div>

              {selectedAddress ? (
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <p className="font-medium text-neutral-900">
                    {selectedAddress.fullName ||
                      user?.firstName + " " + user?.lastName}
                  </p>
                  <p className="text-neutral-600">
                    {selectedAddress.street}, {selectedAddress.city}
                  </p>
                  <p className="text-neutral-600">
                    {selectedAddress.state}, {selectedAddress.country}
                  </p>
                  <p className="text-neutral-600">{selectedAddress.phone}</p>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">
                    Please add a delivery address to continue
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="w-5 h-5 text-neutral-400 mr-2" />
                <h2 className="text-lg font-semibold text-neutral-900">
                  Payment Method
                </h2>
              </div>

              <div className="p-4 bg-neutral-50 rounded-lg border-2 border-primary-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-8 bg-primary-600 rounded flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">PAY</span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">
                        Pay with Paystack
                      </p>
                      <p className="text-sm text-neutral-600">
                        You will be redirected to our secure checkout page.
                      </p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-primary-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cartProducts.map((item: (typeof cartProducts)[0]) => (
                  <div key={item._id} className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={item.thumbnail || "/api/placeholder/200/150"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-neutral-900">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pt-4 border-t border-neutral-200">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="font-medium">
                    {shippingFee === 0
                      ? "Free"
                      : `₦${shippingFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">VAT (7.5%)</span>
                  <span className="font-medium">₦{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-neutral-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-neutral-900">
                      Total
                    </span>
                    <span className="text-lg font-semibold text-neutral-900">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={!selectedAddress || isProcessing}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    Place Order
                    <ArrowRight className="ml-2 w-5 h-5 inline" />
                  </>
                )}
              </button>

              <div className="p-4 bg-neutral-50 rounded-lg">
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
