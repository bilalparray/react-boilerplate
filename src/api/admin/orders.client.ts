import { apiGet, apiPut } from "../base/apiClient";

export function getOrders(query: string) {
  return apiGet<any>(`/order?${query}`);
}

export function getOrder(id: number) {
  return apiGet<any>(`/order/${id}`);
}

export function getCustomers() {
  return apiGet<any>(`/customer/getall/paginated?skip=0&top=1000`);
}

export function setOrderStatus(orderId: number, status: string) {
  return apiPut(`/order/${orderId}/status`, { status });
}
