"use client";

import { File, Image } from "lucide-react";
import { useProductFormStore } from "@/stores/productFormStore";
import { useCategories } from "@/hooks/useAPI";
import HelpTooltip from "@/components/ui/HelpTooltip";

export default function ReviewStep() {
  const { formData } = useProductFormStore();
  const { data: categoriesData } = useCategories();

  const categories = categoriesData?.data?.data || [];
  const selectedCategory = categories.find(
    (cat: any) => cat._id === formData.categoryId
  );

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Product Details
          <HelpTooltip text="Review everything before submitting. Go back to make corrections." />
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <p className="text-gray-900 break-words">{formData.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <p className="text-gray-900">
                ₦{formData.price.toLocaleString()}
                {formData.originalPrice > 0 && (
                  <span className="text-sm text-gray-500 ml-2">
                    (was ₦{formData.originalPrice.toLocaleString()})
                  </span>
                )}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount
              </label>
              <p className="text-gray-900">
                {formData.discountPercentage > 0
                  ? `${formData.discountPercentage}% off`
                  : "No discount"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <p className="text-gray-900 break-words">
                {formData.description}
              </p>
            </div>

            {/* Short Description disabled */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <p className="text-gray-900">
                  {selectedCategory?.name || "Category not found"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#D7195B] text-white px-2 py-1 rounded-full text-xs break-words"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature) => (
                    <span
                      key={feature}
                      className="bg-[#D7195B] text-white px-2 py-1 rounded-full text-xs break-words"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Type
                </label>
                <p className="text-gray-900">
                  {formData.licenseType.replace("_", " ")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Duration
                </label>
                <p className="text-gray-900">
                  {formData.licenseDuration > 0
                    ? `${formData.licenseDuration} days`
                    : "Lifetime"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Download Limit
                </label>
                <p className="text-gray-900">
                  {formData.downloadLimit === -1
                    ? "Unlimited"
                    : `${formData.downloadLimit} downloads`}
                </p>
              </div>
            </div>

            {formData.requirements && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements
                </label>
                <p className="text-gray-900 break-words">
                  {formData.requirements}
                </p>
              </div>
            )}

            {formData.instructions && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <p className="text-gray-900 break-words">
                  {formData.instructions}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Files</h3>

        <div className="space-y-4">
          {formData.file && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <File className="w-8 h-8 text-[#D7195B] flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900">Product File</p>
                <p className="text-sm text-gray-600 break-words">
                  {formData.file.name}
                </p>
              </div>
            </div>
          )}

          {formData.thumbnail && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <img
                src={URL.createObjectURL(formData.thumbnail)}
                alt="Thumbnail"
                className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900">Thumbnail (required)</p>
                <p className="text-sm text-gray-600 break-words">
                  {formData.thumbnail.name}
                </p>
              </div>
            </div>
          )}

          {formData.preview && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <img
                src={URL.createObjectURL(formData.preview)}
                alt="Preview"
                className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900">Preview Image</p>
                <p className="text-sm text-gray-600 break-words">
                  {formData.preview.name}
                </p>
              </div>
            </div>
          )}

          {formData.images.length > 0 && (
            <div className="p-3 bg-white rounded-lg">
              <p className="font-medium text-gray-900 mb-3">
                Additional Images ({formData.images.length})
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {formData.images.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-16 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          Your product will be submitted for review after creation. You'll be
          notified once it's approved and live on the marketplace.
        </p>
      </div>
    </div>
  );
}
