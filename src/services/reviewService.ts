import { createProductReview, fetchProductReviews } from "../api/review.api";

export async function getProductReviews(productId: number) {
  const res = await fetchProductReviews(productId);
  const reviews = res.successData || [];

  return {
    reviews,
    count: reviews.length,
    average:
      reviews.length === 0
        ? 0
        : reviews.reduce((s, r) => s + r.rating, 0) / reviews.length,
  };
}

export async function submitProductReview(data: {
  name: string;
  email: string;
  rating: number;
  comment: string;
  productId: number;
}) {
  return await createProductReview(data);
}
