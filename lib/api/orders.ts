import { api } from "./base";

export const ordersAPI = {
  getAll: () => api.get<{ data: any[]; total: number }>("/orders"),

  getById: (id: string) => api.get<any>(`/orders/${id}`),

  getByPaymentReference: (reference: string) =>
    api.get<any>(`/orders/payment/${reference}`),

  create: (orderData: {
    items: Array<{ productId: string; quantity: number }>;
    shippingAddress: any;
    shippingMethod?: string;
    paymentMethod?: string;
  }) => api.post<any>("/orders", orderData),

  cancel: (id: string) => api.put(`/orders/${id}/cancel`),

  getVendorOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
  }) => api.get<any>("/orders/vendor", { params }),
};
