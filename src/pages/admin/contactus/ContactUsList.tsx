import { useState } from "react";
import { useContactUs } from "../../../hooks/admin/useContactUs";

export default function ContactUsList() {
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
  } = useContactUs(page, pageSize);

  const totalPages = Math.ceil(total / pageSize);

  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    description: "",
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", email: "", description: "" });
    setShow(true);
  };

  const openEdit = (c: any) => {
    setEditing(c);
    setForm({
      name: c.name,
      email: c.email,
      description: c.description,
    });
    setShow(true);
  };

  const save = async () => {
    if (editing) await update(editing.id, form);
    else await create(form);
    setShow(false);
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between mb-4">
        <h3 className="fw-bold">Contact Us</h3>
        <button className="btn btn-success" onClick={openCreate}>
          + Add New
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">Loading…</div>
      ) : (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((c, i) => (
              <tr key={c.id}>
                <td>{i + 1}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.description}</td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => openEdit(c)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    disabled={actionLoading}
                    onClick={() => remove(c.id)}>
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
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5>{editing ? "Edit Message" : "Add Message"}</h5>
                <button className="btn-close" onClick={() => setShow(false)} />
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <textarea
                  className="form-control"
                  placeholder="Message"
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShow(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  disabled={actionLoading}
                  onClick={save}>
                  {actionLoading ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
