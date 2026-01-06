import { useCallback, useEffect, useState } from "react";
import type { ReviewDTO } from "../dto/reviewDTO";
import { getProductReviews } from "../services/reviewService";

export function useProductRating(productId: number) {
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [rating, setRating] = useState(0);
  const [count, setCount] = useState(0);

  const load = useCallback(() => {
    if (!productId) return;

    getProductReviews(productId).then((res) => {
      setReviews(res.reviews);
      setRating(res.average);
      setCount(res.count);
    });
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  return { reviews, rating, count, refresh: load };
}
