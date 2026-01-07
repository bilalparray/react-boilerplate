import { useProductsGrid } from "../../../hooks/useProudctsGrid";
import { ProductCard } from "../ProductCard";

export function ProductsGrid() {
  const { products, loading } = useProductsGrid();

  if (loading) return null;

  return (
    <section className="container py-5">
      <h2 className="fw-bold mb-4">Products</h2>

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
