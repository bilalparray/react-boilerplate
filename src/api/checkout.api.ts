import { apiPost } from "./base/apiClient";

export function placeOrderApi(payload: any) {
  return apiPost<any>("/order", { reqData: payload });
}

export function verifyPaymentApi(payload: any) {
  return apiPost<any>("/order/verify", { reqData: payload }, true);
}
