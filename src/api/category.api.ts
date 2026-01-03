import { apiGet } from "./base/apiClient";

export function fetchCategories(skip = 0, top = 20) {
  return apiGet<any>(`/categories/paginated?skip=${skip}&top=${top}`);
}
