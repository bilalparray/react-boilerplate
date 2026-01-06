import { apiGet } from "./base/apiClient";

export function fetchProductReviews(productId: number) {
  return apiGet<any>(
    `/review/GetAllPaginatedProductReviewsByProductId/${productId}`
  );
}
