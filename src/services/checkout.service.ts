import { apiPost } from "../api/base/apiClient";
import { httpClient } from "../api/base/httpClient";
import { placeOrderApi, verifyPaymentApi } from "../api/checkout.api";

export async function getRazorpayKey() {
  const res = httpClient.get<any, any>("/order/razorpay-key");

  return res.then((r) => r.keyId);
}

export async function placeOrder(payload: any) {
  const res = await placeOrderApi(payload);
  return res;
}

export async function verifyPayment(payload: any) {
  const res = await verifyPaymentApi(payload);

  if (res.isError) {
    throw new Error(
      res.errorData?.displayMessage || "Payment verification failed"
    );
  }

  return res.successData;
}
export async function createCustomer(payload: any) {
  // payload should include name, email, contact, and address details
  const res = await apiPost<any>("/customer/create", { reqData: payload });

  // Assuming the API returns the new customer object in successData
  return res;
}
