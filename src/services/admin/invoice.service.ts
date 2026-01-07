import { apiGet } from "../../api/base/apiClient";

export function fetchInvoices(params: {
  skip: number;
  top: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}) {
  const q = new URLSearchParams();

  q.append("skip", String(params.skip));
  q.append("top", String(params.top));

  if (params.startDate) q.append("startDate", params.startDate);
  if (params.endDate) q.append("endDate", params.endDate);
  if (params.status) q.append("status", params.status);

  return apiGet<any>(`/invoice?${q.toString()}`);
}

export function fetchInvoiceByOrder(orderId: number) {
  return apiGet<any>(`/invoice/order/${orderId}`);
}

export function fetchInvoiceByRazorpay(invoiceNumber: string) {
  return apiGet<any>(`/invoice/${invoiceNumber}`);
}
