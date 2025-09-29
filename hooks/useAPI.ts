"use client";

import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import {
  authAPI,
  productsAPI,
  ordersAPI,
  usersAPI,
  vendorsAPI,
  categoriesAPI,
  notificationsAPI,
  paymentsAPI,
  reviewsAPI,
} from "@/lib/api";
import { useTempStore } from "@/stores/tempStore";
import { useRouter } from "next/navigation";

// =====================================
// AUTHENTICATION HOOKS
// =====================================

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { syncTempStore } = useSyncTempStore();

  return useMutation(
    (credentials: { email: string; password: string; rememberMe?: boolean }) =>
      authAPI.login(credentials),
    {
      onSuccess: async (data, variables) => {
        const { CookieService } = require("@/lib/cookies");
        const tokenExpiry = variables.rememberMe ? 7 : 1;
        const refreshExpiry = variables.rememberMe ? 30 : 7;

        CookieService.set("auth_token", data.data.data.token, tokenExpiry);
        CookieService.set(
          "refresh_token",
          data.data.data.refreshToken,
          refreshExpiry
        );

        queryClient.invalidateQueries(["user"]);

        await syncTempStore();

        toast.success("Login successful!");
        window.location.href = "/dashboard";
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Login failed", {
          duration: 6000,
        });
      },
    }
  );
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const { syncTempStore } = useSyncTempStore();

  return useMutation(authAPI.register, {
    onSuccess: async (data) => {
      const { CookieService } = require("@/lib/cookies");
      CookieService.set("auth_token", data.data.data.token, 1);
      CookieService.set("refresh_token", data.data.data.refreshToken, 7);

      queryClient.invalidateQueries(["user"]);

      await syncTempStore();

      toast.success("Registration successful! Please verify your email.");
      window.location.href = "/verify-email";
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed", {
        duration: 6000,
      });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { generateNewSession } = useTempStore();

  return useMutation(authAPI.logout, {
    onSuccess: () => {
      const { CookieService } = require("@/lib/cookies");
      CookieService.remove("auth_token");
      CookieService.remove("refresh_token");
      queryClient.clear();
      generateNewSession();
      toast.success("Logged out successfully");
      window.location.href = "/login";
    },
  });
};

export const useForgotPassword = () => {
  return useMutation(authAPI.forgotPassword, {
    onSuccess: () => {
      toast.success("Password reset link sent to your email");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to send reset link",
        {
          duration: 6000,
        }
      );
    },
  });
};

export const useResetPassword = () => {
  return useMutation(authAPI.resetPassword, {
    onSuccess: () => {
      toast.success("Password reset successful");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to reset password", {
        duration: 6000,
      });
    },
  });
};

export const useVerifyEmailOTP = () => {
  const queryClient = useQueryClient();

  return useMutation(authAPI.verifyEmailOTP, {
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      toast.success("Email verified successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to verify email", {
        duration: 6000,
      });
    },
  });
};

export const useResendVerificationOTP = () => {
  return useMutation(authAPI.resendVerificationOTP, {
    onSuccess: () => {
      toast.success("Verification code sent to your email");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to send verification code",
        {
          duration: 6000,
        }
      );
    },
  });
};

// =====================================
// PRODUCTS HOOKS
// =====================================

export const useProducts = (params?: {
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
}) => {
  return useQuery(["products", params], () => productsAPI.getAll(params), {
    keepPreviousData: true,
  });
};

export const useProduct = (id: string) => {
  return useQuery(["product", id], () => productsAPI.getById(id), {
    enabled: !!id,
  });
};

export const useVendorProducts = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery(
    ["vendor-products", params],
    () => productsAPI.getVendorProducts(params),
    {
      keepPreviousData: true,
    }
  );
};

