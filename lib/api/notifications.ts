import { api } from "./base";

export const notificationsAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    isRead?: boolean;
    priority?: string;
  }) =>
    api.get<{
      data: {
        notifications: any[];
        unreadCount: number;
      };
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>("/notifications", { params }),

  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),

  markAllAsRead: () => api.patch("/notifications/read-all"),

  delete: (id: string) => api.delete(`/notifications/${id}`),

  clearAll: () => api.delete("/notifications/clear-all"),

  getSettings: () => api.get("/notifications/settings"),

  updateSettings: (settings: any) =>
    api.put("/notifications/settings", { settings }),

  sendBulk: (data: {
    userIds: string[];
    type: string;
    title: string;
    message: string;
    category: string;
    priority?: string;
    channels?: string[];
  }) => api.post("/notifications/bulk", data),
};
