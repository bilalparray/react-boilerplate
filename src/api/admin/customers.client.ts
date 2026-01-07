import { apiGet, apiDelete } from "../base/apiClient";

export function getCustomers(params: {
  skip: number;
  top: number;
  search?: string;
}) {
  const q = new URLSearchParams();
  q.append("skip", String(params.skip));
  q.append("top", String(params.top));
  if (params.search) q.append("search", params.search);

  return apiGet<any>(`/customer/getall/paginated?${q.toString()}`);
}

export function deleteCustomer(customerId: number) {
  return apiDelete(`/customer/delete/${customerId}`);
}