export const useVendorOrders = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
}) => {
  return useQuery(
    ["vendor-orders", params],
    () => ordersAPI.getVendorOrders(params),
    {
      keepPreviousData: true,
    }
  );
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(productsAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      toast.success("Product created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create product");
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, data }: { id: string; data: FormData }) =>
      productsAPI.update(id, data),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries(["products"]);
        queryClient.invalidateQueries(["product", id]);
        toast.success("Product updated successfully!");
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || "Failed to update product"
        );
      },
    }
  );
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(productsAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      queryClient.invalidateQueries(["vendor-products"]);
      toast.success("Product deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete product");
    },
  });
};



export const useDownloadProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ productId, orderId }: { productId: string; orderId: string }) => {
      const response = await productsAPI.download(productId, orderId);
      return response.data;
    },
    {
      onSuccess: (data: any) => {
        const payload = data?.data;

        if (!payload) {
          toast.error("Invalid download response");
          return;
        }

        // ✅ Handle link-based product
        if (payload.isLink && payload.linkUrl) {
          window.open(payload.linkUrl, "_blank");
          toast.success("Redirecting to external link...");
        } 
        // ✅ Handle file-based product
        else if (payload.downloadUrl) {
          const link = document.createElement("a");
          link.href = payload.downloadUrl;
          link.setAttribute("download", payload.filename || "download");

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          toast.success("Download started successfully!");

          if (
            payload.remainingDownloads !== -1 &&
            payload.remainingDownloads >= 0
          ) {
            toast.success(`${payload.remainingDownloads} downloads remaining`);
          }
        } else {
          toast.error("No valid download URL provided.");
        }

        // ✅ Refresh orders
        queryClient.invalidateQueries(["orders"]);
        queryClient.invalidateQueries(["order"]);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Download failed");
      },
    }
  );
};

// =====================================
// ORDERS HOOKS
// =====================================

export const useOrders = () => {
  return useQuery(["orders"], ordersAPI.getAll);
};

export const useOrder = (id: string) => {
  return useQuery(["order", id], () => ordersAPI.getById(id), {
    enabled: !!id,
  });
};

export const useOrderByPaymentReference = (reference: string) => {
  return useQuery(
    ["order-by-payment", reference],
    () => ordersAPI.getByPaymentReference(reference),
    {
      enabled: !!reference,
    }
  );
};

  export const useCreateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation(ordersAPI.create, {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders"]);
        queryClient.invalidateQueries(["cart"]);
        toast.success("Order created successfully oo!");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to create order");
      },
    });
  };

// =====================================
// USER PROFILE HOOKS
// =====================================

export const useUserProfile = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const { setVendorStatus, generateNewSession } = useTempStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { CookieService } = require("@/lib/cookies");
      const hasToken = !!CookieService.get("auth_token");
      setIsEnabled(hasToken);
    }
  }, []);

  const query = useQuery(["user"], usersAPI.getProfile, {
    enabled: isEnabled,
    retry: false,
  });

  useEffect(() => {
    if (query.data?.data?.data && isEnabled) {
      const user = query.data.data.data;
      const isVendor = user.role === "VENDOR";
      setVendorStatus(isVendor);

      if (isVendor) {
        generateNewSession();
      }
    }
  }, [query.data, isEnabled, setVendorStatus, generateNewSession]);

  return query;
};

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation(usersAPI.uploadAvatar, {
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile"]); 
    },
  });
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation(usersAPI.updateProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });
};

export const useUpdateVendorProfile = (config?: { showToast?: boolean }) => {
  const queryClient = useQueryClient();
  const showToast = config?.showToast !== false;

  return useMutation(
    (payload: any) => {
      if (typeof FormData !== "undefined" && payload instanceof FormData) {
        return vendorsAPI.updateVerification(payload);
      }
      return vendorsAPI.updateProfile(payload);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["vendor-profile"]);
        if (showToast) {
          toast.success("Vendor profile updated successfully!");
        }
      },
      onError: (error: any) => {
        if (showToast) {
          toast.error(
            error.response?.data?.message || "Failed to update vendor profile"
          );
        }
      },
    }
  );
};

