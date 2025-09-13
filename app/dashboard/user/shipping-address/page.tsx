"use client";

import { useState } from "react";
import { MapPin, Plus, Edit3, Trash2 } from "lucide-react";
import UserSidebar from "@/components/dashboard/UserSidebar";
import SectionWrapper from "@/components/layout/SectionWrapper";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import AuthWrapper from "@/components/auth/AuthWrapper";
import {
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  useUserProfile,
} from "@/hooks/useAPI";

function ShippingAddressPageContent() {
  const { data: userProfile } = useUserProfile();
  const user = userProfile?.data?.data;

  const { data: addressesData, isLoading } = useAddresses();
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefault = useSetDefaultAddress();

  const addresses = addressesData?.data?.data || [];

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    country: "Nigeria",
    postalCode: "",
    phone: "",
    isDefault: false,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    addressId: string | null;
  }>({ isOpen: false, addressId: null });

  const handleAddAddress = () => {
    setEditingId(null);
    setFormData({
      fullName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
      street: "",
      city: "",
      state: "",
      country: "Nigeria",
      postalCode: "",
      phone: "",
      isDefault: false,
    });
    setShowAddForm(true);
  };

  const handleEditAddress = (addr: any) => {
    setEditingId(addr._id);
    setFormData({
      fullName: addr.fullName,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      country: addr.country || "Nigeria",
      postalCode: addr.postalCode || "",
      phone: addr.phone,
      isDefault: !!addr.isDefault,
    });
    setShowAddForm(true);
  };

  const handleSaveForm = async () => {
    if (!formData.street || !formData.city || !formData.phone) return;
    if (editingId) {
      await updateAddress.mutateAsync({ id: editingId, payload: formData });
    } else {
      await addAddress.mutateAsync(formData);
    }
    setShowAddForm(false);
  };

  const handleDelete = async (id: string) => {
    await deleteAddress.mutateAsync(id);
  };

  const handleSetDefault = async (id: string) => {
    await setDefault.mutateAsync(id);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SectionWrapper className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            <UserSidebar />
            <main className="flex-1 bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Shipping Address
                </h1>
                <button
                  onClick={handleAddAddress}
                  className="inline-flex items-center px-4 py-2 bg-[#D7195B] text-white rounded-md hover:bg-[#B01548] transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Address
                </button>
              </div>

              {isLoading ? (
                <div className="text-center py-12">Loading...</div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No shipping addresses
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Add a shipping address for faster checkout.
                  </p>
                  <button
                    onClick={handleAddAddress}
                    className="inline-flex items-center px-4 py-2 bg-[#D7195B] text-white rounded-md hover:bg-[#B01548] transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address: any) => (
                    <div
                      key={address._id}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {address.fullName}
                            </p>
                            <p className="text-gray-600">{address.street}</p>
                            <p className="text-gray-600">
                              {address.city}, {address.state}
                            </p>
                            <p className="text-gray-600">{address.country}</p>
                            {address.postalCode && (
                              <p className="text-gray-600">
                                {address.postalCode}
                              </p>
                            )}
                            <p className="text-gray-600">{address.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {address.isDefault && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                              Default
                            </span>
                          )}
                          {!address.isDefault && (
                            <button
                              onClick={() => handleSetDefault(address._id)}
                              className="text-sm text-[#D7195B] hover:text-[#B01548]"
                            >
                              Set as Default
                            </button>
                          )}
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                isOpen: true,
                                addressId: address._id,
                              })
                            }
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showAddForm && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) setShowAddForm(false);
                  }}
                >
                  <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {editingId ? "Edit Address" : "Add Shipping Address"}
                    </h3>
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveForm();
                      }}
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fullName: e.target.value,
                            })
                          }
                          placeholder={`${user?.firstName || ""} ${user?.lastName || ""}`.trim()}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          value={formData.street}
                          onChange={(e) =>
                            setFormData({ ...formData, street: e.target.value })
                          }
                          placeholder="123 Main Street"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) =>
                              setFormData({ ...formData, city: e.target.value })
                            }
                            placeholder="Lagos"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State
                          </label>
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                state: e.target.value,
                              })
                            }
                            placeholder="Lagos"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            value={formData.postalCode}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                postalCode: e.target.value,
                              })
                            }
                            placeholder="100001"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text_sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            placeholder="+234 123 456 7890"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex items-center mt-1">
                        <input
                          type="checkbox"
                          checked={formData.isDefault}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isDefault: e.target.checked,
                            })
                          }
                          className="mr-2"
                        />
                        <label className="text-sm text-gray-700">
                          Set as default address
                        </label>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2 bg-[#D7195B] text-white rounded-md hover:bg-[#B01548] transition-colors"
                        >
                          {editingId ? "Save Changes" : "Add Address"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <ConfirmationModal
                isOpen={deleteConfirm.isOpen}
                title="Delete Address"
                message="Are you sure you want to delete this shipping address? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={async () => {
                  if (deleteConfirm.addressId) {
                    await deleteAddress.mutateAsync(deleteConfirm.addressId);
                  }
                  setDeleteConfirm({ isOpen: false, addressId: null });
                }}
                onCancel={() =>
                  setDeleteConfirm({ isOpen: false, addressId: null })
                }
              />
            </main>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}

export default function ShippingAddressPage() {
  return (
    <AuthWrapper requireAuth={true}>
      <ShippingAddressPageContent />
    </AuthWrapper>
  );
}
