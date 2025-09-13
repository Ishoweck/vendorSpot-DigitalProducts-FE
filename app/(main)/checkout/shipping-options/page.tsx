"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Truck, Clock, Zap, Check } from "lucide-react";
import { useTempStore } from "@/stores/tempStore";
import { useProducts } from "@/hooks/useAPI";

export default function CheckoutShippingPage() {
  const { cartItems } = useTempStore();
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [cartProducts, setCartProducts] = useState<any[]>([]);

  const { data: productsData } = useProducts({
    page: 1,
    limit: 100,
  });

  const shippingOptions = [
    {
      id: "standard",
      name: "Standard Delivery",
      description: "3-5 business days",
      price: 0,
      icon: Truck,
      estimatedDays: "3-5",
    },
    {
      id: "express",
      name: "Express Delivery",
      description: "1-2 business days",
      price: 2500,
      icon: Clock,
      estimatedDays: "1-2",
    },
    {
      id: "same-day",
      name: "Same Day Delivery",
      description: "Within 6 hours (Lagos only)",
      price: 5000,
      icon: Zap,
      estimatedDays: "Same day",
      restricted: true,
    },
  ];

  useEffect(() => {
    if (productsData?.data?.data && cartItems.length > 0) {
      const products = productsData.data.data;
      const cartProductData = cartItems
        .map((cartItem) => {
          const product = products.find(
            (p: any) => p._id === cartItem.productId
          );
          return product ? { ...product, quantity: cartItem.quantity } : null;
        })
        .filter(Boolean);

      setCartProducts(cartProductData);
    } else {
      setCartProducts([]);
    }
    setSelectedShipping("standard");
    setIsLoading(false);
  }, [cartItems, productsData]);

  const handleShippingSelect = (shippingId: string) => {
    setSelectedShipping(shippingId);
  };

  const handleSaveShipping = () => {
    if (selectedShipping) {
      const selected = shippingOptions.find(
        (opt) => opt.id === selectedShipping
      );
      localStorage.setItem("selectedShipping", JSON.stringify(selected));
      window.location.href = "/checkout";
    }
  };

  const subtotal = cartProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const selectedOption = shippingOptions.find(
    (opt) => opt.id === selectedShipping
  );
  const total = subtotal + (selectedOption?.price || 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/checkout"
            className="flex items-center text-neutral-600 hover:text-neutral-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Checkout
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 font-display mb-2">
            Select Delivery Option
          </h1>
          <p className="text-neutral-600">
            Choose how you&apos;d like your order delivered
          </p>
        </div>

        <div className="grid gap-4 mb-8">
          {shippingOptions.map((option) => {
            const Icon = option.icon;
            const isRestricted = option.restricted && true;

            return (
              <div
                key={option.id}
                className={`bg-white rounded-xl shadow-sm p-6 border-2 cursor-pointer transition-all duration-200 ${
                  selectedShipping === option.id
                    ? "border-primary-500 bg-primary-50"
                    : "border-transparent hover:border-neutral-200"
                } ${isRestricted ? "opacity-60" : ""}`}
                onClick={() => !isRestricted && handleShippingSelect(option.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={selectedShipping === option.id}
                      onChange={() =>
                        !isRestricted && handleShippingSelect(option.id)
                      }
                      disabled={isRestricted}
                      className="mr-4 text-primary-600"
                    />
                    <div className="flex items-center">
                      <div className="p-2 bg-neutral-100 rounded-lg mr-4">
                        <Icon className="w-6 h-6 text-neutral-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900 flex items-center">
                          {option.name}
                          {isRestricted && (
                            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                              Limited Area
                            </span>
                          )}
                        </h3>
                        <p className="text-neutral-600 text-sm">
                          {option.description}
                        </p>
                        {isRestricted && (
                          <p className="text-yellow-600 text-xs mt-1">
                            Available in Lagos only
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="text-right mr-4">
                      <div className="font-semibold text-neutral-900">
                        {option.price === 0
                          ? "Free"
                          : `₦${option.price.toLocaleString()}`}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {option.estimatedDays} days
                      </div>
                    </div>
                    {selectedShipping === option.id && (
                      <Check className="w-6 h-6 text-primary-600" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-neutral-900 mb-4">
            Delivery Information
          </h3>
          <div className="space-y-3 text-sm text-neutral-600">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>
                All delivery times are estimates and may vary based on location
                and product availability.
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>
                Express and Same Day delivery options may not be available for
                all products.
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>
                Delivery fees include insurance and tracking for your peace of
                mind.
              </p>
            </div>
          </div>
        </div>

        {selectedOption && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="font-semibold text-neutral-900 mb-4">
              Order Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">
                  Delivery ({selectedOption.name})
                </span>
                <span>
                  {selectedOption.price === 0
                    ? "Free"
                    : `₦${selectedOption.price.toLocaleString()}`}
                </span>
              </div>
              <div className="border-t border-neutral-200 pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSaveShipping}
            disabled={!selectedShipping}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Delivery Option
          </button>
        </div>
      </div>
    </div>
  );
}
