import { useEffect, useState } from "react";
import type { Product } from "../models/Product";
import { getBestSellingProducts } from "../services/ProductService";

export function useBestSellingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBestSellingProducts().then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, []);

  return { products, loading };
}
