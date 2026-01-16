import { useState } from "react";
import { useVideos } from "../../../hooks/admin/useVideos";
import { toast } from "react-toastify";
import "./VideoList.css";

export default function VideoList() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const {
    items: videos,
    total,
    loading,
    actionLoading,
    error,
    create,
    update,
    remove,
  } = useVideos(page, pageSize);

  const pages = Math.ceil(total / pageSize);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    youtubeUrl: "",
    description: "",
  });

  /* ---------- Helpers ---------- */
  const isValidYoutubeUrl = (url: string) =>
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i.test(url);

  const getYoutubeId = (url: string) => {
    if (!url) return "";
    try {
      const match = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/);
      return match ? match[1] : "";
    } catch {
      return "";
    }
  };

  const getYoutubeThumbnail = (url: string) => {
    const videoId = getYoutubeId(url);
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  };

  /* ---------- Modal ---------- */
  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", youtubeUrl: "", description: "" });
    setUrlError(null);
    setShowModal(true);
  };

  const openEdit = (v: any) => {
    setEditing(v);
    setForm({
      title: v.title,
      youtubeUrl: v.youtubeUrl,
      description: v.description || "",
    });
    setUrlError(null);
    setShowModal(true);
  };

  const save = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!form.youtubeUrl.trim()) {
      toast.error("YouTube URL is required");
      return;
    }

    if (!isValidYoutubeUrl(form.youtubeUrl)) {
      setUrlError("Invalid YouTube URL. Please enter a valid YouTube link.");
      toast.error("Invalid YouTube URL");
      return;
    }

    try {
      if (editing) {
        await update(editing.id, form);
        if (!error) {
          toast.success("Video updated successfully");
          setShowModal(false);
        }
      } else {
        await create(form);
        if (!error) {
          toast.success("Video created successfully");
          setShowModal(false);
        }
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const deleteRow = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this video?")) {
      return;
    }

    try {
      await remove(id);
      if (!error) {
        toast.success("Video deleted successfully");
      }
    } catch (err) {
      toast.error("Failed to delete video");
    }
  };

  return (
    <div className="videos-page">
      {/* Page Header */}
      <div className="videos-header">
        <div>
          <h2 className="videos-title">Videos Management</h2>
          <p className="videos-subtitle">
            Manage YouTube videos and video content
          </p>
        </div>
        <div className="videos-stats">
          <div className="stat-item">
            <span className="stat-label">Total Videos</span>
            <span className="stat-value">{total}</span>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <button className="btn btn-primary btn-add" onClick={openCreate}>
          <i className="bi bi-plus-circle-fill me-2"></i>
          Add New Video
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-danger alert-custom" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* Videos Table - Desktop */}
      <div className="videos-table-card">
        {loading ? (
          <div className="loading-state">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading videos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-play-circle empty-icon"></i>
            <h5 className="empty-title">No videos found</h5>
            <p className="empty-text">
              Get started by adding your first video
            </p>
            <button className="btn btn-primary" onClick={openCreate}>
              <i className="bi bi-plus-circle me-1"></i>
              Add Video
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="table-responsive d-none d-md-block">
              <table className="table videos-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Thumbnail</th>
                    <th>Title</th>
                    <th>YouTube URL</th>
                    <th>Description</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((v, i) => {
                    const thumbnail = getYoutubeThumbnail(v.youtubeUrl);
                    return (
                      <tr key={v.id} className="video-row">
                        <td>
                          <div className="video-number">
                            {(page - 1) * pageSize + i + 1}
                          </div>
                        </td>
                        <td>
                          <div className="video-thumbnail-wrapper">
                            {thumbnail ? (
                              <img
                                src={thumbnail}
                                alt={v.title}
                                className="video-thumbnail"
                              />
                            ) : (
                              <div className="video-thumbnail-placeholder">
                                <i className="bi bi-play-circle"></i>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="video-title">{v.title}</div>
                        </td>
                        <td>
                          <div className="video-url">
                            <a
                              href={v.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link-preview">
                              <i className="bi bi-youtube me-1"></i>
                              View on YouTube
                            </a>
                          </div>
                        </td>
                        <td>
                          <div className="video-description">
                            {v.description || (
                              <span className="text-muted">No description</span>
                            )}
                          </div>
                        </td>
                        <td className="text-end">
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm btn-edit"
                              onClick={() => openEdit(v)}
                              disabled={actionLoading}>
                              <i className="bi bi-pencil-fill me-1"></i>
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-delete"
                              onClick={() => deleteRow(v.id)}
                              disabled={actionLoading}>
                              <i className="bi bi-trash-fill me-1"></i>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="videos-mobile d-md-none">
              {videos.map((v, i) => {
                const thumbnail = getYoutubeThumbnail(v.youtubeUrl);
                return (
                  <div key={v.id} className="video-card-mobile">
                    {/* Video Thumbnail */}
                    <div className="video-thumbnail-mobile-wrapper">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={v.title}
                          className="video-thumbnail-mobile"
                        />
                      ) : (
                        <div className="video-thumbnail-placeholder-mobile">
                          <i className="bi bi-play-circle"></i>
                          <p>No Preview</p>
                        </div>
                      )}
                      <div className="video-play-overlay">
                        <i className="bi bi-play-circle-fill"></i>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="video-card-content">
                      <div className="video-card-header-mobile">
                        <div className="video-title-mobile">{v.title}</div>
                        <div className="video-number-mobile">
                          #{(page - 1) * pageSize + i + 1}
                        </div>
                      </div>

                      <div className="video-card-body">
                        {v.description && (
                          <div className="video-info-row">
                            <span className="info-label">
                              <i className="bi bi-text-paragraph me-1"></i>
                              Description
                            </span>
                            <span className="info-value">{v.description}</span>
                          </div>
                        )}

                        <div className="video-info-row">
                          <span className="info-label">
                            <i className="bi bi-youtube me-1"></i>
                            YouTube Link
                          </span>
                          <a
                            href={v.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-preview-mobile">
                            Open Video
                            <i className="bi bi-box-arrow-up-right ms-1"></i>
                          </a>
                        </div>
                      </div>

                      <div className="video-card-footer">
                        <button
                          className="btn btn-outline-primary btn-sm flex-fill me-2"
                          onClick={() => openEdit(v)}
                          disabled={actionLoading}>
                          <i className="bi bi-pencil-fill me-1"></i>
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm flex-fill"
                          onClick={() => deleteRow(v.id)}
                          disabled={actionLoading}>
                          <i className="bi bi-trash-fill me-1"></i>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && videos.length > 0 && (
          <div className="pagination-wrapper">
            <div className="pagination-info">
              <span>
                Showing <strong>{(page - 1) * pageSize + 1}</strong> to{" "}
                <strong>{Math.min(page * pageSize, total)}</strong> of{" "}
                <strong>{total}</strong> videos
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
                <i className="bi bi-play-circle-fill me-2"></i>
                {editing ? "Edit Video" : "Create New Video"}
              </h5>
              <button
                className="btn-close-custom"
                onClick={() => !actionLoading && setShowModal(false)}
                disabled={actionLoading}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body-custom">
              {/* Title */}
              <div className="form-group">
                <label className="form-label-custom">
                  <i className="bi bi-type me-1"></i>
                  Video Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-control-custom"
                  placeholder="Enter video title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  disabled={actionLoading}
                />
              </div>

              {/* YouTube URL */}
              <div className="form-group">
                <label className="form-label-custom">
                  <i className="bi bi-youtube me-1"></i>
                  YouTube URL <span className="required">*</span>
                </label>
                <input
                  type="url"
                  className={`form-control-custom ${urlError ? "is-invalid" : ""}`}
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={form.youtubeUrl}
                  onChange={(e) => {
                    setForm({ ...form, youtubeUrl: e.target.value });
                    setUrlError(null);
                  }}
                  disabled={actionLoading}
                />
                {urlError && (
                  <div className="form-error-message">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {urlError}
                  </div>
                )}
                <small className="form-help-text">
                  Enter a valid YouTube URL (youtube.com or youtu.be)
                </small>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label-custom">
                  <i className="bi bi-text-paragraph me-1"></i>
                  Description
                </label>
                <textarea
                  className="form-control-custom"
                  placeholder="Enter video description (optional)"
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
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
                  !form.title.trim() ||
                  !form.youtubeUrl.trim()
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
                    {editing ? "Update Video" : "Create Video"}
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
