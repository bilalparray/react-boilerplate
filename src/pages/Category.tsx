import { useParams } from "react-router-dom";
import { useState } from "react";
import { useCategoryProducts } from "../hooks/useCategoryProducts";
import { ProductCard } from "../components/Product/ProductCard";

export default function CategoryPage() {
  const { categoryId } = useParams();
  const id = Number(categoryId);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const { products, total, loading } = useCategoryProducts(id, page, pageSize);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4">Category</h3>

      <div className="d-flex justify-content-end mb-4">
        <select
          className="form-select"
          style={{ width: "140px" }}
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}>
          <option value={12}>12 / page</option>
          <option value={24}>24 / page</option>
          <option value={48}>48 / page</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-5">Loading…</div>
      ) : (
        <div className="row g-4">
          {products.map((p) => (
            <div className="col-lg-3 col-md-4 col-sm-6" key={p.id}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}

      <div className="d-flex justify-content-center gap-2 mt-5">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`btn ${
              page === i + 1 ? "btn-success" : "btn-outline-secondary"
            }`}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