export const useFeaturedVendors = (limit = 5) => {
  return useQuery({
    queryKey: ["featured-vendors", limit],
    queryFn: () =>
      vendorsAPI.getAll({ isSponsored: true, limit }).then((res) => res.data.data),
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const { generateNewSession } = useTempStore();

  return useMutation(
    ({ password }: { password: string }) => usersAPI.deleteAccount(password),
    {
      onSuccess: () => {
        const { CookieService } = require("@/lib/cookies");
        CookieService.remove("auth_token");
        CookieService.remove("refresh_token");

        queryClient.clear();
        generateNewSession();

        toast.success("Account deleted successfully");

        window.location.href = "/register";
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || "Failed to delete account"
        );
      },
    }
  );
};

// =====================================
// WALLET HOOKS
// =====================================

export const useVendorWallet = () => {
  return useQuery(["vendor-wallet"], async () => {
    const res = await vendorsAPI.getWallet();

    console.log(res.data);
    
    return res.data.data;
  });
};





// =====================================
// ADDRESS HOOKS
// =====================================

export const useAddresses = () => {
  return useQuery(["addresses"], usersAPI.getAddresses);
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();
  return useMutation(usersAPI.addAddress, {
    onSuccess: () => {
      queryClient.invalidateQueries(["addresses"]);
      queryClient.invalidateQueries(["user"]);
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, payload }: { id: string; payload: any }) =>
      usersAPI.updateAddress(id, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["addresses"]);
        queryClient.invalidateQueries(["user"]);
      },
    }
  );
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation((id: string) => usersAPI.deleteAddress(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["addresses"]);
      queryClient.invalidateQueries(["user"]);
    },
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();
  return useMutation((id: string) => usersAPI.setDefaultAddress(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["addresses"]);
      queryClient.invalidateQueries(["user"]);
    },
  });
};

// =====================================
// WISHLIST HOOKS
// =====================================

export const useWishlist = (
  enabled: boolean = true,
  params?: { page?: number; limit?: number }
) => {
  return useQuery(["wishlist", params], () => usersAPI.getWishlist(params), {
    enabled,
  });
};

export const useAllWishlist = (enabled: boolean = true) => {
  return useQuery(
    ["all-wishlist"],
    () => usersAPI.getWishlist({ limit: 1000 }),
    {
      enabled,
    }
  );
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  const { removeSavedItem } = useTempStore();

  return useMutation((productId: string) => usersAPI.addToWishlist(productId), {
    onSuccess: (data, productId) => {
      queryClient.invalidateQueries(["wishlist"]);
      queryClient.invalidateQueries(["all-wishlist"]);
      removeSavedItem(productId);
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (productId: string) => usersAPI.removeFromWishlist(productId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["wishlist"]);
        queryClient.invalidateQueries(["all-wishlist"]);
      },
    }
  );
};

// =====================================
// CART HOOKS
// =====================================

