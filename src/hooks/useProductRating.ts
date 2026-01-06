import { useEffect, useState } from "react";
import { fetchProductReviews } from "../api/review.api";

export function useProductRating(productId: number) {
  const [rating, setRating] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!productId) return;

    fetchProductReviews(productId).then((res) => {
      const reviews = res.successData || [];

      if (reviews.length === 0) {
        setRating(0);
        setCount(0);
        return;
      }

      const total = reviews.reduce(
        (sum: any, r: { rating: any }) => sum + r.rating,
        0
      );
      setRating(total / reviews.length);
      setCount(reviews.length);
    });
  }, [productId]);

  return { rating, count };
}
