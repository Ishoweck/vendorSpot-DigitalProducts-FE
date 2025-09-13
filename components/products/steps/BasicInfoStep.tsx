"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useProductFormStore } from "@/stores/productFormStore";
import { useCategories } from "@/hooks/useAPI";
import HelpTooltip from "@/components/ui/HelpTooltip";

export default function BasicInfoStep() {
  const { formData, updateFormData } = useProductFormStore();
  const [tagInput, setTagInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();

  const categories = categoriesData?.data?.data || [];

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        updateFormData({
          tags: [...formData.tags, tagInput.trim()],
        });
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateFormData({
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Name <span className="text-red-500">*</span>
          <HelpTooltip text="This title appears on product cards and in search results. Keep it short and descriptive." />
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
          placeholder="Enter product name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
          <HelpTooltip text="Full details buyers should know before purchase. Supports paragraphs; focus on value and what’s included." />
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
          placeholder="Describe your product"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (₦) <span className="text-red-500">*</span>
            <HelpTooltip text="Current selling price. This is what customers pay." />
          </label>
          <input
            type="number"
            value={formData.price || ""}
            onChange={(e) =>
              updateFormData({ price: parseFloat(e.target.value) || 0 })
            }
            min="0"
            step="0.01"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
            <HelpTooltip text="Choose the most relevant category so customers can find your product easily." />
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => updateFormData({ categoryId: e.target.value })}
            disabled={categoriesLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">
              {categoriesLoading ? "Loading categories..." : "Select category"}
            </option>
            {categories.map((category: any) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Original Price (₦)
            <HelpTooltip text="Optional. Shown struck-through if higher than Price to indicate savings." />
          </label>
          <input
            type="number"
            value={formData.originalPrice || ""}
            onChange={(e) =>
              updateFormData({ originalPrice: parseFloat(e.target.value) || 0 })
            }
            min="0"
            step="0.01"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discount Percentage (%)
            <HelpTooltip text="Optional. If set, shows a -% badge and can be used to calculate sale price." />
          </label>
          <input
            type="number"
            value={formData.discountPercentage || ""}
            onChange={(e) =>
              updateFormData({
                discountPercentage: parseFloat(e.target.value) || 0,
              })
            }
            min="0"
            max="100"
            step="0.01"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Features
          <HelpTooltip text="Short bullet points highlighting key benefits. Type and press Enter to add each feature." />
        </label>
        <input
          type="text"
          value={featureInput}
          onChange={(e) => setFeatureInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && featureInput.trim()) {
              e.preventDefault();
              if (!formData.features.includes(featureInput.trim())) {
                updateFormData({
                  features: [...formData.features, featureInput.trim()],
                });
              }
              setFeatureInput("");
            }
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
          placeholder="Type a feature and press Enter"
        />
        {formData.features.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.features.map((feature) => (
              <span
                key={feature}
                className="bg-[#D7195B] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {feature}
                <button
                  onClick={() =>
                    updateFormData({
                      features: formData.features.filter((f) => f !== feature),
                    })
                  }
                  className="hover:bg-white/20 rounded-full p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Requirements
            <HelpTooltip text="What buyers need to use the product (e.g., WordPress 5.0+, Photoshop CC)." />
          </label>
          <input
            type="text"
            value={formData.requirements}
            onChange={(e) => updateFormData({ requirements: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
            placeholder="e.g., WordPress 5.0+, PHP 7.4+"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            License Type
            <HelpTooltip text="How your product can be used (single-site, multiple, unlimited, time-limited, subscription)." />
          </label>
          <select
            value={formData.licenseType}
            onChange={(e) =>
              updateFormData({ licenseType: e.target.value as any })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent cursor-pointer"
          >
            <option value="MULTIPLE_USE">Multiple Use</option>
            <option value="SINGLE_USE">Single Use</option>
            <option value="UNLIMITED">Unlimited</option>
            <option value="TIME_LIMITED">Time Limited</option>
            <option value="SUBSCRIPTION">Subscription</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            License Duration (days)
            <HelpTooltip text="If time-limited or subscription, how long access lasts (0 or blank means lifetime)." />
          </label>
          <input
            type="number"
            value={formData.licenseDuration || ""}
            onChange={(e) =>
              updateFormData({ licenseDuration: parseInt(e.target.value) || 0 })
            }
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
            placeholder="365"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Download Limit
            <HelpTooltip text="Maximum downloads allowed per purchase (-1 means unlimited)." />
          </label>
          <input
            type="number"
            value={formData.downloadLimit === -1 ? "" : formData.downloadLimit}
            onChange={(e) =>
              updateFormData({
                downloadLimit:
                  e.target.value === "" ? -1 : parseInt(e.target.value) || 0,
              })
            }
            min="-1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
            placeholder="-1 for unlimited"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Instructions
          <HelpTooltip text="Optional. Steps to install/use the product after download." />
        </label>
        <textarea
          value={formData.instructions}
          onChange={(e) => updateFormData({ instructions: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
          placeholder="Installation or usage instructions"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
          <HelpTooltip text="Keywords to help customers find your product (press Enter to add)." />
        </label>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7195B] focus:border-transparent"
          placeholder="Type a tag and press Enter"
        />
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="bg-[#D7195B] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:bg-white/20 rounded-full p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
