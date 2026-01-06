import { fetchRazorpayKey, createCustomerApi } from "../api/checkout.api";

/* Get Razorpay Key */
export async function getRazorpayKey() {
  const res = await fetchRazorpayKey();
  return res.successData;
}

/* Create or update customer */
export async function createCustomer(customer: any) {
  const res = await createCustomerApi(customer);
  return res.successData;
}
