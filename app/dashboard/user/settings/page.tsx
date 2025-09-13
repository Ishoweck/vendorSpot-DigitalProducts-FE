"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Trash2,
  Edit3,
  Save,
  X,
} from "lucide-react";
import UserSidebar from "@/components/dashboard/UserSidebar";
import SectionWrapper from "@/components/layout/SectionWrapper";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import AuthWrapper from "@/components/auth/AuthWrapper";
import {
  useUserProfile,
  useUpdateProfile,
  useDeleteAccount,
} from "@/hooks/useAPI";
import { toast } from "react-hot-toast";

function SettingsPageContent() {
  const { data: userProfile } = useUserProfile();
  const user = userProfile?.data?.data;
  const updateProfile = useUpdateProfile();
  const deleteAccount = useDeleteAccount();
  const [passwordForDelete, setPasswordForDelete] = useState("");

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const handleSave = async (field: string) => {
    try {
      const payload: any = {};
      if (field === "phone") {
        if (!/^\d{10,11}$/.test(editValue)) {
          toast.error("Phone number must be 10-11 digits");
          return;
        }
        payload.phone = editValue;
      }
      if (field === "dateOfBirth") {
        const dob = new Date(editValue);
        const now = new Date();
        const minDate = new Date();
        minDate.setFullYear(now.getFullYear() - 100);

        if (dob > now || dob < minDate) {
          toast.error("Please enter a valid date of birth");
          return;
        }
        payload.dateOfBirth = editValue;
      }

      await updateProfile.mutateAsync(payload);
      setEditingField(null);
      setEditValue("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = async () => {
    await deleteAccount.mutateAsync({ password: passwordForDelete });
    setShowDeleteConfirm(false);
  };

  const renderField = (
    label: string,
    field: string,
    value: string,
    editable: boolean = true,
    type: string = "text"
  ) => {
    const isEditing = editingField === field;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              {field === "email" && <Mail className="w-5 h-5 text-gray-600" />}
              {field === "phone" && <Phone className="w-5 h-5 text-gray-600" />}
              {field === "dateOfBirth" && (
                <Calendar className="w-5 h-5 text-gray-600" />
              )}
              {field === "name" && <User className="w-5 h-5 text-gray-600" />}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{label}</p>
              {isEditing ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type={type}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#D7195B]"
                  />
                  <button
                    onClick={() => handleSave(field)}
                    className="text-green-600 hover:text-green-700"
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
                <p className="text-gray-900">{value}</p>
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
      </div>
    );
  };

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const dob = user?.dateOfBirth
    ? new Date(user.dateOfBirth).toISOString().slice(0, 10)
    : "";

  return (
    <div className="bg-gray-50 min-h-screen">
      <SectionWrapper className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            <UserSidebar />
            <main className="flex-1 bg-white rounded-lg shadow p-4 sm:p-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Settings
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {renderField("Full Name", "name", fullName, false)}
                {renderField("Email", "email", user?.email || "", false)}
                {renderField(
                  "Phone Number",
                  "phone",
                  user?.phone || "",
                  true,
                  "tel"
                )}
                {renderField("Date of Birth", "dateOfBirth", dob, true, "date")}
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Account Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-700">Email Verification</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user?.isEmailVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user?.isEmailVerified ? "Verified" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-700">Phone Verification</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user?.isPhoneVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user?.isPhoneVerified ? "Verified" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-700">Member Since</span>
                    <span className="text-gray-900">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="font-semibold text-red-900 mb-4">Danger Zone</h3>
                <p className="text-red-700 mb-4">
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </button>
              </div>

              <ConfirmationModal
                isOpen={showDeleteConfirm}
                title="Delete Account"
                message={
                  (
                    <div>
                      <p className="mb-3">
                        Are you sure you want to delete your account? This
                        action cannot be undone.
                      </p>
                      <input
                        type="password"
                        value={passwordForDelete}
                        onChange={(e) => setPasswordForDelete(e.target.value)}
                        placeholder="Enter password"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
                      />
                    </div>
                  ) as any
                }
                confirmLabel="Delete Account"
                cancelLabel="Cancel"
                onConfirm={confirmDeleteAccount}
                onCancel={() => setShowDeleteConfirm(false)}
              />
            </main>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AuthWrapper requireAuth={true}>
      <SettingsPageContent />
    </AuthWrapper>
  );
}
