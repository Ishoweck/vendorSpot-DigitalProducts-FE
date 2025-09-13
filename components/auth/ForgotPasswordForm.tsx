"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, RefreshCw } from "lucide-react";
import { useForgotPassword } from "@/hooks/useAPI";
import { toast } from "react-hot-toast";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [cooldownTime, setCooldownTime] = useState(0);

  const forgotPasswordMutation = useForgotPassword();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (cooldownTime > 0) {
      toast.error(`Please wait ${cooldownTime} seconds before trying again`);
      return;
    }

    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setIsSubmitted(true);
          setRetryCount((prev) => prev + 1);
          setCooldownTime(60);
        },
      }
    );
  };

  const handleRetry = () => {
    if (cooldownTime > 0) {
      toast.error(`Please wait ${cooldownTime} seconds before trying again`);
      return;
    }

    if (retryCount >= 3) {
      toast.error("Maximum retry attempts reached. Please contact support.");
      return;
    }

    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setRetryCount((prev) => prev + 1);
          setCooldownTime(60 * retryCount);
          toast.success("Password reset email sent again!");
        },
      }
    );
  };

  if (isSubmitted) {
    return (
      <>
        <div className="card p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-black font-inter">
              Check Your Email
            </h2>
            <p className="mt-2 text-gray-600">
              We&apos;ve sent a password reset link to your email address
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-gray-600">
              If an account with <strong>{email}</strong> exists, you will
              receive a password reset email shortly.
            </p>
            <p className="text-sm text-gray-500">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {retryCount < 3 && (
              <button
                onClick={handleRetry}
                disabled={forgotPasswordMutation.isLoading || cooldownTime > 0}
                className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-pink-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {forgotPasswordMutation.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Sending...
                  </>
                ) : cooldownTime > 0 ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry in {cooldownTime}s
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Send Again ({3 - retryCount} attempts left)
                  </>
                )}
              </button>
            )}
            <div className="text-center">
              <Link
                href="/login"
                className="text-[#D7195B] hover:text-[#B01548] font-medium"
              >
                Back to Login
              </Link>
            </div>
            {retryCount >= 3 && (
              <p className="text-sm text-red-500 text-center">
                Maximum retry attempts reached. Please contact support if you
                continue to have issues.
              </p>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="card p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black font-inter">
            Forgot Password
          </h2>
          <p className="mt-2 text-gray-600">
            Enter your email address and we&apos;ll send you a link to reset your
            password
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={forgotPasswordMutation.isLoading}
            className="w-full bg-[#D7195B] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#B01548] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {forgotPasswordMutation.isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-[#D7195B] hover:text-[#B01548] font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
