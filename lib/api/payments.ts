import { api } from "./base";

export const paymentsAPI = {
  initialize: (paymentData: { orderId: string; idempotencyKey: string }) =>
    api.post<{
      success: boolean;
      data: {
        payment: any;
        authorization_url: string;
        access_code: string;
        reference: string;
      };
    }>("/payments/initialize", paymentData),

  verify: (reference: string) =>
    api.post<{ success: boolean; data: any }>("/payments/verify", {
      reference,
    }),
};
