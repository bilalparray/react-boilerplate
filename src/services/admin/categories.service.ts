import {
  getCategories,
  getCategoryCount,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../../api/admin/categories.client";
import type { Category } from "../../dto/admin/categoryDTO";

export async function fetchCategories(
  skip: number,
  top: number
): Promise<Category[]> {
  const res = await getCategories(skip, top);
  return res.successData as Category[];
}

export async function fetchCategoryCount(): Promise<number> {
  const res = await getCategoryCount();
  const intResponse = (res?.successData ?? {}) as { intResponse: number };
  return intResponse.intResponse;
}

export function addCategory(formData: FormData) {
  return createCategory(formData);
}

export async function removeCategory(id: number) {
  const res = await deleteCategory(id);
  return res.successData;
}
export function editCategory(id: number, formData: FormData) {
  return updateCategory(id, formData);
}
