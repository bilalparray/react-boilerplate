import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  deleteProduct,
  fetchProducts,
  toggleBestSeller,
  getCount,
} from "../../../api/admin/adminProduct.api";
import type { Product } from "../../../models/Product";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const pageSize = 5;
  const navigate = useNavigate();

  /* Load product count once */
  useEffect(() => {
    getCount().then((res) => {
      if (!res.isError && res.successData) {
        setTotal(res.successData.intResponse);
      }
    });
  }, []);

  /* Load products when page changes */
  useEffect(() => {
    const skip = (page - 1) * pageSize;

    setLoading(true);

    fetchProducts(skip, pageSize)
      .then((res) => {
        if (!res.isError && res.successData) {
          setProducts(res.successData);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

  const totalPages = Math.ceil(total / pageSize);

  const handleDelete = async (id: number) => {
    setLoading(true);

    await deleteProduct(id);

    setTotal((t) => {
      const newTotal = t - 1;
      const maxPage = Math.max(1, Math.ceil(newTotal / pageSize));

      if (page > maxPage) {
        setPage(maxPage);
      }

      return newTotal;
    });

    const skip = (page - 1) * pageSize;
    const res = await fetchProducts(skip, pageSize);
    if (!res.isError && res.successData) {
      setProducts(res.successData);
    }

    setLoading(false);
  };

  const handleBestSeller = async (id: number, value: boolean) => {
    setLoading(true);
    await toggleBestSeller(id, value);

    setProducts((p) =>
      p.map((x) => (x.id === id ? { ...x, isBestSelling: value } : x))
    );

    setLoading(false);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-4">
        <h4>Products</h4>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/products/create")}>
          + Add Product
        </button>
      </div>

      <table className="table table-bordered align-middle">
        {loading && (
          <div className="p-5 text-center position-absolute w-75 h-100 bg-light">
            <div className="spinner-border text-primary" />
          </div>
        )}
        <thead className="table-light">
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Best Seller</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                {p.images?.[0] && (
                  <img
                    src={p.images[0]}
                    style={{ width: 60, height: 60, objectFit: "cover" }}
                    className="rounded"
                  />
                )}
              </td>

              <td>{p.name}</td>
              <td>{p.category?.name || "-"}</td>

              <td>
                ₹
                {p.variants.length
                  ? Math.min(...p.variants.map((v) => v.price))
                  : 0}
              </td>

              <td>
                <input
                  type="checkbox"
                  checked={p.isBestSelling}
                  onChange={(e) => handleBestSeller(p.id, e.target.checked)}
                />
              </td>

              <td>
                <button
                  onClick={() => navigate(`/products/edit/${p.id}`)}
                  className="btn btn-sm btn-outline-primary me-2">
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p.id)}
                  className="btn btn-sm btn-outline-danger">
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center text-muted py-4">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div>
            Page {page} of {totalPages}
          </div>

          <div className="btn-group">
            <button
              className="btn btn-outline-secondary"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}>
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  className={`btn ${
                    p === page ? "btn-primary" : "btn-outline-secondary"
                  }`}
                  onClick={() => setPage(p)}>
                  {p}
                </button>
              );
            })}

            <button
              className="btn btn-outline-secondary"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
