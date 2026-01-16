import { useEffect, useState } from "react";
import { Product } from "../models/Product";
import { getRelatedProducts } from "../services/ProductService";

export function useRelatedProduct(productId: number) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getRelatedProducts(productId)
      .then((res) => {
        setRelatedProducts(res);
      })
      .catch(() => {
        setError("Failed to load related products");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  return { relatedProducts, loading, error };
}
