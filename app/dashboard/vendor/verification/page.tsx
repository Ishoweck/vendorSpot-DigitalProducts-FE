"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  CheckCircle,
  CreditCard,
  FileText,
  X,
} from "lucide-react";
import VendorSidebar from "@/components/dashboard/VendorSidebar";
import SectionWrapper from "@/components/layout/SectionWrapper";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { useVendorProfile, useUpdateVendorProfile } from "@/hooks/useAPI";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

function VerificationFormContent() {
  const router = useRouter();
  const { data: vendorProfile } = useVendorProfile();
  const updateVendorProfile = useUpdateVendorProfile({ showToast: false });
  const vendor = vendorProfile?.data?.data;

  if (
    vendor?.verificationStatus === "PENDING" ||
    vendor?.verificationStatus === "APPROVED"
  ) {
    if (typeof window !== "undefined") {
      router.push("/dashboard/vendor");
      return null;
    }
  }

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    taxId: vendor?.taxId || "",
    bankName: vendor?.bankName || "",
    bankAccountNumber: vendor?.bankAccountNumber || "",
    bankAccountName: vendor?.bankAccountName || "",
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [documentNames, setDocumentNames] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case "taxId":
        if (!value.trim()) {
          newErrors.taxId = "Tax ID is required";
        } else if (value.length < 5) {
          newErrors.taxId = "Tax ID must be at least 5 characters";
        } else {
          delete newErrors.taxId;
        }
        break;
      case "bankName":
        if (!value.trim()) {
          newErrors.bankName = "Bank name is required";
        } else {
          delete newErrors.bankName;
        }
        break;
      case "bankAccountNumber":
        if (!value.trim()) {
          newErrors.bankAccountNumber = "Account number is required";
        } else if (!/^\d{10}$/.test(value)) {
          newErrors.bankAccountNumber =
            "Account number must be exactly 10 digits";
        } else {
          delete newErrors.bankAccountNumber;
        }
        break;
      case "bankAccountName":
        if (!value.trim()) {
          newErrors.bankAccountName = "Account name is required";
        } else if (value.length < 2) {
          newErrors.bankAccountName =
            "Account name must be at least 2 characters";
        } else {
          delete newErrors.bankAccountName;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    validateField(field, value);
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setDocuments((prev) => [...prev, ...files]);
    setDocumentNames((prev) => [...prev, ...files.map((f) => f.name)]);
  };

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
    setDocumentNames((prev) => prev.filter((_, i) => i !== index));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          formData.taxId.trim() !== "" && documents.length > 0 && !errors.taxId
        );
      case 2:
        return (
          formData.bankName.trim() !== "" &&
          formData.bankAccountNumber.trim() !== "" &&
          formData.bankAccountName.trim() !== "" &&
          /^\d{10}$/.test(formData.bankAccountNumber) &&
          !errors.bankName &&
          !errors.bankAccountNumber &&
          !errors.bankAccountName
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("taxId", formData.taxId);
      formDataToSend.append("bankName", formData.bankName);
      formDataToSend.append("bankAccountNumber", formData.bankAccountNumber);
      formDataToSend.append("bankAccountName", formData.bankAccountName);

      documents.forEach((doc) => {
        formDataToSend.append("documents", doc, doc.name);
      });

      await updateVendorProfile.mutateAsync(formDataToSend as any);

      toast.success("Verification documents submitted successfully!");
      router.push("/dashboard/vendor/profile");
    } catch (error: any) {

      console.log(error)
      toast.error(
        error.response?.data?.message ||
          "Failed to submit verification documents"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Tax & Identity Information
        </h3>
        <p className="text-gray-600 text-sm">
          Please provide your tax identification and upload government-issued
          documents.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tax ID Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.taxId}
          onChange={(e) => handleInputChange("taxId", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D7195B] ${
            errors.taxId ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your tax identification number"
        />
        {errors.taxId && (
          <p className="text-red-500 text-sm mt-1">{errors.taxId}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Verification Documents <span className="text-red-500">*</span>
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Upload government-issued ID or business documents (PDF, JPG, PNG)
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleDocumentUpload}
            className="hidden"
            id="document-upload"
          />
          <label
            htmlFor="document-upload"
            className="inline-block bg-[#D7195B] text-white px-4 py-2 rounded-md hover:bg-[#B01548] cursor-pointer"
          >
            Choose Files
          </label>
        </div>
        {documents.length === 0 && (
          <p className="text-red-500 text-sm mt-1">
            At least one document is required
          </p>
        )}
      </div>

      {documentNames.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Uploaded Documents:
          </h4>
          <div className="space-y-2">
            {documentNames.map((name, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span className="text-sm text-gray-700">{name}</span>
                <button
                  onClick={() => removeDocument(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Banking Details
        </h3>
        <p className="text-gray-600 text-sm">
          Please provide your bank account information for payments.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bank Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.bankName}
          onChange={(e) => handleInputChange("bankName", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D7195B] ${
            errors.bankName ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your bank name"
        />
        {errors.bankName && (
          <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Account Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.bankAccountNumber}
          onChange={(e) =>
            handleInputChange(
              "bankAccountNumber",
              e.target.value.replace(/\D/g, "")
            )
          }
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D7195B] ${
            errors.bankAccountNumber ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your account number"
          maxLength={10}
        />
        <p className="text-xs text-gray-500 mt-1">Must be 10 digits</p>
        {errors.bankAccountNumber && (
          <p className="text-red-500 text-sm mt-1">
            {errors.bankAccountNumber}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Account Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.bankAccountName}
          onChange={(e) => handleInputChange("bankAccountName", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D7195B] ${
            errors.bankAccountName ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter account holder name"
        />
        {errors.bankAccountName && (
          <p className="text-red-500 text-sm mt-1">{errors.bankAccountName}</p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Review & Submit
        </h3>
        <p className="text-gray-600 text-sm">
          Please review your information before submitting.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">
            Tax & Identity Information
          </h4>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Tax ID:</span> {formData.taxId}
            </p>
            <p>
              <span className="font-medium">Documents:</span>{" "}
              {documentNames.length} file(s) uploaded
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Banking Details</h4>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Bank Name:</span>{" "}
              {formData.bankName}
            </p>
            <p>
              <span className="font-medium">Account Number:</span>{" "}
              {formData.bankAccountNumber}
            </p>
            <p>
              <span className="font-medium">Account Name:</span>{" "}
              {formData.bankAccountName}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">
              Verification Process
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              After submission, our team will review your documents. You'll
              receive a notification once the verification is complete.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  const steps = [
    { number: 1, title: "Tax & Identity", icon: FileText },
    { number: 2, title: "Banking Details", icon: CreditCard },
    { number: 3, title: "Review & Submit", icon: CheckCircle },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <SectionWrapper className="pt-4 pb-4 md:pt-8 md:pb-8">
        <div className="flex gap-4 md:gap-8">
          <VendorSidebar />

          <main className="flex-1 bg-white rounded-lg shadow p-3 md:p-6">
            <div className="mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Vendor Verification
              </h1>

              <div className="flex items-center justify-between mb-8">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.number;
                  const isCompleted = currentStep > step.number;

                  return (
                    <div key={step.number} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                          isCompleted
                            ? "bg-[#D7195B] border-[#D7195B] text-white"
                            : isActive
                              ? "border-[#D7195B] text-[#D7195B]"
                              : "border-gray-300 text-gray-400"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span
                        className={`ml-2 text-sm font-medium ${
                          isActive ? "text-[#D7195B]" : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </span>
                      {index < steps.length - 1 && (
                        <div
                          className={`w-16 h-0.5 mx-4 ${
                            isCompleted ? "bg-[#D7195B]" : "bg-gray-300"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mb-6">{renderStepContent()}</div>

              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>

                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center px-4 py-2 bg-[#D7195B] text-white rounded-md hover:bg-[#B01548]"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center px-6 py-2 bg-[#D7195B] text-white rounded-md hover:bg-[#B01548] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit for Verification
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </main>
        </div>
      </SectionWrapper>
    </div>
  );
}

export default function VerificationFormPage() {
  return (
    <AuthWrapper requireAuth={true}>
      <VerificationFormContent />
    </AuthWrapper>
  );
}
