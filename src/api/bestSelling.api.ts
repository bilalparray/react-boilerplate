import { apiGet } from "./base/apiClient";

export function fetchBestSellingProducts() {
  return apiGet<any>(`
product/isBestSelling`);
}
