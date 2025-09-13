import { api } from "./base";

export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post<{
      success: boolean;
      data: { user: any; token: string; refreshToken: string };
    }>("/auth/login", credentials),

  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    isVendor?: boolean;
    businessName?: string;
  }) =>
    api.post<{
      success: boolean;
      data: { user: any; token: string; refreshToken: string };
    }>("/auth/register", userData),

  logout: () => api.post("/auth/logout"),

  refresh: (refreshToken: string) =>
    api.post<{
      success: boolean;
      data: { token: string; refreshToken: string };
    }>("/auth/refresh", { refreshToken }),

  forgotPassword: (data: { email: string }) =>
    api.post("/auth/forgot-password", data),

  resetPassword: (data: { token: string; password: string }) =>
    api.post("/auth/reset-password", data),

  verifyEmailOTP: (data: { email: string; otp: string }) =>
    api.post("/auth/verify-email-otp", data),

  resendVerificationOTP: (data: { email: string }) =>
    api.post("/auth/resend-verification-otp", data),

  getCurrentUser: () => api.get<{ success: boolean; data: any }>("/auth/me"),
};