export const useCart = (enabled: boolean = true) => {
  return useQuery(["cart"], () => usersAPI.getCart(), {
    enabled,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { removeCartItem } = useTempStore();

  return useMutation(
    ({ productId, quantity }: { productId: string; quantity: number }) =>
      usersAPI.addToCart(productId, quantity),
    {
      onSuccess: (data, variables) => {
        const { productId } = variables;

        queryClient.invalidateQueries(["cart"]);

        queryClient.setQueryData(["cart"], (oldData: any) => {
          if (!oldData?.data?.data) return oldData;

          const cart = oldData.data.data;
          const existingItemIndex = (cart.items || []).findIndex(
            (item: any) => item.productId === productId
          );

          const newItems = [...(cart.items || [])];

          if (existingItemIndex !== -1) {
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity:
                newItems[existingItemIndex].quantity + variables.quantity,
            };
          } else {
            newItems.push({
              productId: productId,
              quantity: variables.quantity,
              addedAt: new Date(),
            });
          }

          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: {
                ...cart,
                items: newItems,
              },
            },
          };
        });

        removeCartItem(productId);
      },
      onError: (error: any) => {
        console.error("Add to cart error:", error);
      },
    }
  );
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ productId, quantity }: { productId: string; quantity: number }) =>
      usersAPI.updateCartItem(productId, quantity),
    {
      onSuccess: (data, variables) => {
        const { productId, quantity } = variables;

        queryClient.invalidateQueries(["cart"]);

        queryClient.setQueryData(["cart"], (oldData: any) => {
          if (!oldData?.data?.data) return oldData;

          const cart = oldData.data.data;
          const newItems = (cart.items || []).map((item: any) =>
            item.productId === productId
              ? { ...item, quantity: quantity }
              : item
          );

          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: {
                ...cart,
                items: newItems,
              },
            },
          };
        });
      },
      onError: (error: any) => {
        console.error("Update cart item error:", error);
      },
    }
  );
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (productId: string) => usersAPI.removeFromCart(productId),
    {
      onSuccess: (data, productId) => {
        queryClient.invalidateQueries(["cart"]);

        queryClient.setQueryData(["cart"], (oldData: any) => {
          if (!oldData?.data?.data) return oldData;

          const cart = oldData.data.data;
          const newItems = (cart.items || []).filter(
            (item: any) => item.productId !== productId
          );

          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: {
                ...cart,
                items: newItems,
              },
            },
          };
        });
      },
      onError: (error: any) => {
        console.error("Remove from cart error:", error);
      },
    }
  );
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation(usersAPI.clearCart, {
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);

      queryClient.setQueryData(["cart"], (oldData: any) => {
        if (!oldData?.data?.data) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: {
              items: [],
            },
          },
        };
      });
    },
    onError: (error: any) => {
      console.error("Clear cart error:", error);
    },
  });
};

// =====================================
// VENDOR HOOKS
// =====================================

export const useVendor = (id: string) => {
  return useQuery(["vendor", id], () => vendorsAPI.getById(id), {
    enabled: !!id,
  });
};

export const useVendorDashboard = () => {
  return useQuery(["vendor-dashboard"], vendorsAPI.getDashboard);
};

export const useVendorProfile = () => {
  return useQuery(["vendor-profile"], vendorsAPI.getProfile);
};

export const useRegisterVendor = () => {
  const queryClient = useQueryClient();

  return useMutation(vendorsAPI.register, {
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      toast.success("Vendor registration successful!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to register as vendor"
      );
    },
  });
};

// =====================================
// CATEGORIES HOOKS
// =====================================

export const useCategories = () => {
  return useQuery(["categories"], categoriesAPI.getAll);
};

// =====================================
// NOTIFICATIONS HOOKS
// =====================================

export const useNotifications = (params?: {
  page?: number;
  limit?: number;
  category?: string;
  isRead?: boolean;
  priority?: string;
}) => {
  return useQuery(
    ["notifications", params],
    () => notificationsAPI.getAll(params),
    {
      keepPreviousData: true,
    }
  );
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation((id: string) => notificationsAPI.markAsRead(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation(notificationsAPI.markAllAsRead, {
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("All notifications marked as read");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to mark all notifications as read"
      );
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation((id: string) => notificationsAPI.delete(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("Notification deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete notification"
      );
    },
  });
};

export const useClearAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation(notificationsAPI.clearAll, {
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("All notifications cleared successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to clear notifications"
      );
    },
  });
};

export const useNotificationSettings = () => {
  return useQuery(["notification-settings"], notificationsAPI.getSettings);
};

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (settings: any) => notificationsAPI.updateSettings(settings),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["notification-settings"]);
        toast.success("Notification settings updated successfully");
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message ||
            "Failed to update notification settings"
        );
      },
    }
  );
};

export const useSendBulkNotification = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: {
      userIds: string[];
      type: string;
      title: string;
      message: string;
      category: string;
      priority?: string;
      channels?: string[];
    }) => notificationsAPI.sendBulk(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["notifications"]);
        toast.success("Bulk notifications sent successfully");
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || "Failed to send bulk notifications"
        );
      },
    }
  );
};

