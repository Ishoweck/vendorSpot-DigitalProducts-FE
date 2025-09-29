import axios from "axios";
import { CookieService } from "../cookies";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = CookieService.get("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== "undefined") {
        const refreshToken = CookieService.get("refresh_token");

        if (refreshToken) {
          try {
            const response = await api.post("/auth/refresh", { refreshToken });
            if (response.data.success) {
              CookieService.set("auth_token", response.data.data.token, 1);
              CookieService.set(
                "refresh_token",
                response.data.data.refreshToken,
                7
              );

              originalRequest.headers.Authorization = `Bearer ${response.data.data.token}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            CookieService.remove("auth_token");
            CookieService.remove("refresh_token");
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        } else {
          CookieService.remove("auth_token");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);
