import { useBestSellingProducts } from "../hooks/useBestSellingProducts";
import { ProductCard } from "./ProductCard";

export function BestSelling() {
  const { products, loading } = useBestSellingProducts();

  if (loading) return null;

  return (
    <section className="container py-5">
      <h2 className="fw-bold mb-4">Best Sellers</h2>

      <div className="row g-4">
        {products.map((p) => (
          <div key={p.id} className="col-md-3">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
