import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchInvoices } from "../../../services/admin/invoice.service";
import "./InvoicesPage.css";

const STATUS_COLORS: Record<string, string> = {
  created: "status-created",
  paid: "status-paid",
  shipped: "status-shipped",
  delivered: "status-delivered",
};

const STATUS_LABELS: Record<string, string> = {
  created: "Created",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
};

export default function InvoicesPage() {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchInvoices({
        skip: (page - 1) * pageSize,
        top: pageSize,
        status: filters.status || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      });

      setInvoices(res.successData || []);
    } catch (error) {
      console.error("Failed to load invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  const clearFilters = () => {
    setFilters({
      status: "",
      startDate: "",
      endDate: "",
    });
    setPage(1);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  const hasNextPage = invoices.length === pageSize;
  const total = invoices.length; // Note: API might not return total, adjust if needed

  const getStatusBadgeClass = (status: string) => {
    return STATUS_COLORS[status] || "status-default";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="invoices-page">
      {/* Page Header */}
      <div className="invoices-header">
        <div>
          <h2 className="invoices-title">Invoices Management</h2>
          <p className="invoices-subtitle">
            View and manage all customer invoices
          </p>
        </div>
        <div className="invoices-stats">
          <div className="stat-item">
            <span className="stat-label">Total Invoices</span>
            <span className="stat-value">{invoices.length}</span>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-card">
        <div
          className="filters-header"
          onClick={() => setFiltersExpanded(!filtersExpanded)}>
          <div className="filters-title-wrapper">
            <i className="bi bi-funnel-fill me-2"></i>
            <span className="filters-title">Filters</span>
            {hasActiveFilters && (
              <span className="active-filters-badge">
                {Object.values(filters).filter((v) => v !== "").length}
              </span>
            )}
          </div>
          <div className="filters-actions">
            {hasActiveFilters && (
              <button
                className="btn-clear-filters"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFilters();
                }}>
                <i className="bi bi-x-circle me-1"></i>
                Clear All
              </button>
            )}
            <i
              className={`bi bi-chevron-${filtersExpanded ? "up" : "down"} filters-toggle`}></i>
          </div>
        </div>

        {filtersExpanded && (
          <div className="filters-content">
            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">
                  <i className="bi bi-tag-fill me-1"></i>
                  Status
                </label>
                <select
                  className="form-select filter-input"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }>
                  <option value="">All Status</option>
                  <option value="created">Created</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">
                  <i className="bi bi-calendar-event me-1"></i>
                  Start Date
                </label>
                <input
                  type="date"
                  className="form-control filter-input"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters({ ...filters, startDate: e.target.value })
                  }
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">
                  <i className="bi bi-calendar-check me-1"></i>
                  End Date
                </label>
                <input
                  type="date"
                  className="form-control filter-input"
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters({ ...filters, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="filters-footer">
              <button
                className="btn btn-secondary btn-cancel"
                onClick={clearFilters}>
                <i className="bi bi-x-lg me-1"></i>
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Invoices Table - Desktop */}
      <div className="invoices-table-card">
        {loading ? (
          <div className="loading-state">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading invoices...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-receipt empty-icon"></i>
            <h5 className="empty-title">No invoices found</h5>
            <p className="empty-text">
              {hasActiveFilters
                ? "Try adjusting your filters to see more results"
                : "No invoices have been generated yet"}
            </p>
            {hasActiveFilters && (
              <button className="btn btn-outline-primary" onClick={clearFilters}>
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="table-responsive d-none d-md-block">
              <table className="table invoices-table">
                <thead>
                  <tr>
                    <th>Invoice Number</th>
                    <th>Order</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((i) => (
                    <tr key={i.invoiceId || i.invoiceNumber} className="invoice-row">
                      <td>
                        <div className="invoice-number">
                          <i className="bi bi-receipt me-2"></i>
                          <strong>{i.invoiceNumber}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="order-number">
                          <i className="bi bi-bag me-2"></i>
                          {i.orderNumber || "N/A"}
                        </div>
                      </td>
                      <td>
                        <div className="invoice-date">
                          {i.invoiceDate
                            ? formatDate(i.invoiceDate)
                            : formatDate(new Date().toISOString())}
                        </div>
                      </td>
                      <td>
                        <div className="customer-info">
                          <div className="customer-name">
                            {i.customerName || "N/A"}
                          </div>
                          {i.customerEmail && (
                            <small className="text-muted d-block">
                              {i.customerEmail}
                            </small>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="invoice-amount">
                          {formatCurrency(i.amount || 0)}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${getStatusBadgeClass(
                            i.status
                          )}`}>
                          {STATUS_LABELS[i.status] || i.status || "N/A"}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-view"
                          onClick={() => navigate(`/invoices/${i.invoiceNumber}`)}>
                          <i className="bi bi-eye me-1"></i>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="invoices-mobile d-md-none">
              {invoices.map((i) => (
                <div
                  key={i.invoiceId || i.invoiceNumber}
                  className="invoice-card-mobile">
                  <div className="invoice-card-header">
                    <div>
                      <div className="invoice-number-mobile">
                        <i className="bi bi-receipt me-2"></i>
                        <strong>{i.invoiceNumber}</strong>
                      </div>
                      {i.orderNumber && (
                        <small className="text-muted d-block">
                          Order: {i.orderNumber}
                        </small>
                      )}
                    </div>
                    <span
                      className={`status-badge-mobile ${getStatusBadgeClass(
                        i.status
                      )}`}>
                      {STATUS_LABELS[i.status] || i.status || "N/A"}
                    </span>
                  </div>

                  <div className="invoice-card-body">
                    <div className="invoice-info-row">
                      <span className="info-label">
                        <i className="bi bi-calendar me-1"></i>
                        Date
                      </span>
                      <span className="info-value">
                        {i.invoiceDate
                          ? formatDate(i.invoiceDate)
                          : formatDate(new Date().toISOString())}
                      </span>
                    </div>

                    <div className="invoice-info-row">
                      <span className="info-label">
                        <i className="bi bi-person me-1"></i>
                        Customer
                      </span>
                      <div className="info-value">
                        <div>{i.customerName || "N/A"}</div>
                        {i.customerEmail && (
                          <small className="text-muted d-block">
                            {i.customerEmail}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="invoice-info-row">
                      <span className="info-label">
                        <i className="bi bi-currency-rupee me-1"></i>
                        Amount
                      </span>
                      <span className="info-value amount-mobile">
                        {formatCurrency(i.amount || 0)}
                      </span>
                    </div>
                  </div>

                  <div className="invoice-card-footer">
                    <button
                      className="btn btn-primary btn-sm w-100"
                      onClick={() => navigate(`/invoices/${i.invoiceNumber}`)}>
                      <i className="bi bi-eye me-1"></i>
                      View Invoice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && invoices.length > 0 && (
          <div className="pagination-wrapper">
            <div className="pagination-info">
              <span>
                Showing <strong>{(page - 1) * pageSize + 1}</strong> to{" "}
                <strong>{Math.min(page * pageSize, total)}</strong> invoices
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

              <span className="fw-semibold">Page {page}</span>

              <button
                className="btn btn-outline-secondary btn-pagination"
                disabled={!hasNextPage || loading}
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
