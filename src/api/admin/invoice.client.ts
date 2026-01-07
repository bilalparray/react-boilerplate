import { apiGet } from "../base/apiClient";

export function getInvoiceByOrder(orderId: number) {
  return apiGet<any>(`/invoice/order/${orderId}`);
}
