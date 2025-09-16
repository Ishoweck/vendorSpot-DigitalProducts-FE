  import { api } from "./base";

  export const productsAPI = {
    getAll: (params?: {
      page?: number;
      limit?: number;
      category?: string;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      minRating?: number;
      vendor?: string;
      sortBy?: string;
      sortOrder?: string;
    }) => api.get<{ data: any[]; pagination: any }>("/products", { params }),

    getById: (id: string) => api.get<any>(`/products/${id}`),

    getVendorProducts: (params?: { page?: number; limit?: number }) =>
      api.get<{ data: any[]; pagination: any }>("/products/vendor", { params }),

    create: (productData: FormData) =>
      api.post<any>("/products", productData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      }),

    update: (id: string, productData: FormData) =>
      api.put<any>(`/products/${id}`, productData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      }),

    delete: (id: string) => api.delete(`/products/${id}`),

    download: (productId: string, orderId: string) =>
      api.get(`/products/${productId}/download`, {
        params: { orderId },
      }),
  };
