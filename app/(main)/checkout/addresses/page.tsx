"use client";

import { useState } from "react";
import { MapPin, Plus, Edit3, Trash2 } from "lucide-react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import AuthWrapper from "@/components/auth/AuthWrapper";
import {
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/hooks/useAPI";
import { useRouter } from "next/navigation";

function CheckoutAddressesContent() {
  const { data: addressesData, isLoading } = useAddresses();
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefault = useSetDefaultAddress();
  const router = useRouter();

  const addresses = addressesData?.data?.data || [];

  const [showForm, setShowForm] = useState(false);
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

  const startAdd = () => {
    setEditingId(null);
    setFormData({
      fullName: "",
      street: "",
      city: "",
      state: "",
      country: "Nigeria",
      postalCode: "",
      phone: "",
      isDefault: false,
    });
    setShowForm(true);
  };

  const startEdit = (addr: any) => {
    setEditingId(addr._id);
    setFormData({
      fullName: addr.fullName || "",
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "",
      country: addr.country || "Nigeria",
      postalCode: addr.postalCode || "",
      phone: addr.phone || "",
      isDefault: !!addr.isDefault,
    });
    setShowForm(true);
  };

  const saveForm = async () => {
    if (!formData.street || !formData.city || !formData.phone) return;
    if (editingId) {
      await updateAddress.mutateAsync({ id: editingId, payload: formData });
    } else {
      await addAddress.mutateAsync(formData);
    }
    setShowForm(false);
  };

  const handleSelectAddress = async (id: string) => {
    await setDefault.mutateAsync(id);
    router.push("/checkout");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SectionWrapper className="pt-8 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Select Shipping Address
              </h1>
              <button
                onClick={startAdd}
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
                  No addresses found
                </h3>
                <p className="text-gray-600 mb-6">
                  Add a shipping address to continue checkout.
                </p>
                <button
                  onClick={startAdd}
                  className="inline-flex items-center px-4 py-2 bg-[#D7195B] text-white rounded-md hover:bg-[#B01548] transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Address
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((addr: any) => (
                  <div
                    key={addr._id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {addr.fullName}
                          </p>
                          <p className="text-gray-600">{addr.street}</p>
                          <p className="text-gray-600">
                            {addr.city}, {addr.state}
                          </p>
                          <p className="text-gray-600">{addr.country}</p>
                          {addr.postalCode && (
                            <p className="text-gray-600">{addr.postalCode}</p>
                          )}
                          <p className="text-gray-600">{addr.phone}</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSelectAddress(addr._id)}
                            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                          >
                            Select
                          </button>
                        )}
                        {addr.isDefault && (
                          <span className="px-3 py-1.5 rounded-md text-sm bg-green-100 text-green-800">
                            Default
                          </span>
                        )}
                        <button
                          onClick={() => startEdit(addr)}
                          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50 inline-flex items-center"
                        >
                          <Edit3 className="w-4 h-4 mr-1" /> Edit
                        </button>
                        <button
                          onClick={async () => {
                            await deleteAddress.mutateAsync(addr._id);
                          }}
                          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-red-50 text-red-600 inline-flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SectionWrapper>

      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
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
                saveForm();
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
                    setFormData({ ...formData, fullName: e.target.value })
                  }
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
                      setFormData({ ...formData, state: e.target.value })
                    }
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
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center mt-1">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
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
                  onClick={() => setShowForm(false)}
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
    </div>
  );
}

export default function CheckoutAddressesPage() {
  return (
    <AuthWrapper requireAuth={true}>
      <CheckoutAddressesContent />
    </AuthWrapper>
  );
}
