import { apiGet, apiPost } from "./base/apiClient";

/* Razorpay key */
export function fetchRazorpayKey() {
  return apiGet<any>("/order/razorpay-key");
}

/* Create customer */
export function createCustomerApi(reqData: any) {
  return apiPost<any>("/customer/create", { reqData });
}
