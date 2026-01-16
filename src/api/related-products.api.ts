import { apiGet } from "./base/apiClient";

export function fetchRelatedProducts(id: number) {
  return apiGet<any>(`
product/ByCategoryId/${id}/paginated?skip=0&top=4`);
}
