import { useEffect, useState } from "react";
import type { Product } from "../models/Product";
import { getPaginatedProductsForGrid } from "../services/ProductService";

export function useProductsGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPaginatedProductsForGrid(0, 8).then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, []);

  return { products, loading };
}
