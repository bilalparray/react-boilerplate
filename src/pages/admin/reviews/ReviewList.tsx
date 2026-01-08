import { useState } from "react";
import { useReviews } from "../../../hooks/admin/useReviews";

export default function ReviewList() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { items, total, loading, actionLoading, error, setStatus } = useReviews(
    page,
    pageSize
  );

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Reviews</h3>
        <input
          className="form-control"
          style={{ width: 240 }}
          placeholder="Search review..."
        />
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
                <th>Name</th>
                <th>Email</th>
                <th>Comment</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r, i) => (
                <tr key={r.id}>
                  <td>{(page - 1) * pageSize + i + 1}</td>
                  <td className="fw-semibold">{r.name}</td>
                  <td>{r.email}</td>
                  <td style={{ maxWidth: 400 }}>{r.comment}</td>

                  <td>
                    <span
                      className={`badge ${
                        r.isApproved ? "bg-success" : "bg-warning text-dark"
                      }`}>
                      {r.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>

                  <td className="text-end">
                    <button
                      className={`btn btn-sm ${
                        r.isApproved ? "btn-secondary" : "btn-success"
                      }`}
                      disabled={actionLoading}
                      onClick={() => setStatus(r.id, !r.isApproved)}>
                      {r.isApproved ? "Unapprove" : "Approve"}
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
    </div>
  );
}
