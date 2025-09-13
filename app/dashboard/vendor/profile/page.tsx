"use client";

import {
  User,
  Mail,
  Building,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Copy,
  CheckCircle,
  Clock,
  XCircle,
  Upload,
  Phone,
  Globe,
  MapPin,
} from "lucide-react";
import VendorSidebar from "@/components/dashboard/VendorSidebar";
import SectionWrapper from "@/components/layout/SectionWrapper";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { useState, useRef } from "react";
import {
  useUserProfile,
  useVendorProfile,
  useUpdateProfile,
  useUpdateVendorProfile,
} from "@/hooks/useAPI";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

function VendorProfileContent() {
  const router = useRouter();
  const { data: userProfile } = useUserProfile();
  const { data: vendorProfile } = useVendorProfile();
  const updateUserProfile = useUpdateProfile();
  const updateVendorProfile = useUpdateVendorProfile();

  const user = userProfile?.data?.data;
  const vendor = vendorProfile?.data?.data;
  const [profile, setProfile] = useState(user || {});
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [isUploadingPFP, setIsUploadingPFP] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const handleSave = async (field: string) => {
    try {
      if (field === "phone") {
        const phone = editValue.trim();
        const isValid = /^\+?[1-9]\d{9,14}$/.test(phone);
        if (!isValid) {
          toast.error("Enter a valid phone number");
          return;
        }
        await updateUserProfile.mutateAsync({ phone });
        toast.success("Phone number updated successfully!");
      } else {
        const updateData: any = {};
        updateData[field] = editValue;
        await updateVendorProfile.mutateAsync(updateData);
      }

      setProfile((prev: any) => ({
        ...prev,
        [field]: editValue,
      }));
      setEditingField(null);
      setEditValue("");
    } catch (error: any) {
      console.error("Update failed:", error);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleCopyWebsite = () => {
    const website =
      vendor?.website ||
      `${window.location.origin}/products?vendor=${vendor?.businessName}`;
    navigator.clipboard.writeText(website);
    setCopied(true);
    toast.success("Website copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploadingPFP(true);
      try {
        const formData = new FormData();
        formData.append("avatar", file);

        const { usersAPI } = await import("@/lib/api/users");
        const response = await usersAPI.uploadAvatar(file);

        setProfile((prev: any) => ({
          ...prev,
          avatar: response.data.data.avatar,
        }));

        toast.success("Profile picture updated successfully!");
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to update profile picture"
        );
      } finally {
        setIsUploadingPFP(false);
      }
    }
  };

  const getVerificationButton = () => {
    const status = vendor?.verificationStatus || "NOT_VERIFIED";
    const baseClasses =
      "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors";

    const handleVerificationClick = () => {
      if (status === "NOT_VERIFIED" || status === "REJECTED") {
        router.push("/dashboard/vendor/verification");
      }
    };

    switch (status) {
      case "APPROVED":
        return (
          <button
            disabled
            className={`${baseClasses} bg-green-100 text-green-800 hover:bg-green-200 cursor-not-allowed`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Verified</span>
          </button>
        );
      case "PENDING":
        return (
          <button
            disabled
            className={`${baseClasses} bg-yellow-100 text-yellow-800 opacity-70 cursor-not-allowed`}
          >
            <Clock className="w-4 h-4" />
            <span>Pending Verification</span>
          </button>
        );
      case "REJECTED":
        return (
          <button
            onClick={handleVerificationClick}
            className={`${baseClasses} bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer`}
          >
            <XCircle className="w-4 h-4" />
            <span>Resubmit Verification</span>
          </button>
        );
      case "NOT_VERIFIED":
      default:
        return (
          <button
            onClick={handleVerificationClick}
            className={`${baseClasses} bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer`}
          >
            <Upload className="w-4 h-4" />
            <span>Start Verification</span>
          </button>
        );
    }
  };

  const renderField = (
    label: string,
    field: string,
    value: string,
    editable: boolean = true,
    icon: any
  ) => {
    const isEditing = editingField === field;

    return (
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">{label}</p>
            {isEditing ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#D7195B]"
                />
                <button
                  onClick={() => handleSave(field)}
                  className="text-green-600 hover:text-green-700"
                  disabled={
                    updateUserProfile.isLoading || updateVendorProfile.isLoading
                  }
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="text-gray-600 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="text-gray-900 text-sm md:text-base">{value}</p>
            )}
          </div>
        </div>
        {editable && !isEditing && (
          <button
            onClick={() => handleEdit(field, value)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SectionWrapper className="pt-4 pb-4 md:pt-8 md:pb-8">
        <div className="max-w-7xl mx-auto px-2 md:px-4">
          <div className="flex gap-4 md:gap-8">
            <VendorSidebar />
            <main className="flex-1 bg-white rounded-lg shadow p-3 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Profile
                </h1>
                {getVerificationButton()}
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#D7195B] rounded-full flex items-center justify-center overflow-hidden">
                      {profile.avatar ? (
                        <img
                          src={profile.avatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      )}
                    </div>
                    <button
                      onClick={handleProfilePictureClick}
                      disabled={isUploadingPFP}
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#D7195B] rounded-full flex items-center justify-center hover:bg-[#B01548] transition-colors disabled:opacity-50"
                    >
                      {isUploadingPFP ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="w-3 h-3 text-white" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                      {vendor?.businessName || "Not set"}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      {vendor?.businessDescription || "No description"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Joined{" "}
                      {new Date(
                        user?.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                  {renderField(
                    "Business Name",
                    "businessName",
                    vendor?.businessName || "Not set",
                    false,
                    <Building className="w-4 h-4 text-gray-600" />
                  )}
                  {renderField(
                    "Business Description",
                    "businessDescription",
                    vendor?.businessDescription || "No description",
                    true,
                    <Building className="w-4 h-4 text-gray-600" />
                  )}
                  {renderField(
                    "Email",
                    "email",
                    user?.email || "Not set",
                    false,
                    <Mail className="w-4 h-4 text-gray-600" />
                  )}
                  {renderField(
                    "Phone",
                    "phone",
                    user?.phone || "Not set",
                    true,
                    <Phone className="w-4 h-4 text-gray-600" />
                  )}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Globe className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Website
                        </p>
                        <p className="text-gray-900 text-sm md:text-base">
                          {vendor?.website ||
                            `${window.location.origin}/products?vendor=${vendor?.businessName}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleCopyWebsite}
                      className="flex items-center space-x-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {renderField(
                    "Address",
                    "businessAddress",
                    vendor?.businessAddress || "Not set",
                    true,
                    <MapPin className="w-4 h-4 text-gray-600" />
                  )}
                </div>
              </div>

              <div className="mt-4 md:mt-6 bg-[#D7195B]/10 border border-[#D7195B]/20 rounded-lg p-4">
                <h4 className="font-medium text-[#D7195B] mb-2 text-sm md:text-base">
                  Profile Tips
                </h4>
                <ul className="text-sm text-[#D7195B]/80 space-y-1">
                  <li>• Keep your business information up to date</li>
                  <li>• Add a professional profile picture</li>
                  <li>• Write a compelling business description</li>
                  <li>• Include your website and contact information</li>
                </ul>
              </div>
            </main>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

export default function VendorProfilePage() {
  return (
    <AuthWrapper requireAuth={true}>
      <VendorProfileContent />
    </AuthWrapper>
  );
}
