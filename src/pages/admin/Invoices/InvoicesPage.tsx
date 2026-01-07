import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchInvoices } from "../../../services/admin/invoice.service";

export default function InvoicesPage() {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });

  const load = async () => {
    setLoading(true);

    const res = await fetchInvoices({
      skip: (page - 1) * pageSize,
      top: pageSize,
      status: filters.status || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
    });

    // API returns array directly
    setInvoices(res.successData);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [page, filters]);

  const hasNextPage = invoices.length === pageSize;

  return (
    <div className="p-4">
      <h4 className="mb-3">Invoices</h4>

      {/* Filters */}
      <div className="card p-3 mb-3">
        <div className="row g-3">
          <div className="col-md-3">
            <label>Status</label>
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }>
              <option value="">All</option>
              <option value="created">Created</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
            </select>
          </div>

          <div className="col-md-3">
            <label>Start Date</label>
            <input
              type="date"
              className="form-control"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
          </div>

          <div className="col-md-3">
            <label>End Date</label>
            <input
              type="date"
              className="form-control"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />
          </div>

          <div className="col-md-3 d-flex align-items-end">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                setFilters({ status: "", startDate: "", endDate: "" });
                setPage(1);
              }}>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="p-5 text-center">
            <div className="spinner-border text-primary" />
          </div>
        ) : (
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {invoices.map((i) => (
                <tr key={i.invoiceId}>
                  <td className="fw-semibold">{i.invoiceNumber}</td>
                  <td>{i.orderNumber}</td>
                  <td>{new Date(i.invoiceDate).toLocaleDateString()}</td>
                  <td>
                    <div>{i.customerName}</div>
                    <small className="text-muted">{i.customerEmail}</small>
                  </td>
                  <td>₹{i.amount}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        i.status === "paid"
                          ? "success"
                          : i.status === "shipped"
                          ? "warning"
                          : "secondary"
                      }`}>
                      {i.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => navigate(`/invoices/${i.invoiceNumber}`)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {invoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
                    No invoices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center p-3">
          <button
            disabled={page === 1}
            className="btn btn-outline-secondary"
            onClick={() => setPage(page - 1)}>
            Prev
          </button>

          <span className="fw-semibold">Page {page}</span>

          <button
            disabled={!hasNextPage}
            className="btn btn-outline-secondary"
            onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
