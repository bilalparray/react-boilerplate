import { apiGet, apiPost } from "./base/apiClient";

export function fetchProductReviews(productId: number) {
  return apiGet<any>(
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
