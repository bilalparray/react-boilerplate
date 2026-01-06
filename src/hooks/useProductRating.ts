import { useEffect, useState, useCallback } from "react";
import { getProductReviews } from "../services/reviewService";

export function useProductRating(productId: number) {
  const [rating, setRating] = useState(0);
  const [count, setCount] = useState(0);

  const load = useCallback(() => {
    if (!productId) return;

    getProductReviews(productId).then((res) => {
      setRating(res.average);
      setCount(res.count);
    });
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  return { rating, count, refresh: load };
}
