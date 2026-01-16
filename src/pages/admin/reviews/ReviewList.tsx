import { useState } from "react";
import { useReviews } from "../../../hooks/admin/useReviews";
import { toast } from "react-toastify";
import "./ReviewList.css";

export default function ReviewList() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { items, total, loading, actionLoading, error, setStatus } = useReviews(
    page,
    pageSize
  );

  const pages = Math.ceil(total / pageSize);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter(
    (r) =>
      r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = async (id: number, currentStatus: boolean) => {
    try {
      await setStatus(id, !currentStatus);
      if (!error) {
        toast.success(
          `Review ${!currentStatus ? "approved" : "unapproved"} successfully`
        );
      }
    } catch (err) {
      toast.error("Failed to update review status");
    }
  };

  const getStatusBadgeClass = (isApproved: boolean) => {
    return isApproved ? "status-approved" : "status-pending";
  };

  return (
    <div className="reviews-page">
      {/* Page Header */}
      <div className="reviews-header">
        <div>
          <h2 className="reviews-title">Reviews Management</h2>
          <p className="reviews-subtitle">
            Manage and moderate customer product reviews
          </p>
        </div>
        <div className="reviews-stats">
          <div className="stat-item">
            <span className="stat-label">Total Reviews</span>
            <span className="stat-value">{total}</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, or comment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="btn-clear-search"
              onClick={() => setSearchQuery("")}>
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-danger alert-custom" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* Reviews Table - Desktop */}
      <div className="reviews-table-card">
        {loading ? (
          <div className="loading-state">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading reviews...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-chat-left-quote empty-icon"></i>
            <h5 className="empty-title">
              {searchQuery ? "No reviews found" : "No reviews yet"}
            </h5>
            <p className="empty-text">
              {searchQuery
                ? "Try adjusting your search query"
                : "Reviews will appear here once customers submit them"}
            </p>
            {searchQuery && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => setSearchQuery("")}>
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="table-responsive d-none d-md-block">
              <table className="table reviews-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Comment</th>
                    <th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((r, i) => (
                    <tr key={r.id} className="review-row">
                      <td>
                        <div className="review-number">
                          {(page - 1) * pageSize + i + 1}
                        </div>
                      </td>
                      <td>
                        <div className="review-customer">
                          <i className="bi bi-person-circle me-2"></i>
                          {r.name}
                        </div>
                      </td>
                      <td>
                        <div className="review-email">
                          <i className="bi bi-envelope me-2"></i>
                          {r.email}
                        </div>
                      </td>
                      <td>
                        <div className="review-comment">
                          {r.comment || (
                            <span className="text-muted">No comment</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${getStatusBadgeClass(
                            r.isApproved
                          )}`}>
                          {r.isApproved ? (
                            <>
                              <i className="bi bi-check-circle-fill me-1"></i>
                              Approved
                            </>
                          ) : (
                            <>
                              <i className="bi bi-clock-fill me-1"></i>
                              Pending
                            </>
                          )}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className={`btn btn-sm ${
                            r.isApproved ? "btn-secondary" : "btn-success"
                          }`}
                          disabled={actionLoading}
                          onClick={() => handleStatusChange(r.id, r.isApproved)}>
                          {r.isApproved ? (
                            <>
                              <i className="bi bi-x-circle me-1"></i>
                              Unapprove
                            </>
                          ) : (
                            <>
                              <i className="bi bi-check-circle me-1"></i>
                              Approve
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="reviews-mobile d-md-none">
              {filteredItems.map((r, i) => (
                <div key={r.id} className="review-card-mobile">
                  <div className="review-card-header">
                    <div className="review-card-customer">
                      <div className="review-customer-mobile">
                        <i className="bi bi-person-circle me-2"></i>
                        {r.name}
                      </div>
                      <div className="review-number-mobile">
                        #{(page - 1) * pageSize + i + 1}
                      </div>
                    </div>
                    <span
                      className={`status-badge-mobile ${getStatusBadgeClass(
                        r.isApproved
                      )}`}>
                      {r.isApproved ? (
                        <>
                          <i className="bi bi-check-circle-fill me-1"></i>
                          Approved
                        </>
                      ) : (
                        <>
                          <i className="bi bi-clock-fill me-1"></i>
                          Pending
                        </>
                      )}
                    </span>
                  </div>

                  <div className="review-card-body">
                    <div className="review-info-row">
                      <span className="info-label">
                        <i className="bi bi-envelope me-1"></i>
                        Email
                      </span>
                      <span className="info-value">{r.email}</span>
                    </div>

                    <div className="review-info-row">
                      <span className="info-label">
                        <i className="bi bi-chat-left-text me-1"></i>
                        Comment
                      </span>
                    </div>
                    <div className="review-comment-mobile">
                      {r.comment || (
                        <span className="text-muted">No comment provided</span>
                      )}
                    </div>
                  </div>

                  <div className="review-card-footer">
                    <button
                      className={`btn btn-sm flex-fill ${
                        r.isApproved ? "btn-outline-secondary" : "btn-success"
                      }`}
                      disabled={actionLoading}
                      onClick={() => handleStatusChange(r.id, r.isApproved)}>
                      {r.isApproved ? (
                        <>
                          <i className="bi bi-x-circle me-1"></i>
                          Unapprove
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-1"></i>
                          Approve
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && filteredItems.length > 0 && (
          <div className="pagination-wrapper">
            <div className="pagination-info">
              <span>
                Showing <strong>{(page - 1) * pageSize + 1}</strong> to{" "}
                <strong>
                  {Math.min(page * pageSize, filteredItems.length)}
                </strong>{" "}
                of <strong>{filteredItems.length}</strong> reviews
                {searchQuery && " (filtered)"}
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
