import { useEffect, useState } from "react";
import {
  fetchCategories,
  fetchCategoryCount,
  addCategory,
  editCategory,
  removeCategory,
} from "../../../services/admin/categories.service";
import type { Category } from "../../../dto/admin/categoryDTO";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const [form, setForm] = useState<any>({
    name: "",
    description: "",
    slider: false,
    sequence: 0,
    status: "active",
    category_icon_base64: "",
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
  }, [page]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      slider: false,
      sequence: 0,
      status: "active",
      category_icon_base64: "",
    });
    setShowModal(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({
      name: c.name,
      description: c.description,
      slider: c.slider,
      sequence: c.sequence,
      status: c.status,
      category_icon_base64: c.category_icon_base64,
    });
    setShowModal(true);
  };

  const submit = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      slider: form.slider,
      sequence: form.sequence,
      status: form.status,
      category_icon_base64: form.category_icon_base64,
    };

    if (editing) {
      await editCategory(editing.id, payload);
    } else {
      await addCategory(payload);
    }

    setShowModal(false);
    setPage(1);
    load();
  };

  const deleteRow = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    await removeCategory(id);
    load();
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-semibold">Categories</h4>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add Category
        </button>
      </div>

      {/* Table */}
      <div className="card shadow-sm">
        {loading ? (
          <div className="p-5 text-center">
            <div className="spinner-border text-primary" />
          </div>
        ) : (
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Icon</th>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {categories.map((c, i) => (
                <tr key={c.id}>
                  <td>{(page - 1) * pageSize + i + 1}</td>
                  <td>
                    <img
                      src={c.category_icon_base64}
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td className="fw-semibold">{c.name}</td>
                  <td className="text-muted">{c.description}</td>
                  <td>
                    <span
                      className={`badge ${
                        c.status === "active" ? "bg-success" : "bg-secondary"
                      }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => openEdit(c)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteRow(c.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {categories.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center p-3">
          <div>
            Showing {(page - 1) * pageSize + 1} –{" "}
            {Math.min(page * pageSize, total)} of {total}
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}>
              Prev
            </button>

            <span className="fw-semibold">
              Page {page} of {pages}
            </span>

            <button
              className="btn btn-outline-secondary"
              disabled={page >= pages}
              onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editing ? "Edit Category" : "Add Category"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-3"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <textarea
                  className="form-control mb-3"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />

                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="Sequence"
                  value={form.sequence}
                  onChange={(e) =>
                    setForm({ ...form, sequence: Number(e.target.value) })
                  }
                />

                <select
                  className="form-select mb-3"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={form.slider}
                    onChange={(e) =>
                      setForm({ ...form, slider: e.target.checked })
                    }
                  />
                  <label className="form-check-label">
                    Show in homepage slider
                  </label>
                </div>

                <input
                  type="file"
                  className="form-control mb-3"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const base64 = await fileToBase64(file);
                    setForm({ ...form, category_icon_base64: base64 });
                  }}
                />

                {form.category_icon_base64 && (
                  <img
                    src={form.category_icon_base64}
                    style={{
                      width: 120,
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                    }}
                  />
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={submit}>
                  {editing ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
