import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  categoryId: string;
  tags: string[];
  features: string[];
  requirements: string;
  instructions: string;
  licenseType:
    | "SINGLE_USE"
    | "MULTIPLE_USE"
    | "UNLIMITED"
    | "TIME_LIMITED"
    | "SUBSCRIPTION";
  licenseDuration: number;
  downloadLimit: number;
  file: File | null;
  thumbnail: File | null;
  preview: File | null;
  images: File[];
  fileMetadata: { name: string; size: number; type: string } | null;
  thumbnailMetadata: { name: string; size: number } | null;
  previewMetadata: { name: string; size: number } | null;
  imagesMetadata: Array<{ name: string; size: number }>;
}

interface ProductFormStore {
  formData: ProductFormData;
  updateFormData: (data: Partial<ProductFormData>) => void;
  isStepValid: (step: number) => boolean;
  resetForm: () => void;
  clearPersistedData: () => void;
}

const initialFormData: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  originalPrice: 0,
  discountPercentage: 0,
  categoryId: "",
  tags: [],
  features: [],
  requirements: "",
  instructions: "",
  licenseType: "MULTIPLE_USE",
  licenseDuration: 365,
  downloadLimit: -1,
  file: null,
  thumbnail: null,
  preview: null,
  images: [],
  fileMetadata: null,
  thumbnailMetadata: null,
  previewMetadata: null,
  imagesMetadata: [],
};

export const useProductFormStore = create<ProductFormStore>()(
  persist(
    (set, get) => ({
      formData: initialFormData,

      updateFormData: (data) =>
        set((state) => {
          const newData = { ...data };

          if (data.file !== undefined) {
            newData.fileMetadata = data.file
              ? {
                  name: data.file.name,
                  size: data.file.size,
                  type: data.file.type,
                }
              : null;
          }

          if (data.thumbnail !== undefined) {
            newData.thumbnailMetadata = data.thumbnail
              ? { name: data.thumbnail.name, size: data.thumbnail.size }
              : null;
          }

          if (data.preview !== undefined) {
            newData.previewMetadata = data.preview
              ? { name: data.preview.name, size: data.preview.size }
              : null;
          }

          if (data.images !== undefined) {
            newData.imagesMetadata = data.images.map((file) => ({
              name: file.name,
              size: file.size,
            }));
          }

          return {
            formData: { ...state.formData, ...newData },
          };
        }),

      isStepValid: (step) => {
        const { formData } = get();

        switch (step) {
          case 1:
            return (
              formData.name.trim() !== "" &&
              formData.description.trim() !== "" &&
              formData.price > 0 &&
              formData.categoryId !== ""
            );
          case 2:
            return formData.file !== null;
          case 3:
            return true;
          default:
            return false;
        }
      },

      resetForm: () => set({ formData: initialFormData }),

      clearPersistedData: () => {
        localStorage.removeItem("product-form-storage");
        set({ formData: initialFormData });
      },
    }),
    {
      name: "product-form-storage",
      partialize: (state) => ({
        formData: {
          name: state.formData.name,
          description: state.formData.description,
          price: state.formData.price,
          originalPrice: state.formData.originalPrice,
          discountPercentage: state.formData.discountPercentage,
          categoryId: state.formData.categoryId,
          tags: state.formData.tags,
          features: state.formData.features,
          requirements: state.formData.requirements,
          instructions: state.formData.instructions,
          licenseType: state.formData.licenseType,
          licenseDuration: state.formData.licenseDuration,
          downloadLimit: state.formData.downloadLimit,
          fileMetadata: state.formData.fileMetadata,
          thumbnailMetadata: state.formData.thumbnailMetadata,
          previewMetadata: state.formData.previewMetadata,
          imagesMetadata: state.formData.imagesMetadata,
          file: null,
          thumbnail: null,
          preview: null,
          images: [],
        },
      }),
    }
  )
);
