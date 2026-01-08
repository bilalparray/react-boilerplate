import { useState } from "react";
import { useVideos } from "../../../hooks/admin/useVideos";

export default function VideoList() {
  const [page, setPage] = useState(1);
  const pageSize = 1;

  const {
    items,
    total,
    loading,
    actionLoading,
    error,
    create,
    update,
    remove,
  } = useVideos(page, pageSize);

  const totalPages = Math.ceil(total / pageSize);

  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    title: "",
    youtubeUrl: "",
    description: "",
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", youtubeUrl: "", description: "" });
    setShow(true);
  };

  const openEdit = (v: any) => {
    setEditing(v);
    setForm({
      title: v.title,
      youtubeUrl: v.youtubeUrl,
      description: v.description || "",
    });
    setShow(true);
  };

  const save = async () => {
    if (editing) await update(editing.id, form);
    else await create(form);
    if (!error) setShow(false);
  };

  const toEmbed = (url: string) => {
    if (url.includes("embed")) return url;
    const id = url.split("v=")[1] || url.split("/").pop();
    return `https://www.youtube.com/embed/${id}`;
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between mb-4">
        <h3 className="fw-bold">Videos</h3>
        <button className="btn btn-success" onClick={openCreate}>
          + Add New Video
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
              <th>Title</th>
              <th>YouTube URL</th>
              <th>Preview</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((v, i) => (
              <tr key={v.id}>
                <td>{i + 1}</td>
                <td className="fw-semibold">{v.title}</td>
                <td className="text-muted small">{v.youtubeUrl}</td>
                <td>
                  <iframe width="120" height="70" src={toEmbed(v.youtubeUrl)} />
                </td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => openEdit(v)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    disabled={actionLoading}
                    onClick={() => remove(v.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
          style={{ background: "#0008" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5>{editing ? "Edit Video" : "Add Video"}</h5>
                <button className="btn-close" onClick={() => setShow(false)} />
              </div>

              <div className="modal-body">
                <label className="form-label fw-semibold">Title</label>
                <input
                  className="form-control mb-3"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />

                <label className="form-label fw-semibold">YouTube URL</label>
                <input
                  className="form-control mb-3"
                  value={form.youtubeUrl}
                  onChange={(e) =>
                    setForm({ ...form, youtubeUrl: e.target.value })
                  }
                />

                <label className="form-label fw-semibold">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
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
