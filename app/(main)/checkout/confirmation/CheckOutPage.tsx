"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Package,
  MapPin,
  Truck,
  Calendar,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { useVerifyPayment, useOrderByPaymentReference } from "@/hooks/useAPI";
import AuthWrapper from "@/components/auth/AuthWrapper";

export default function CheckoutConfirmationPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const trxref = searchParams.get("trxref");
  const status = searchParams.get("status");

  const [paymentStatus, setPaymentStatus] = useState<string>("pending");
  const [orderData, setOrderData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const verifyPayment = useVerifyPayment();
  const { data: orderResponse } = useOrderByPaymentReference(reference || "");

  useEffect(() => {
    if (reference && trxref && status) {
      if (status === "success") {
        setPaymentStatus("success");
        verifyPayment.mutate(reference);
      } else {
        setPaymentStatus("failed");
        setErrorMessage("Payment was not successful. Please try again.");
      }
    }
  }, [reference, trxref, status, verifyPayment]);

  useEffect(() => {
    if (orderResponse?.data?.data) {
      setOrderData(orderResponse.data.data);
    }
  }, [orderResponse]);

  const handleRetryPayment = () => {
    window.location.href = "/checkout";
  };

  if (paymentStatus === "pending") {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 font-display mb-2">
              Processing Payment...
            </h1>
            <p className="text-neutral-600">
              Please wait while we verify your payment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === "failed") {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 font-display mb-2">
              Payment Failed
            </h1>
            <p className="text-neutral-600 mb-4">
              {errorMessage ||
                "Your payment was not successful. Please try again."}
            </p>
            <button
              onClick={handleRetryPayment}
              className="inline-flex items-center px-6 py-3 bg-[#D7195B] text-white rounded-lg hover:bg-[#B01548] transition-colors"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === "success" && !orderData) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 font-display mb-2">
              Payment Successful!
            </h1>
            <p className="text-neutral-600">Loading your order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-900 font-display mb-2">
              Order Not Found
            </h1>
            <p className="text-neutral-600 mb-4">
              Unable to load your order details.
            </p>
            <Link href="/dashboard/user/orders" className="btn-primary">
              View Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = orderData.subtotal || 0;
  const tax = orderData.tax || 0;
  const shippingFee = orderData.shippingFee || 0;
  const total = orderData.total || 0;

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <AuthWrapper requireAuth={true}>
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-success-600" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 font-display mb-2">
              Order Confirmed!
            </h1>
            <p className="text-neutral-600 mb-4">
              Thank you for your purchase. Your order has been successfully
              placed.
            </p>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 inline-block">
              <p className="text-sm text-primary-700 mb-1">Order Number</p>
              <p className="text-xl font-bold text-primary-900">
                {orderData.orderNumber}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                  Order Details
                </h2>
                <div className="space-y-4">
                  {orderData.items?.map((item: any) => (
                    <div
                      key={item._id || item.productId}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:space-x-4 pb-4 border-b border-neutral-100 last:border-b-0 last:pb-0"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={
                            item.productId?.thumbnail ||
                            "/api/placeholder/200/150"
                          }
                          alt={item.name || item.productId?.name || "Product"}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0 w-full">
                        <h3 className="font-medium text-neutral-900 truncate sm:truncate break-words">
                          {item.name || item.productId?.name || "Product"}
                        </h3>
                        <p className="text-sm text-neutral-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right ml-auto sm:ml-0">
                        <p className="font-semibold text-neutral-900">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                  Delivery Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-neutral-400 mt-1" />
                    <div>
                      <p className="font-medium text-neutral-900">
                        Delivery Address
                      </p>
                      <p className="text-neutral-600 text-sm">
                        {orderData.shippingAddress?.street},{" "}
                        {orderData.shippingAddress?.city}
                        <br />
                        {orderData.shippingAddress?.state},{" "}
                        {orderData.shippingAddress?.country}
                        <br />
                        {orderData.shippingAddress?.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Truck className="w-5 h-5 text-neutral-400 mt-1" />
                    <div>
                      <p className="font-medium text-neutral-900">
                        Delivery Method
                      </p>
                      <p className="text-neutral-600 text-sm">
                        Standard Delivery (3-5 business days)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-neutral-400 mt-1" />
                    <div>
                      <p className="font-medium text-neutral-900">
                        Estimated Delivery
                      </p>
                      <p className="text-neutral-600 text-sm">
                        {estimatedDelivery.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <Package className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">
                      What happens next?
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        You&apos;ll receive an email confirmation shortly
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        We&apos;ll notify you when your order ships
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        Track your package with the provided tracking number
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
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
                        Total Paid
                      </span>
                      <span className="text-lg font-semibold text-neutral-900">
                        ₦{total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/dashboard/user/orders"
                  className="w-full btn-primary mb-4 block text-center"
                >
                  View Order
                  <ArrowRight className="ml-2 w-5 h-5 inline" />
                </Link>

                <Link
                  href="/products"
                  className="block w-full btn-outline text-center"
                >
                  Continue Shopping
                </Link>

                <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-600 text-center">
                    Need help? Contact our support team at{" "}
                    <a
                      href="mailto:support@example.com"
                      className="text-primary-600 hover:underline"
                    >
                      support@example.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
