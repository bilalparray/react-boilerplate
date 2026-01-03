import type { ProductDTO } from "../dto/productDTO";
import { apiGet } from "./base/apiClient";

export function fetchProduct(productId: number) {
  return apiGet<ProductDTO>(`/product/${productId}`);
}
export function fetchPaginatedProducts(skip: number, top: number) {
  return apiGet<any>(`/product/paginated?skip=${skip}&top=${top}`);
}
export function fetchProductCount() {
  return apiGet<any>("/product/count");
}
