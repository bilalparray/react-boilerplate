import { useEffect, useState } from "react";
import {
  fetchCategories,
  fetchCategoryCount,
  addCategory,
  editCategory,
  removeCategory,
} from "../../../services/admin/categories.service";
import type { Category } from "../../../dto/admin/categoryDTO";
import { toast } from "react-toastify";
import "./CategoriesPage.css";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    slider: false,
    sequence: 0,
    status: "active",
    category_icon: null as File | null,
  });

  const pages = Math.ceil(total / pageSize);

  const load = async () => {
    setLoading(true);
    const skip = (page - 1) * pageSize;
    const data = await fetchCategories(skip, pageSize);
    const count = await fetchCategoryCount();
    setCategories(data);
    setTotal(count);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const openCreate = () => {
    setEditing(null);
    setImagePreview(null);
    setForm({
      name: "",
      description: "",
      slider: false,
      sequence: 0,
      status: "active",
      category_icon: null,
    });
    setShowModal(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setImagePreview(c.category_icon_base64 || null);
    setForm({
      name: c.name,
      description: c.description,
      slider: c.slider,
      sequence: c.sequence,
      status: c.status,
      category_icon: null,
    });
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, category_icon: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submit = async () => {
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setActionLoading(true);

    const reqData = {
      name: form.name,
      description: form.description,
      slider: form.slider,
      sequence: form.sequence,
      status: form.status,
    };

    const formData = new FormData();
    formData.append("reqData", JSON.stringify(reqData));

    if (form.category_icon) {
      formData.append("category_icon", form.category_icon);
    }

    try {
      if (editing) {
        const res = await editCategory(editing.id, formData);
        if (!res.isError) {
          toast.success("Category updated successfully");
          setShowModal(false);
          setPage(1);
          load();
        } else {
          toast.error(res.errorData.displayMessage);
        }
      } else {
        const res = await addCategory(formData);
        if (!res.isError) {
          toast.success("Category created successfully");
          setShowModal(false);
          setPage(1);
          load();
        } else {
          toast.error(res.errorData.displayMessage);
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteRow = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    setActionLoading(true);
    try {
      await removeCategory(id);
      toast.success("Category deleted successfully");
      setPage(1);
      load();
    } catch (error) {
      toast.error("Failed to delete category");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    return status === "active" ? "status-active" : "status-inactive";
  };

  return (
    <div className="categories-page">
      {/* Page Header */}
      <div className="categories-header">
        <div>
          <h2 className="categories-title">Categories Management</h2>
          <p className="categories-subtitle">
            Organize your products into categories
          </p>
        </div>
        <div className="categories-stats">
          <div className="stat-item">
            <span className="stat-label">Total Categories</span>
            <span className="stat-value">{total}</span>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <button className="btn btn-primary btn-add" onClick={openCreate}>
          <i className="bi bi-plus-circle-fill me-2"></i>
          Add New Category
        </button>
      </div>

      {/* Categories Table - Desktop */}
      <div className="categories-table-card">
        {loading ? (
          <div className="loading-state">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-folder-x empty-icon"></i>
            <h5 className="empty-title">No categories found</h5>
            <p className="empty-text">
              Get started by creating your first category
            </p>
            <button className="btn btn-primary" onClick={openCreate}>
              <i className="bi bi-plus-circle me-1"></i>
              Create Category
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="table-responsive d-none d-md-block">
              <table className="table categories-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Icon</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Sequence</th>
                    <th>Status</th>
                    <th>Slider</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c, i) => (
                    <tr key={c.id} className="category-row">
                      <td>
                        <div className="category-number">
                          {(page - 1) * pageSize + i + 1}
                        </div>
                      </td>
                      <td>
                        <div className="category-icon-wrapper">
                          {c.category_icon_base64 ? (
                            <img
                              src={c.category_icon_base64}
                              alt={c.name}
                              className="category-icon"
                            />
                          ) : (
                            <div className="category-icon-placeholder">
                              <i className="bi bi-image"></i>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="category-name">{c.name}</div>
                      </td>
                      <td>
                        <div className="category-description">
                          {c.description || (
                            <span className="text-muted">No description</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="category-sequence">
                          <span className="sequence-badge">{c.sequence}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${getStatusBadgeClass(
                            c.status
                          )}`}>
                          {c.status === "active" ? (
                            <i className="bi bi-check-circle-fill me-1"></i>
                          ) : (
                            <i className="bi bi-x-circle-fill me-1"></i>
                          )}
                          {c.status}
                        </span>
                      </td>
                      <td>
                        {c.slider ? (
                          <span className="slider-badge slider-active">
                            <i className="bi bi-check-circle-fill me-1"></i>
                            Yes
                          </span>
                        ) : (
                          <span className="slider-badge slider-inactive">
                            <i className="bi bi-x-circle me-1"></i>
                            No
                          </span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-edit"
                            onClick={() => openEdit(c)}
                            disabled={actionLoading}>
                            <i className="bi bi-pencil-fill me-1"></i>
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-delete"
                            onClick={() => deleteRow(c.id)}
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
            <div className="categories-mobile d-md-none">
              {categories.map((c, i) => (
                <div key={c.id} className="category-card-mobile">
                  <div className="category-card-header">
                    <div className="category-card-icon-name">
                      {c.category_icon_base64 ? (
                        <img
                          src={c.category_icon_base64}
                          alt={c.name}
                          className="category-icon-mobile"
                        />
                      ) : (
                        <div className="category-icon-placeholder-mobile">
                          <i className="bi bi-image"></i>
                        </div>
                      )}
                      <div>
                        <div className="category-name-mobile">{c.name}</div>
                        <div className="category-number-mobile">
                          #{(page - 1) * pageSize + i + 1}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`status-badge-mobile ${getStatusBadgeClass(
                        c.status
                      )}`}>
                      {c.status === "active" ? (
                        <i className="bi bi-check-circle-fill me-1"></i>
                      ) : (
                        <i className="bi bi-x-circle-fill me-1"></i>
                      )}
                      {c.status}
                    </span>
                  </div>

                  <div className="category-card-body">
                    {c.description && (
                      <div className="category-info-row">
                        <span className="info-label">Description</span>
                        <span className="info-value">{c.description}</span>
                      </div>
                    )}

                    <div className="category-info-row">
                      <span className="info-label">
                        <i className="bi bi-sort-numeric-down me-1"></i>
                        Sequence
                      </span>
                      <span className="sequence-badge-mobile">{c.sequence}</span>
                    </div>

                    <div className="category-info-row">
                      <span className="info-label">
                        <i className="bi bi-sliders me-1"></i>
                        Show in Slider
                      </span>
                      {c.slider ? (
                        <span className="slider-badge-mobile slider-active">
                          <i className="bi bi-check-circle-fill me-1"></i>
                          Yes
                        </span>
                      ) : (
                        <span className="slider-badge-mobile slider-inactive">
                          <i className="bi bi-x-circle me-1"></i>
                          No
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="category-card-footer">
                    <button
                      className="btn btn-outline-primary btn-sm flex-fill me-2"
                      onClick={() => openEdit(c)}
                      disabled={actionLoading}>
                      <i className="bi bi-pencil-fill me-1"></i>
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm flex-fill"
                      onClick={() => deleteRow(c.id)}
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
        {!loading && categories.length > 0 && (
          <div className="pagination-wrapper">
            <div className="pagination-info">
              <span>
                Showing <strong>{(page - 1) * pageSize + 1}</strong> to{" "}
                <strong>{Math.min(page * pageSize, total)}</strong> of{" "}
                <strong>{total}</strong> categories
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

      {/* Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => !actionLoading && setShowModal(false)}>
          <div
            className="modal-content-custom"
            onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h5 className="modal-title-custom">
                <i className="bi bi-folder-fill me-2"></i>
                {editing ? "Edit Category" : "Create New Category"}
              </h5>
              <button
                className="btn-close-custom"
                onClick={() => !actionLoading && setShowModal(false)}
                disabled={actionLoading}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body-custom">
              {/* Image Preview */}
              <div className="form-group-image">
                <label className="form-label-custom">
                  <i className="bi bi-image me-1"></i>
                  Category Icon
                </label>
                <div className="image-upload-wrapper">
                  {imagePreview ? (
                    <div className="image-preview-container">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="image-preview"
                      />
                      <button
                        type="button"
                        className="btn-remove-image"
                        onClick={() => {
                          setImagePreview(null);
                          setForm({ ...form, category_icon: null });
                        }}>
                        <i className="bi bi-x-circle-fill"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="image-upload-placeholder">
                      <i className="bi bi-cloud-upload"></i>
                      <p>Click to upload or drag and drop</p>
                      <small>PNG, JPG up to 5MB</small>
                    </div>
                  )}
                  <input
                    type="file"
                    className="image-input"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={actionLoading}
                  />
                </div>
              </div>

              {/* Name */}
              <div className="form-group">
                <label className="form-label-custom">
                  <i className="bi bi-tag-fill me-1"></i>
                  Category Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-control-custom"
                  placeholder="Enter category name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={actionLoading}
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label-custom">
                  <i className="bi bi-text-paragraph me-1"></i>
                  Description
                </label>
                <textarea
                  className="form-control-custom"
                  placeholder="Enter category description"
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  disabled={actionLoading}
                />
              </div>

              {/* Sequence & Status Row */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label-custom">
                    <i className="bi bi-sort-numeric-down me-1"></i>
                    Display Sequence
                  </label>
                  <input
                    type="number"
                    className="form-control-custom"
                    placeholder="0"
                    min="0"
                    value={form.sequence === 0 ? "" : form.sequence}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm({
                        ...form,
                        sequence: val === "" ? 0 : Number(val),
                      });
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "+" ||
                        e.key === "-" ||
                        e.key === "."
                      ) {
                        e.preventDefault();
                      }
                    }}
                    disabled={actionLoading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label-custom">
                    <i className="bi bi-toggle-on me-1"></i>
                    Status
                  </label>
                  <select
                    className="form-control-custom"
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    disabled={actionLoading}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Slider Toggle */}
              <div className="form-group-checkbox">
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    className="form-check-input-custom"
                    id="sliderToggle"
                    checked={form.slider}
                    onChange={(e) =>
                      setForm({ ...form, slider: e.target.checked })
                    }
                    disabled={actionLoading}
                  />
                  <label
                    className="form-check-label-custom"
                    htmlFor="sliderToggle">
                    <i className="bi bi-sliders me-2"></i>
                    Show in slider on homepage
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer-custom">
              <button
                className="btn btn-secondary btn-cancel"
                onClick={() => setShowModal(false)}
                disabled={actionLoading}>
                Cancel
              </button>
              <button
                className="btn btn-primary btn-save"
                onClick={submit}
                disabled={actionLoading || !form.name.trim()}>
                {actionLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"></span>
                    {editing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-1"></i>
                    {editing ? "Update Category" : "Create Category"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
