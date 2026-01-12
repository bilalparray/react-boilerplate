import type { Product } from "../../models/Product";
import { apiGet, apiPost, apiPut, apiDelete } from "../base/apiClient";

export const fetchProducts = (skip = 0, top = 20) =>
  apiGet<Product[]>(`/product/paginated?skip=${skip}&top=${top}`);

export const fetchProduct = (id: number) => apiGet(`/product/${id}`);

export const createProduct = (form: FormData) =>
  apiPost("/admin/product/createproduct", form);
export const getCount = () => apiGet<any>("/product/count");
export const updateProduct = (id: number, form: FormData) =>
  apiPut(`/admin/product/updateproductById/${id}`, form);

export const deleteProduct = (id: number) =>
  apiDelete(`/admin/product/deleteproductById/${id}`);

export const toggleBestSeller = (id: number, value: boolean) =>
  apiPut(`/admin/product/bestselling/state/${id}`, {
    reqData: { boolResponse: value },
  });

// Variants
export const getVariants = (productId: number) =>
  apiGet<any>(`/admin/product/${productId}/variants`);

export const addVariant = (productId: number, payload: any) =>
  apiPost(`/admin/product/${productId}/variants`, payload);

export const updateVariant = (
  productId: number,
  variantId: number,
  payload: any
) => apiPut(`/admin/product/${productId}/variants/${variantId}`, payload);

export const deleteVariant = (productId: number, variantId: number) =>
  apiDelete(`/admin/product/${productId}/variants/${variantId}`);
