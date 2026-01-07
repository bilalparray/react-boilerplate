import { apiGet, apiPost, apiDelete, apiPut } from "../base/apiClient";

export function getCategories(skip: number, top: number) {
  return apiGet(`/categories/paginated?skip=${skip}&top=${top}`);
}

export function getCategoryCount() {
  return apiGet("/categories/count");
}

export function createCategory(payload: any) {
  return apiPost("admin/createcategory", {
    reqData: payload,
  });
}

export function deleteCategory(id: number) {
  return apiDelete(`/admin/deletecategoryById/${id}`);
}
export function updateCategory(id: number, payload: any) {
  const form = new FormData();
  form.append("reqData", JSON.stringify(payload));

  return apiPut(`/admin/updatecategoryById/${id}`, form);
}
