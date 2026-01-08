import { useState } from "react";
import { useTestimonials } from "../../../hooks/admin/useTestimonials";

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

  const totalPages = Math.ceil(total / pageSize);

  const [show, setShow] = useState(false);
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
    if (!isValidEmail(form.email)) {
      setEmailError("Enter a valid email address");
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
    setShow(true);
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
    setShow(true);
  };

  /* ---------------- SAVE ---------------- */

  const save = async () => {
    if (!validate()) return;

    if (editing) await update(editing.id, form);
    else await create(form);

    if (!error) setShow(false);
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Testimonials</h3>
        <button className="btn btn-success" onClick={openCreate}>
          + Add New
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">Loading…</div>
      ) : (
        <table className="table table-hover align-middle shadow-sm">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Rating</th>
              <th>Message</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((t, i) => (
              <tr key={t.id}>
                <td>{i + 1}</td>
                <td className="fw-semibold">{t.name}</td>
                <td>{t.email}</td>
                <td>
                  <span className="badge bg-warning text-dark">
                    {t.rating} ★
                  </span>
                </td>
                <td style={{ maxWidth: 400 }} className="text-muted">
                  {t.message}
                </td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => openEdit(t)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    disabled={actionLoading}
                    onClick={() => remove(t.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-center gap-2 mt-4">
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

      {/* Modal */}
      {show && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-bottom-0 pb-2">
                <h6 className="fw-bold">
                  {editing ? "Edit Testimonial" : "Add Testimonial"}
                </h6>
                <button className="btn-close" onClick={() => setShow(false)} />
              </div>

              <div className="modal-body pt-0">
                <label className="form-label small fw-semibold">Name</label>
                <input
                  className="form-control mb-2"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <label className="form-label small fw-semibold">Email</label>
                <input
                  className={`form-control mb-1 ${
                    emailError ? "is-invalid" : ""
                  }`}
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    setEmailError(null);
                  }}
                />
                {emailError && (
                  <div className="text-danger small mb-2">{emailError}</div>
                )}

                <label className="form-label small fw-semibold">Rating</label>
                <select
                  className="form-select mb-2"
                  value={form.rating}
                  onChange={(e) =>
                    setForm({ ...form, rating: Number(e.target.value) })
                  }>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>

                <label className="form-label small fw-semibold">Message</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                />
              </div>

              <div className="modal-footer border-top-0 pt-2">
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => setShow(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-success btn-sm"
                  disabled={actionLoading}
                  onClick={save}>
                  {actionLoading ? "Saving…" : editing ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
