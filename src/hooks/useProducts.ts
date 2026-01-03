import { useEffect, useState } from "react";
import { Product } from "../models/Product";
import {
  getPaginatedProducts,
  getProductCount,
} from "../services/ProductService";

export function useProducts(page: number, pageSize: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const skip = (page - 1) * pageSize;

  useEffect(() => {
    setLoading(true);

    Promise.all([getPaginatedProducts(skip, pageSize), getProductCount()])
      .then(([productsRes, count]) => {
        setProducts(productsRes.products);
        setTotal(count);
      })
      .finally(() => setLoading(false));
  }, [page, pageSize]);

  return { products, total, loading };
}
