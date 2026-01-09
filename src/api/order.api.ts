import { apiGet } from "./base/apiClient";

export function fetchOrdersByEmail(email: string, skip: number, top: number) {
  return apiGet<any>(
    `/order?skip=${skip}&top=${top}&customerEmail=${encodeURIComponent(email)}`
  );
}
