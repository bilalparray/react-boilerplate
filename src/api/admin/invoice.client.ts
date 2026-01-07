import { apiGet } from "../base/apiClient";

export function getInvoices(query: string) {
  return apiGet<any>(`/invoice?${query}`);
}

export function getInvoiceByOrder(orderId: number) {
  return apiGet<any>(`/invoice/order/${orderId}`);
}

export function getInvoiceByRazorpay(invoiceNumber: string) {
  return apiGet<any>(`/invoice/${invoiceNumber}`);
}
