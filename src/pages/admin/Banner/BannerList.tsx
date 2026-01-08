import { useState } from "react";
import { useAdminBanners } from "../../../hooks/useBanners";

const BANNER_TYPES = ["Slider", "ShortAd", "LongAd", "Sales", "Voucher"];

export default function BannerList() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const {
    banners,
    total,
    loading,
    actionLoading,
    error,
    create,
    update,
    remove,
  } = useAdminBanners(page, pageSize);

  const totalPages = Math.ceil(total / pageSize);

  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
    ctaText: "",
    bannerType: "Slider",
    isVisible: true,
    image: null as File | null,
  });

  /* ---------------- Base64 conversion ---------------- */
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  /* ---------------- Open modal ---------------- */
  const openCreate = () => {
    setEditing(null);
    setForm({
      title: "",
      description: "",
      link: "",
      ctaText: "",
      bannerType: "Slider",
      isVisible: true,
      image: null,
    });
    setShow(true);
  };

  const openEdit = (b: any) => {
    setEditing(b);
    setForm({
      title: b.title || "",
      description: b.description || "",
      link: b.link || "",
      ctaText: b.ctaText || "",
      bannerType: b.bannerType || "Slider",
      isVisible: b.isVisible,
      image: null,
    });
    setShow(true);
  };

  /* ---------------- Save ---------------- */
  const save = async () => {
    let image_base64 = "";

    if (form.image) {
      image_base64 = await fileToBase64(form.image);
    }

    const payload = {
      title: form.title,
      description: form.description,
      link: form.link,
      ctaText: form.ctaText,
      bannerType: form.bannerType,
      isVisible: form.isVisible,
      image_base64,
    };

    if (editing) await update(editing.id, payload);
    else await create(payload);

    if (!error) setShow(false);
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Banners</h3>
        <button className="btn btn-success" onClick={openCreate}>
          + Add Banner
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Table */}
      {loading ? (
        <div className="text-center py-5">Loading…</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Preview</th>
                <th>Title</th>
                <th>Type</th>
                <th>CTA</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {banners.map((b, i) => (
                <tr key={b.id}>
                  <td>{(page - 1) * pageSize + i + 1}</td>
                  <td>
                    <img
                      src={b.image_base64}
                      style={{
                        width: 70,
                        height: 45,
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />
                  </td>
                  <td className="fw-semibold">{b.title}</td>
                  <td>
                    <span className="badge bg-primary">{b.bannerType}</span>
                  </td>
                  <td>{b.ctaText}</td>
                  <td>
                    <span
                      className={`badge ${
                        b.isVisible ? "bg-success" : "bg-secondary"
                      }`}>
                      {b.isVisible ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => openEdit(b)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      disabled={actionLoading}
                      onClick={() => remove(b.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          style={{ background: "rgba(0,0,0,.6)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header bg-dark text-white">
                <h5 className="fw-bold">
                  {editing ? "Edit Banner" : "Add Banner"}
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShow(false)}
                />
              </div>

              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Title</label>
                    <input
                      className="form-control"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Banner Type
                    </label>
                    <select
                      className="form-select"
                      value={form.bannerType}
                      onChange={(e) =>
                        setForm({ ...form, bannerType: e.target.value })
                      }>
                      {BANNER_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label fw-semibold">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Link</label>
                    <input
                      className="form-control"
                      value={form.link}
                      onChange={(e) =>
                        setForm({ ...form, link: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">CTA Text</label>
                    <input
                      className="form-control"
                      value={form.ctaText}
                      onChange={(e) =>
                        setForm({ ...form, ctaText: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          image: e.target.files?.[0] || null,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6 d-flex align-items-end">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={form.isVisible}
                        onChange={(e) =>
                          setForm({ ...form, isVisible: e.target.checked })
                        }
                      />
                      <label className="form-check-label">
                        Show this banner
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
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