// =====================================
// REVIEW HOOKS
// =====================================

export const useProductReviews = (
  productId: string,
  enabled: boolean = true
) => {
  return useQuery(
    ["reviews", productId],
    () => reviewsAPI.getProductReviews(productId),
    {
      enabled: !!productId && enabled,
    }
  );
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation(reviewsAPI.create, {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["reviews", variables.productId]);
      queryClient.invalidateQueries(["product", variables.productId]);
      queryClient.invalidateQueries(["products"]);
      toast.success("Review submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit review");
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, data }: { id: string; data: any }) => reviewsAPI.update(id, data),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["reviews"]);
        if ((variables as any)?.data?.productId) {
          const pid = (variables as any).data.productId;
          queryClient.invalidateQueries(["product", pid]);
          queryClient.invalidateQueries(["products"]);
        }
        toast.success("Review updated successfully!");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to update review");
      },
    }
  );
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation(reviewsAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
      queryClient.invalidateQueries(["products"]);
      toast.success("Review deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete review");
    },
  });
};

export const useMarkReviewHelpful = (productId?: string) => {
  const queryClient = useQueryClient();
  return useMutation((id: string) => reviewsAPI.markHelpful(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", productId]);
    },
  });
};

export const useReportReview = (productId?: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, reason }: { id: string; reason: string }) =>
      reviewsAPI.report(id, { reason }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["reviews", productId]);
        toast.success("Review reported");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to report review");
      },
    }
  );
};

export const useRespondToReview = (productId?: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, message }: { id: string; message: string }) =>
      reviewsAPI.respondToReview(id, { message }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["reviews", productId]);
        toast.success("Response submitted successfully");
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || "Failed to submit response"
        );
      },
    }
  );
};

// =====================================
// PAYMENT HOOKS
// =====================================

export const useInitializePayment = () => {
  const queryClient = useQueryClient();

  return useMutation(paymentsAPI.initialize, {
    onSuccess: (data) => {
      if (data.data?.data?.authorization_url) {
        window.location.href = data.data.data.authorization_url;
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Payment initialization failed"
      );
    },
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation(paymentsAPI.verify, {
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["cart"]);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Payment verification failed"
      );
    },
  });
};

// =====================================
// TEMPORARY STORE SYNC HOOKS
// =====================================

export const useSyncTempStore = () => {
  const router = useRouter();
  const {
    savedItems,
    cartItems,
    isPendingSync,
    markPendingSync,
    clearPendingSync,
    generateNewSession,
  } = useTempStore();
  const addToWishlist = useAddToWishlist();
  const addToCart = useAddToCart();

  const syncTempStore = async () => {
    console.log("Sync temp store called", {
      isPendingSync,
      savedItems,
      cartItems,
    });

    if (!isPendingSync || (savedItems.length === 0 && cartItems.length === 0)) {
      console.log("No sync needed");
      return;
    }

    try {
      console.log("Starting sync with items:", { savedItems, cartItems });
      const promises = [];

      for (const productId of savedItems) {
        promises.push(addToWishlist.mutateAsync(productId));
      }

      for (const item of cartItems) {
        promises.push(
          addToCart.mutateAsync({
            productId: item.productId,
            quantity: item.quantity,
          })
        );
      }

      await Promise.all(promises);
      console.log("Sync completed successfully");
      clearPendingSync();
      generateNewSession();
    } catch (error) {
      console.error("Failed to sync temp store:", error);
      clearPendingSync();
    }
  };

  const handleGuestAction = (action: "save" | "cart") => {
    console.log("Guest action:", action);
    markPendingSync();
    router.push("/login");
  };

  const handleVendorAction = (action: "save" | "cart") => {
    const message =
      action === "save"
        ? "Vendors cannot save items"
        : "Vendors cannot add items to cart";
    toast.error(message);
    generateNewSession();
  };

  return {
    syncTempStore,
    handleGuestAction,
    handleVendorAction,
    isPendingSync,
  };
};
