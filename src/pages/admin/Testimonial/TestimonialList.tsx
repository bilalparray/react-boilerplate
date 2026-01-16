import { useState } from "react";
import { useTestimonials } from "../../../hooks/admin/useTestimonials";
import { toast } from "react-toastify";
import "./TestimonialList.css";

export default function TestimonialList() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const {
    items,
    total,
    loading,
    actionLoading,
    error,
    create,
    update,
    remove,
  } = useTestimonials(page, pageSize);

  const pages = Math.ceil(total / pageSize);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    rating: 5,
  });

  const [emailError, setEmailError] = useState<string | null>(null);

  /* ---------------- VALIDATION ---------------- */

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (!form.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!isValidEmail(form.email)) {
      setEmailError("Enter a valid email address");
      toast.error("Enter a valid email address");
      return false;
    }

    if (!form.message.trim()) {
      toast.error("Message is required");
      return false;
    }

    setEmailError(null);
    return true;
  };

  /* ---------------- OPEN ---------------- */

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", email: "", message: "", rating: 5 });
    setEmailError(null);
    setShowModal(true);
  };

  const openEdit = (t: any) => {
    setEditing(t);
    setForm({
      name: t.name,
      email: t.email,
      message: t.message,
      rating: t.rating,
    });
    setEmailError(null);
    setShowModal(true);
  };

  /* ---------------- SAVE ---------------- */

  const save = async () => {
    if (!validate()) return;

    try {
      if (editing) {
        await update(editing.id, form);
        if (!error) {
          toast.success("Testimonial updated successfully");
          setShowModal(false);
        }
      } else {
        await create(form);
        if (!error) {
          toast.success("Testimonial created successfully");
          setShowModal(false);
        }
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const deleteRow = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    try {
      await remove(id);
      if (!error) {
        toast.success("Testimonial deleted successfully");
      }
    } catch (err) {
      toast.error("Failed to delete testimonial");
    }
  };

  const getRatingBadgeClass = (rating: number) => {
    if (rating >= 4) return "rating-high";
    if (rating >= 3) return "rating-medium";
    return "rating-low";
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`bi ${
          i < rating ? "bi-star-fill" : "bi-star"
        } rating-star`}></i>
    ));
  };

  return (
    <div className="testimonials-page">
      {/* Page Header */}
      <div className="testimonials-header">
        <div>
          <h2 className="testimonials-title">Testimonials Management</h2>
          <p className="testimonials-subtitle">
            Manage customer testimonials and reviews
          </p>
        </div>
        <div className="testimonials-stats">
          <div className="stat-item">
            <span className="stat-label">Total Testimonials</span>
            <span className="stat-value">{total}</span>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <button className="btn btn-primary btn-add" onClick={openCreate}>
          <i className="bi bi-plus-circle-fill me-2"></i>
          Add New Testimonial
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* Testimonials Table - Desktop */}
      <div className="testimonials-table-card">
        {loading ? (
          <div className="loading-state">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading testimonials...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-chat-quote empty-icon"></i>
            <h5 className="empty-title">No testimonials found</h5>
            <p className="empty-text">
              Get started by creating your first testimonial
            </p>
            <button className="btn btn-primary" onClick={openCreate}>
              <i className="bi bi-plus-circle me-1"></i>
              Create Testimonial
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="table-responsive d-none d-md-block">
              <table className="table testimonials-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Rating</th>
                    <th>Message</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((t, i) => (
                    <tr key={t.id} className="testimonial-row">
                      <td>
                        <div className="testimonial-number">
                          {(page - 1) * pageSize + i + 1}
                        </div>
                      </td>
                      <td>
                        <div className="testimonial-name">
                          <i className="bi bi-person-circle me-2"></i>
                          {t.name}
                        </div>
                      </td>
                      <td>
                        <div className="testimonial-email">
                          <i className="bi bi-envelope me-2"></i>
                          {t.email}
                        </div>
                      </td>
                      <td>
                        <div
                          className={`rating-badge ${getRatingBadgeClass(
                            t.rating
                          )}`}>
                          <div className="rating-stars">
                            {renderStars(t.rating)}
                          </div>
                          <span className="rating-value">{t.rating}/5</span>
                        </div>
                      </td>
                      <td>
                        <div className="testimonial-message">
                          {t.message || (
                            <span className="text-muted">No message</span>
                          )}
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-edit"
                            onClick={() => openEdit(t)}
                            disabled={actionLoading}>
                            <i className="bi bi-pencil-fill me-1"></i>
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-delete"
                            onClick={() => deleteRow(t.id)}
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
            <div className="testimonials-mobile d-md-none">
              {items.map((t, i) => (
                <div key={t.id} className="testimonial-card-mobile">
                  <div className="testimonial-card-header">
                    <div className="testimonial-card-name-email">
                      <div className="testimonial-name-mobile">
                        <i className="bi bi-person-circle me-2"></i>
                        {t.name}
                      </div>
                      <div className="testimonial-number-mobile">
                        #{(page - 1) * pageSize + i + 1}
                      </div>
                    </div>
                    <div
                      className={`rating-badge-mobile ${getRatingBadgeClass(
                        t.rating
                      )}`}>
                      <div className="rating-stars-mobile">
                        {renderStars(t.rating)}
                      </div>
                      <span className="rating-value-mobile">{t.rating}/5</span>
                    </div>
                  </div>

                  <div className="testimonial-card-body">
                    <div className="testimonial-info-row">
                      <span className="info-label">
                        <i className="bi bi-envelope me-1"></i>
                        Email
                      </span>
                      <span className="info-value">{t.email}</span>
                    </div>

                    <div className="testimonial-info-row">
                      <span className="info-label">
                        <i className="bi bi-chat-quote me-1"></i>
                        Message
                      </span>
                    </div>
                    <div className="testimonial-message-mobile">
                      {t.message || (
                        <span className="text-muted">No message</span>
                      )}
                    </div>
                  </div>

                  <div className="testimonial-card-footer">
                    <button
                      className="btn btn-outline-primary btn-sm flex-fill me-2"
                      onClick={() => openEdit(t)}
                      disabled={actionLoading}>
                      <i className="bi bi-pencil-fill me-1"></i>
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm flex-fill"
                      onClick={() => deleteRow(t.id)}
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
        {!loading && items.length > 0 && (
          <div className="pagination-wrapper">
            <div className="pagination-info">
              <span>
                Showing <strong>{(page - 1) * pageSize + 1}</strong> to{" "}
                <strong>{Math.min(page * pageSize, total)}</strong> of{" "}
                <strong>{total}</strong> testimonials
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
                <i className="bi bi-chat-quote-fill me-2"></i>
                {editing ? "Edit Testimonial" : "Create New Testimonial"}
              </h5>
              <button
                className="btn-close-custom"
                onClick={() => !actionLoading && setShowModal(false)}
                disabled={actionLoading}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body-custom">
              {/* Name */}
              <div className="form-group">
                <label className="form-label-custom">
                  <i className="bi bi-person-fill me-1"></i>
                  Customer Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-control-custom"
                  placeholder="Enter customer name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={actionLoading}
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label-custom">
                  <i className="bi bi-envelope-fill me-1"></i>
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  className={`form-control-custom ${
                    emailError ? "is-invalid" : ""
                  }`}
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    setEmailError(null);
                  }}
                  disabled={actionLoading}
                />
                {emailError && (
                  <div className="form-error-message">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {emailError}
                  </div>
                )}
              </div>

              {/* Rating & Message Row */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label-custom">
                    <i className="bi bi-star-fill me-1"></i>
                    Rating <span className="required">*</span>
                  </label>
                  <select
                    className="form-control-custom"
                    value={form.rating}
                    onChange={(e) =>
                      setForm({ ...form, rating: Number(e.target.value) })
                    }
                    disabled={actionLoading}>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {r} {r === 1 ? "Star" : "Stars"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="form-group">
                <label className="form-label-custom">
                  <i className="bi bi-chat-left-text-fill me-1"></i>
                  Testimonial Message <span className="required">*</span>
                </label>
                <textarea
                  className="form-control-custom"
                  placeholder="Enter testimonial message"
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  disabled={actionLoading}
                />
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
                onClick={save}
                disabled={
                  actionLoading ||
                  !form.name.trim() ||
                  !form.email.trim() ||
                  !form.message.trim()
                }>
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
                    {editing ? "Update Testimonial" : "Create Testimonial"}
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
