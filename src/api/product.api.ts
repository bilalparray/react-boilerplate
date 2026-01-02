import type { ProductDTO } from "../dto/productDTO";
import { apiGet } from "./base/apiClient";

export function fetchProduct(productId: number) {
  return apiGet<ProductDTO>(`/product/${productId}`);
}
