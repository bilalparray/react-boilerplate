import { apiGet, apiPost, apiDelete, apiPut } from "../base/apiClient";

export function getCategories(skip: number, top: number) {
  return apiGet(`/categories/paginated?skip=${skip}&top=${top}`);
}

export function getCategoryCount() {
  return apiGet("/categories/count");
}

export function createCategory(payload: any) {
  return apiPost("admin/createcategory", payload, true);
}

export function deleteCategory(id: number) {
  return apiDelete(`/admin/deletecategoryById/${id}`);
}
export function updateCategory(id: number, formData: FormData) {
  return apiPut(`/admin/updatecategoryById/${id}`, formData, true);
}
