import { apiGet } from "./base/apiClient";

export function fetchCategories() {
  return apiGet<any>(`
/categories/paginated?skip=0&top=40`);
}
