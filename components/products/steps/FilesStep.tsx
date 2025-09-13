"use client";

import { useRef } from "react";
import { Upload, X, File, Image, RefreshCw } from "lucide-react";
import { useProductFormStore } from "@/stores/productFormStore";
import HelpTooltip from "@/components/ui/HelpTooltip";

export default function FilesStep() {
  const { formData, updateFormData } = useProductFormStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const previewInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData({ file });
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData({ thumbnail: file });
    }
  };

  const handlePreviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData({ preview: file });
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    updateFormData({ images: [...formData.images, ...files] });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    updateFormData({ images: newImages });
  };

  const truncateFileName = (fileName: string, maxLength: number = 25) => {
    if (fileName.length <= maxLength) return fileName;
    const extension = fileName.split(".").pop();
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf("."));
    const truncatedName = nameWithoutExt.substring(
      0,
      maxLength - extension!.length - 4
    );
    return `${truncatedName}...${extension}`;
  };

  const hasFileMetadata = formData.fileMetadata && !formData.file;
  const hasThumbnailMetadata =
    formData.thumbnailMetadata && !formData.thumbnail;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product File <span className="text-red-500">*</span>
          <HelpTooltip text="Upload the main digital file customers will download (ZIP, PDF, etc.)." />
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#D7195B] transition-colors"
        >
          {formData.file && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateFormData({ file: null, fileMetadata: null });
              }}
              className="absolute top-1 right-1 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors z-10"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}

          {formData.file ? (
            <div className="flex items-center justify-center gap-3">
              <File className="w-8 h-8 text-[#D7195B] flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 break-words">
                  {truncateFileName(formData.file.name)}
                </p>
                <p className="text-sm text-gray-600">
                  {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : hasFileMetadata ? (
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2 flex-shrink-0">
                <RefreshCw className="w-6 h-6 text-orange-500" />
                <File className="w-8 h-8 text-gray-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-orange-600 break-words">
                  Re-upload required:{" "}
                  {truncateFileName(formData?.fileMetadata?.name || "")}
                </p>
                <p className="text-sm text-gray-600">
                  {formData?.fileMetadata?.size !== undefined
                    ? (formData.fileMetadata.size / 1024 / 1024).toFixed(2)
                    : "N/A"}{" "}
                  MB (previous)
                </p>
                <p className="text-xs text-orange-500 mt-1">
                  Files need to be re-uploaded after page refresh
                </p>
              </div>
            </div>
          ) : (
            <div>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Click to upload your digital product
              </p>
              <p className="text-sm text-gray-500 mt-1">
                ZIP, PDF, or other digital files
              </p>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept=".zip,.pdf,.doc,.docx,.psd,.ai,.sketch"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thumbnail <span className="text-red-500">*</span>
          <HelpTooltip text="Cover image shown on product cards and details page. Recommended 400x300px." />
        </label>
        <div
          onClick={() => thumbnailInputRef.current?.click()}
          className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#D7195B] transition-colors"
        >
          {formData.thumbnail && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateFormData({ thumbnail: null, thumbnailMetadata: null });
              }}
              className="absolute top-1 right-1 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors z-10"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}

          {formData.thumbnail ? (
            <div className="flex items-center justify-center gap-3">
              <img
                src={URL.createObjectURL(formData.thumbnail)}
                alt="Thumbnail"
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 break-words">
                  {truncateFileName(formData.thumbnail.name)}
                </p>
                <p className="text-sm text-gray-600">
                  {(formData.thumbnail.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          ) : hasThumbnailMetadata ? (
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2 flex-shrink-0">
                <RefreshCw className="w-6 h-6 text-orange-500" />
                <Image className="w-8 h-8 text-gray-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-orange-600 break-words">
                  Re-upload required:{" "}
                  {truncateFileName(formData?.thumbnailMetadata?.name || "")}
                </p>
                <p className="text-sm text-gray-600">
                  {formData?.thumbnailMetadata?.size !== undefined
                    ? (formData.thumbnailMetadata.size / 1024).toFixed(2)
                    : "N/A"}{" "}
                  KB (previous)
                </p>
                <p className="text-xs text-orange-500 mt-1">
                  Files need to be re-uploaded after page refresh
                </p>
              </div>
            </div>
          ) : (
            <div>
              <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Upload a thumbnail image (required)
              </p>
              <p className="text-sm text-gray-500 mt-1">
                JPG, PNG (recommended: 400x300px)
              </p>
            </div>
          )}
        </div>
        <input
          ref={thumbnailInputRef}
          type="file"
          onChange={handleThumbnailChange}
          className="hidden"
          accept="image/*"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preview Image (Optional)
          <HelpTooltip text="Optional promo image or screenshot shown on the product page." />
        </label>
        <div
          onClick={() => previewInputRef.current?.click()}
          className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#D7195B] transition-colors"
        >
          {formData.preview && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateFormData({ preview: null, previewMetadata: null });
              }}
              className="absolute top-1 right-1 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors z-10"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}

          {formData.preview ? (
            <div className="flex items-center justify-center gap-3">
              <img
                src={URL.createObjectURL(formData.preview)}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 break-words">
                  {truncateFileName(formData.preview.name)}
                </p>
                <p className="text-sm text-gray-600">
                  {(formData.preview.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          ) : formData.previewMetadata && !formData.preview ? (
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2 flex-shrink-0">
                <RefreshCw className="w-6 h-6 text-orange-500" />
                <Image className="w-8 h-8 text-gray-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-orange-600 break-words">
                  Re-upload required:{" "}
                  {truncateFileName(formData?.previewMetadata?.name || "")}
                </p>
                <p className="text-sm text-gray-600">
                  {formData?.previewMetadata?.size !== undefined
                    ? (formData.previewMetadata.size / 1024).toFixed(2)
                    : "N/A"}{" "}
                  KB (previous)
                </p>
                <p className="text-xs text-orange-500 mt-1">
                  Files need to be re-uploaded after page refresh
                </p>
              </div>
            </div>
          ) : (
            <div>
              <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Upload a preview image</p>
              <p className="text-sm text-gray-500 mt-1">
                JPG, PNG (recommended: 800x600px)
              </p>
            </div>
          )}
        </div>
        <input
          ref={previewInputRef}
          type="file"
          onChange={handlePreviewChange}
          className="hidden"
          accept="image/*"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Images (Optional)
          <HelpTooltip text="Optional gallery images (screenshots, variants, previews)." />
        </label>
        <div
          onClick={() => imagesInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#D7195B] transition-colors"
        >
          <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Upload preview images</p>
          <p className="text-sm text-gray-500 mt-1">Multiple images allowed</p>
        </div>
        <input
          ref={imagesInputRef}
          type="file"
          onChange={handleImagesChange}
          className="hidden"
          accept="image/*"
          multiple
        />

        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {formData?.imagesMetadata?.length > 0 &&
          formData?.images?.length === 0 && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-700 font-medium mb-2">
                Previously selected images (need re-upload):
              </p>
              <ul className="text-sm text-orange-600 space-y-1">
                {formData.imagesMetadata.map((meta, index) => (
                  <li key={index} className="break-words">
                    • {truncateFileName(meta.name)} (
                    {(meta.size / 1024).toFixed(2)} KB)
                  </li>
                ))}
              </ul>
              <p className="text-xs text-orange-500 mt-2">
                Files need to be re-uploaded after page refresh
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
