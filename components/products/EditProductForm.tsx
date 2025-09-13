"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUpdateProduct } from "@/hooks/useAPI";
import { toast } from "react-hot-toast";

interface Product {
  _id: string;
  vendorId: string | { _id: string; businessName: string };
  categoryId: string | { _id: string; name: string };
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  isDigital: boolean;
  fileUrl?: string;
  fileSize?: number;
  fileType?: string;
  previewUrl?: string;
  thumbnail?: string;
  images: string[];
  tags: string[];
  features: string[];
  requirements?: string;
  instructions?: string;
  licenseType?:
    | "SINGLE_USE"
    | "MULTIPLE_USE"
    | "UNLIMITED"
    | "TIME_LIMITED"
    | "SUBSCRIPTION";
  licenseDuration?: number;
  downloadLimit?: number;
  isActive: boolean;
  isFeatured: boolean;
  isApproved: boolean;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
  viewCount: number;
  downloadCount: number;
  soldCount: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

interface EditProductFormProps {
  product: Product;
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter();
  const updateProductMutation = useUpdateProduct();

  useEffect(() => {
    if (updateProductMutation.isSuccess && !updateProductMutation.isLoading) {
      router.push("/dashboard/vendor/products");
    }
  }, [
    updateProductMutation.isSuccess,
    updateProductMutation.isLoading,
    router,
  ]);

  const [formData, setFormData] = useState({
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    originalPrice: product.originalPrice || "",
    discountPercentage: product.discountPercentage || "",
    categoryId:
      typeof product.categoryId === "string"
        ? product.categoryId
        : product.categoryId?._id || "",
    tags: product.tags?.join(", ") || "",
    features: product.features?.join(", ") || "",
    requirements: product.requirements || "",
    instructions: product.instructions || "",
    licenseType: product.licenseType || "MULTIPLE_USE",
    licenseDuration: product.licenseDuration || "",
    downloadLimit: product.downloadLimit || "",
  });

  const [files, setFiles] = useState({
    file: null as File | null,
    thumbnail: null as File | null,
    preview: null as File | null,
    images: [] as File[],
  });

  const [previews, setPreviews] = useState({
    thumbnail: product.thumbnail || "",
    preview: product.previewUrl || "",
    images: product.images || [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selectedFiles } = e.target;

    if (!selectedFiles) return;

    if (name === "images") {
      const imageFiles = Array.from(selectedFiles);
      setFiles((prev) => ({
        ...prev,
        images: imageFiles,
      }));

      const imagePreviews = imageFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => ({
        ...prev,
        images: imagePreviews,
      }));
    } else {
      const file = selectedFiles[0];
      setFiles((prev) => ({
        ...prev,
        [name]: file,
      }));

      if (name === "thumbnail" && file) {
        setPreviews((prev) => ({
          ...prev,
          thumbnail: URL.createObjectURL(file),
        }));
      }
      if (name === "preview" && file) {
        setPreviews((prev) => ({
          ...prev,
          preview: URL.createObjectURL(file),
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product?._id) {
      toast.error("Product ID is missing");
      return;
    }

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("price", formData.price.toString());
    submitData.append("originalPrice", formData.originalPrice.toString());
    submitData.append(
      "discountPercentage",
      formData.discountPercentage.toString()
    );
    submitData.append("categoryId", formData.categoryId);

    if (formData.tags) {
      const tagsArray = formData.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0);
      submitData.append("tags", JSON.stringify(tagsArray));
    }

    if (formData.features) {
      const featuresArray = formData.features
        .split(",")
        .map((feature: string) => feature.trim())
        .filter((feature: string) => feature.length > 0);
      submitData.append("features", JSON.stringify(featuresArray));
    }

    submitData.append("requirements", formData.requirements);
    submitData.append("instructions", formData.instructions);
    submitData.append("licenseType", formData.licenseType);
    submitData.append("licenseDuration", formData.licenseDuration.toString());
    submitData.append("downloadLimit", formData.downloadLimit.toString());

    if (files.file) {
      submitData.append("file", files.file);
    }

    if (files.thumbnail) {
      submitData.append("thumbnail", files.thumbnail);
    }

    if (files.preview) {
      submitData.append("preview", files.preview);
    }

    files.images.forEach((image) => {
      submitData.append("images", image);
    });

    updateProductMutation.mutate({
      id: product._id,
      data: submitData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₦) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Price (₦)
            </label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Percentage (%)
            </label>
            <input
              type="number"
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleInputChange}
              min="0"
              max="100"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
            placeholder="Describe your product..."
          />
        </div>

        {/* Short Description disabled */}

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Features (comma-separated)
          </label>
          <input
            type="text"
            name="features"
            value={formData.features}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
            placeholder="e.g., responsive, SEO optimized, mobile friendly"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements
            </label>
            <input
              type="text"
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
              placeholder="e.g., WordPress 5.0+, PHP 7.4+"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Type
            </label>
            <select
              name="licenseType"
              value={formData.licenseType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7195B] focus:border-transparent cursor-pointer"
            >
              <option value="MULTIPLE_USE">Multiple Use</option>
              <option value="SINGLE_USE">Single Use</option>
              <option value="UNLIMITED">Unlimited</option>
              <option value="TIME_LIMITED">Time Limited</option>
              <option value="SUBSCRIPTION">Subscription</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Duration (days)
            </label>
            <input
              type="number"
              name="licenseDuration"
              value={formData.licenseDuration}
              onChange={handleInputChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
              placeholder="365"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Download Limit
            </label>
            <input
              type="number"
              name="downloadLimit"
              value={formData.downloadLimit}
              onChange={handleInputChange}
              min="-1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
              placeholder="-1 for unlimited"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instructions
          </label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
            placeholder="Installation or usage instructions"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
            placeholder="e.g., design, template, ui"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Files</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product File (optional - only upload if you want to replace)
            </label>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Upload the main digital product file (ZIP, PDF, etc.)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
            />
            {previews.thumbnail && (
              <div className="mt-2">
                <img
                  src={previews.thumbnail}
                  alt="Thumbnail preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview Image (optional - only upload if you want to replace)
            </label>
            <input
              type="file"
              name="preview"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
            />
            {previews.preview && (
              <div className="mt-2">
                <img
                  src={previews.preview}
                  alt="Preview image"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Images (optional - only upload if you want to replace)
            </label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
            />
            {previews.images.length > 0 && (
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                {previews.images.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={updateProductMutation.isLoading}
          className="px-6 py-2 bg-[#D7195B] text-white rounded-lg hover:bg-[#B01548] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateProductMutation.isLoading ? "Updating..." : "Update Product"}
        </button>
      </div>
    </form>
  );
}
