import { api } from "./base";

export const usersAPI = {
  getProfile: () => api.get<any>("/users/profile"),

  updateProfile: (userData: any) => api.put<any>("/users/profile", userData),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return api.post<{
      success: boolean;
      message: string;
      data: { avatar: string };
    }>("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getWishlist: (params?: { page?: number; limit?: number }) =>
    api.get<any>("/users/wishlist", { params }),

  addToWishlist: (productId: string) =>
    api.post<any>("/users/wishlist", { productId }),

  removeFromWishlist: (productId: string) =>
    api.delete<any>(`/users/wishlist/${productId}`),

  getCart: () => api.get<any>("/users/cart"),

  addToCart: (productId: string, quantity: number = 1) =>
    api.post<any>("/users/cart", { productId, quantity }),

  updateCartItem: (productId: string, quantity: number) =>
    api.put<any>(`/users/cart/${productId}`, { quantity }),

  removeFromCart: (productId: string) =>
    api.delete<any>(`/users/cart/${productId}`),

  clearCart: () => api.delete<any>("/users/cart"),

  getDashboard: () => api.get<any>("/users/dashboard"),

  getAddresses: () => api.get<any>("/users/addresses"),
  addAddress: (payload: any) => api.post<any>("/users/addresses", payload),
  updateAddress: (id: string, payload: any) =>
    api.put<any>(`/users/addresses/${id}`, payload),
  deleteAddress: (id: string) => api.delete<any>(`/users/addresses/${id}`),
  setDefaultAddress: (id: string) =>
    api.patch<any>(`/users/addresses/${id}/default`),

  deleteAccount: (password: string) =>
    api.delete<any>("/users/account", { data: { password } }),
};
