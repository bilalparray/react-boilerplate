import { fetchProductReviews } from "../api/review.api";

export async function getProductReviews(productId: number) {
  const res = await fetchProductReviews(productId);

  const reviews = res.successData || [];

  return {
    count: reviews.length,
    average:
      reviews.length === 0
        ? 0
        : reviews.reduce((s: any, r: { rating: any }) => s + r.rating, 0) /
          reviews.length,
  };
}
