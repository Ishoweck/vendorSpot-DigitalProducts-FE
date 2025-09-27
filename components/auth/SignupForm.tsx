"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useRegister } from "@/hooks/useAPI";
import { toast } from "react-hot-toast";

export default function SignupForm() {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isVendor: false,
    businessName: "",
    agreeToTerms: false,
  });

  type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  isVendor: boolean;
  businessName: string;
  agreeToTerms: boolean;
};
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
  });

  const registerMutation = useRegister();

  const validateName = (name: string): string => {
    if (!/^[a-zA-Z\s-]+$/.test(name)) {
      return "Name should only contain letters, spaces, and hyphens";
    }
    if (name.length < 2) {
      return "Name should be at least 2 characters long";
    }
    return "";
  };

  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password: string): string => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return "Password must contain at least one special character (!@#$%^&*)";
    }
    return "";
  };

  const validatePhone = (phone: string): string => {
    if (phone && !/^(0|\+234)[789][01]\d{8}$/.test(phone)) {
      return "Please enter a valid Nigerian phone number";
    }
    return "";
  };

  const validateBusinessName = (name: string): string => {
    if (name.length < 3) {
      return "Business name should be at least 3 characters long";
    }
    if (!/^[a-zA-Z0-9\s-&]+$/.test(name)) {
      return "Business name can only contain letters, numbers, spaces, hyphens, and &";
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      firstName: validateName(formData.firstName),
      lastName: validateName(formData.lastName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validatePassword(formData.password),
      phone: validatePhone(formData.phone),
      businessName: formData.isVendor
        ? validateBusinessName(formData.businessName)
        : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      toast.error("Please fix the validation errors before submitting");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    registerMutation.mutate({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone || undefined,
      isVendor: formData.isVendor,
      businessName: formData.isVendor ? formData.businessName : undefined,
    });
  };

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, type, checked } = e.target;

  setFormData((prev) => {
    const updatedFormData = {
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    };

    
    // Validate confirmPassword in real time
    if (name === "password" || name === "confirmPassword") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword:
          updatedFormData.confirmPassword &&
          updatedFormData.password !== updatedFormData.confirmPassword
            ? "Passwords do not match"
            : "",
      }));
    }

    return updatedFormData;
  });

  setErrors((prev) => ({ ...prev, [name]: "" }));

  if (type !== "checkbox") {
    switch (name) {
      case "firstName":
      case "lastName":
        setErrors((prev) => ({
          ...prev,
          [name]: validateName(value),
        }));
        break;
      case "email":
        setErrors((prev) => ({
          ...prev,
          [name]: validateEmail(value),
        }));
        break;
      case "password":
        setErrors((prev) => ({
          ...prev,
          [name]: validatePassword(value),
        }));
        break;
      case "phone":
        setErrors((prev) => ({
          ...prev,
          [name]: validatePhone(value),
        }));
        break;
      case "businessName":
        setErrors((prev) => ({
          ...prev,
          [name]: validateBusinessName(value),
        }));
        break;
    }
  }
};


  useEffect(() => {
    const isVendor = searchParams.get("vendor") === "true";
    if (isVendor) {
      setFormData((prev) => ({ ...prev, isVendor: true }));
    }
  }, [searchParams]);

  return (
    <>
      <div className="card p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 font-display">
            Create Account
          </h2>
          <p className="mt-2 text-neutral-600">
            Join Vendorspot and start your digital journey
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={(e) => {
                    const error = validateName(e.target.value);
                    if (error) toast.error(error);
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="First name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                onBlur={(e) => {
                  const error = validateEmail(e.target.value);
                  if (error) toast.error(error);
                }}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Phone Number (Optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Create password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

         <div>
  <label
    htmlFor="confirmPassword"
    className="block text-sm font-medium text-neutral-700 mb-2"
  >
    Confirm Password
  </label>
  <div className="relative">
    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
    <input
      id="confirmPassword"
      name="confirmPassword"
      type={showConfirmPassword ? "text" : "password"}
      required
      value={formData.confirmPassword}
      onChange={handleChange}
      className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent ${
        errors.confirmPassword ? "border-red-500" : "border-gray-300"
      }`}
      placeholder="Confirm password"
    />
    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      {showConfirmPassword ? (
        <EyeOff className="w-5 h-5" />
      ) : (
        <Eye className="w-5 h-5" />
      )}
    </button>
  </div>
  {errors.confirmPassword && (
    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
  )}
</div>


          <div className="flex items-center">
            <input
              id="isVendor"
              name="isVendor"
              type="checkbox"
              checked={formData.isVendor}
              onChange={handleChange}
              className="h-4 w-4 text-[#D7195B] focus:ring-[#D7195B] border-gray-300 rounded"
            />
            <label
              htmlFor="isVendor"
              className="ml-2 block text-sm text-neutral-700"
            >
              I want to sell digital products (Become a vendor)
            </label>
          </div>

          {formData.isVendor && (
            <div>
              <label
                htmlFor="businessName"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Business Name
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                required={formData.isVendor}
                value={formData.businessName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent ${
                  errors.businessName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your business name"
              />
              {errors.businessName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.businessName}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              required
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="h-4 w-4 text-[#D7195B] focus:ring-[#D7195B] border-gray-300 rounded"
            />
            <label
              htmlFor="agreeToTerms"
              className="ml-2 block text-sm text-gray-700"
            >
              I agree to the{" "}
              <Link
                href="https://www.vendorspotng.com/terms"
                className="text-[#D7195B] hover:text-[#B01548]"
                target="_blank"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="https://www.vendorspotng.com/privacy-policy"
                className="text-[#D7195B] hover:text-[#B01548]"
                target="_blank"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={registerMutation.isLoading}
            className="w-full bg-[#D7195B] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#B01548] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {registerMutation.isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
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
