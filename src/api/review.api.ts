import type { ReviewDTO } from "../dto/reviewDTO";
import { apiGet, apiPost } from "./base/apiClient";

export function fetchProductReviews(productId: number) {
  return apiGet<ReviewDTO[]>(
    `/review/GetAllPaginatedProductReviewsByProductId/${productId}`
  );
}

export function createProductReview(payload: {
  name: string;
  email: string;
  rating: number;
  comment: string;
  productId: number;
}) {
  return apiPost(
    `/review/CreateProductReviewByProductId/${payload.productId}`,
    {
      reqData: payload,
    }
  );
}
