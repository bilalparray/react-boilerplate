import { useEffect, useState } from "react";
import { Product } from "../models/Product";
import { getProduct } from "../services/ProductService";

export function useProduct(productId: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(productId)
      .then((p) => {
        setProduct(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  return { product, loading };
}
