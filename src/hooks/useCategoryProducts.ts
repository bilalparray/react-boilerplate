import { useEffect, useState } from "react";
import { Product } from "../models/Product";
import { getCategoryProducts } from "../services/CategoryProductService";

export function useCategoryProducts(
  categoryId: number,
  page: number,
  pageSize: number
) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const skip = (page - 1) * pageSize;

  useEffect(() => {
    setLoading(true);

    getCategoryProducts(categoryId, skip, pageSize)
      .then((res) => {
        setProducts(res.products);
        setTotal(res.total);
      })
      .finally(() => setLoading(false));
  }, [categoryId, page, pageSize]);

  return { products, total, loading };
}
