import { api } from "./base";

export const reviewsAPI = {
  getProductReviews: (productId: string) =>
    api.get<any>(`/reviews/product/${productId}`),

  create: (reviewData: {
    productId: string;
    orderId: string;
    rating: number;
    title?: string;
    comment?: string;
  }) => api.post<any>("/reviews", reviewData),

  update: (id: string, reviewData: any) =>
    api.put<any>(`/reviews/${id}`, reviewData),

  delete: (id: string) => api.delete<any>(`/reviews/${id}`),

  getUserReviews: () => api.get<any>("/reviews/user"),

  respondToReview: (id: string, data: { message: string }) =>
    api.post<any>(`/reviews/${id}/respond`, data),

  markHelpful: (id: string) => api.post<any>(`/reviews/${id}/helpful`),

  report: (id: string, data: { reason: string }) =>
    api.post<any>(`/reviews/${id}/report`, data),
};
