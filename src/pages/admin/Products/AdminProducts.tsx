import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteProduct,
  fetchProducts,
  toggleBestSeller,
  getCount,
} from "../../../api/admin/adminProduct.api";
import type { Product } from "../../../models/Product";
import { toast } from "react-toastify";
import "./AdminProducts.css";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const pageSize = 10;
  const navigate = useNavigate();

  const pages = Math.ceil(total / pageSize);

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

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setActionLoading(true);

    const resp = await deleteProduct(id);
    if (!resp.isError) {
      toast.success("Product deleted successfully");
    } else {
      toast.error(resp.errorData.displayMessage);
    }

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

    setActionLoading(false);
  };

  const handleBestSeller = async (id: number, value: boolean) => {
    setActionLoading(true);
    try {
      await toggleBestSeller(id, value);
      setProducts((p) =>
        p.map((x) => (x.id === id ? { ...x, isBestSelling: value } : x))
      );
      toast.success(
        `Product ${value ? "marked as" : "removed from"} best seller`
      );
    } catch (err) {
      toast.error("Failed to update best seller status");
    } finally {
      setActionLoading(false);
    }
  };

  const getMinPrice = (product: Product) => {
    if (!product.variants || product.variants.length === 0) return 0;
    return Math.min(...product.variants.map((v) => v.price));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="products-header">
        <div>
          <h2 className="products-title">Products Management</h2>
          <p className="products-subtitle">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="products-stats">
          <div className="stat-item">
            <span className="stat-label">Total Products</span>
            <span className="stat-value">{total}</span>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <button
          className="btn btn-primary btn-add"
          onClick={() => navigate("/products/create")}>
          <i className="bi bi-plus-circle-fill me-2"></i>
          Add New Product
        </button>
      </div>

      {/* Products Table - Desktop */}
      <div className="products-table-card">
        {loading ? (
          <div className="loading-state">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-box-seam empty-icon"></i>
            <h5 className="empty-title">No products found</h5>
            <p className="empty-text">
              Get started by creating your first product
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/products/create")}>
              <i className="bi bi-plus-circle me-1"></i>
              Create Product
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="table-responsive d-none d-md-block">
              <table className="table products-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Variants</th>
                    <th>Best Seller</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={p.id} className="product-row">
                      <td>
                        <div className="product-number">
                          {(page - 1) * pageSize + i + 1}
                        </div>
                      </td>
                      <td>
                        <div className="product-image-wrapper">
                          {p.images?.[0] ? (
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="product-image"
                            />
                          ) : (
                            <div className="product-image-placeholder">
                              <i className="bi bi-image"></i>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="product-name">{p.name}</div>
                        {p.description && (
                          <small className="text-muted d-block mt-1">
                            {p.description.length > 50
                              ? `${p.description.substring(0, 50)}...`
                              : p.description}
                          </small>
                        )}
                      </td>
                      <td>
                        <div className="product-category">
                          {p.category?.name || (
                            <span className="text-muted">No category</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="product-price">
                          {formatCurrency(getMinPrice(p))}
                        </div>
                        {p.variants.length > 1 && (
                          <small className="text-muted d-block">
                            {p.variants.length} variants
                          </small>
                        )}
                      </td>
                      <td>
                        <span className="variant-count-badge">
                          {p.variants?.length || 0}
                        </span>
                      </td>
                      <td>
                        <div className="best-seller-toggle">
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={p.isBestSelling || false}
                              onChange={(e) =>
                                handleBestSeller(p.id, e.target.checked)
                              }
                              disabled={actionLoading}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-edit"
                            onClick={() => navigate(`/products/edit/${p.id}`)}
                            disabled={actionLoading}>
                            <i className="bi bi-pencil-fill me-1"></i>
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-delete"
                            onClick={() => handleDelete(p.id)}
                            disabled={actionLoading}>
                            <i className="bi bi-trash-fill me-1"></i>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="products-mobile d-md-none">
              {products.map((p, i) => (
                <div key={p.id} className="product-card-mobile">
                  <div className="product-card-header-mobile">
                    <div className="product-card-image-name">
                      <div className="product-image-wrapper-mobile">
                        {p.images?.[0] ? (
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="product-image-mobile"
                          />
                        ) : (
                          <div className="product-image-placeholder-mobile">
                            <i className="bi bi-image"></i>
                          </div>
                        )}
                      </div>
                      <div className="product-info-mobile">
                        <div className="product-name-mobile">{p.name}</div>
                        <div className="product-number-mobile">
                          #{(page - 1) * pageSize + i + 1}
                        </div>
                      </div>
                    </div>
                    <span className="variant-count-badge-mobile">
                      {p.variants?.length || 0} variants
                    </span>
                  </div>

                  <div className="product-card-body">
                    {p.category && (
                      <div className="product-info-row">
                        <span className="info-label">
                          <i className="bi bi-tag me-1"></i>
                          Category
                        </span>
                        <span className="info-value">{p.category.name}</span>
                      </div>
                    )}

                    <div className="product-info-row">
                      <span className="info-label">
                        <i className="bi bi-currency-rupee me-1"></i>
                        Price
                      </span>
                      <span className="info-value price-value">
                        {formatCurrency(getMinPrice(p))}
                      </span>
                    </div>

                    {p.description && (
                      <div className="product-info-row">
                        <span className="info-label">
                          <i className="bi bi-text-paragraph me-1"></i>
                          Description
                        </span>
                      </div>
                    )}
                    {p.description && (
                      <div className="product-description-mobile">
                        {p.description}
                      </div>
                    )}

                    <div className="product-info-row">
                      <span className="info-label">
                        <i className="bi bi-star me-1"></i>
                        Best Seller
                      </span>
                      <div className="best-seller-toggle-mobile">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={p.isBestSelling || false}
                            onChange={(e) =>
                              handleBestSeller(p.id, e.target.checked)
                            }
                            disabled={actionLoading}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="product-card-footer">
                    <button
                      className="btn btn-outline-primary btn-sm flex-fill me-2"
                      onClick={() => navigate(`/products/edit/${p.id}`)}
                      disabled={actionLoading}>
                      <i className="bi bi-pencil-fill me-1"></i>
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm flex-fill"
                      onClick={() => handleDelete(p.id)}
                      disabled={actionLoading}>
                      <i className="bi bi-trash-fill me-1"></i>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <div className="pagination-wrapper">
            <div className="pagination-info">
              <span>
                Showing <strong>{(page - 1) * pageSize + 1}</strong> to{" "}
                <strong>{Math.min(page * pageSize, total)}</strong> of{" "}
                <strong>{total}</strong> products
              </span>
            </div>

            <div className="pagination-controls">
              <button
                className="btn btn-outline-secondary btn-pagination"
                disabled={page === 1 || loading}
                onClick={() => setPage(page - 1)}>
                <i className="bi bi-chevron-left"></i>
                Previous
              </button>

              <div className="page-numbers">
                {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                  let pageNum;
                  if (pages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= pages - 2) {
                    pageNum = pages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      className={`btn btn-pagination-number ${
                        pageNum === page
                          ? "btn-primary active"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() => setPage(pageNum)}
                      disabled={loading}>
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                className="btn btn-outline-secondary btn-pagination"
                disabled={page >= pages || loading}
                onClick={() => setPage(page + 1)}>
                Next
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
