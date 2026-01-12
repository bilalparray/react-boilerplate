import type { Product } from "../../models/Product";
import { apiGet, apiPost, apiPut, apiDelete } from "../base/apiClient";

export const fetchProducts = (skip = 0, top = 20) =>
  apiGet<Product[]>(`/product/paginated?skip=${skip}&top=${top}`, true);

export const fetchProduct = (id: number) => apiGet(`/product/${id}`, true);

export const createProduct = (form: FormData) =>
  apiPost("/admin/product/createproduct", form, true);
export const getCount = () => apiGet<any>("/product/count", true);
export const updateProduct = (id: number, form: FormData) =>
  apiPut(`/admin/product/updateproductById/${id}`, form, true);

export const deleteProduct = (id: number) =>
  apiDelete(`/admin/product/deleteproductById/${id}`, true);

export const toggleBestSeller = (id: number, value: boolean) =>
  apiPut(
    `/admin/product/bestselling/state/${id}`,
    {
      reqData: { boolResponse: value },
    },
    true
  );

// Variants
export const getVariants = (productId: number) =>
  apiGet<any>(`/admin/product/${productId}/variants`, true);

export const addVariant = (productId: number, payload: any) =>
  apiPost(`/admin/product/${productId}/variants`, payload, true);

export const updateVariant = (
  productId: number,
  variantId: number,
  payload: any
) => apiPut(`/admin/product/${productId}/variants/${variantId}`, payload, true);

export const deleteVariant = (productId: number, variantId: number) =>
  apiDelete(`/admin/product/${productId}/variants/${variantId}`, true);
