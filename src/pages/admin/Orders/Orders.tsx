import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchOrders,
  fetchCustomers,
  updateStatus,
} from "../../../services/admin/orders.service";

export default function OrdersPage() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [filters, setFilters] = useState({
    status: "",
    customerName: "",
    startDate: "",
    endDate: "",
    search: "",
    minAmount: "",
    maxAmount: "",
  });

  const load = async () => {
    try {
      setLoading(true);

      const res = await fetchOrders({
        page,
        pageSize,
        ...filters,
        minAmount: filters.minAmount ? Number(filters.minAmount) : undefined,
        maxAmount: filters.maxAmount ? Number(filters.maxAmount) : undefined,
      });

      setOrders(res.orders);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers().then((r) => setCustomers(r.successData.data));
  }, []);

  useEffect(() => {
    load();
  }, [page, filters]);

  const applyFilters = () => {
    setPage(1);
  };

  const pages = Math.ceil(total / pageSize);

  return (
    <div className="p-4">
      {/* Filters */}
      <div className="card p-3 mb-3">
        <div className="row g-3">
          <div className="col-md-2">
            <label>Status</label>
            <select
              className="form-select"
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }>
              <option value="">All Status</option>
              <option value="created">Created</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="col-md-3">
            <label>Customer</label>
            <select
              className="form-select"
              onChange={(e) => {
                const c = customers.find(
                  (x) => x.id === Number(e.target.value)
                );
                setFilters({
                  ...filters,
                  customerName: c ? `${c.firstName} ${c.lastName}` : "",
                });
              }}>
              <option value="">All</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label>Start Date</label>
            <input
              type="date"
              className="form-control"
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
          </div>

          <div className="col-md-2">
            <label>End Date</label>
            <input
              type="date"
              className="form-control"
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />
          </div>

          <div className="col-md-3">
            <label>Search</label>
            <input
              className="form-control"
              placeholder="Order ID, receipt"
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>

          <div className="col-md-2">
            <label>Min ₹</label>
            <input
              type="number"
              className="form-control"
              onChange={(e) =>
                setFilters({ ...filters, minAmount: e.target.value })
              }
            />
          </div>

          <div className="col-md-2">
            <label>Max ₹</label>
            <input
              type="number"
              className="form-control"
              onChange={(e) =>
                setFilters({ ...filters, maxAmount: e.target.value })
              }
            />
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button
              className="btn btn-primary w-100"
              disabled={loading}
              onClick={applyFilters}>
              {loading ? "Loading…" : "Apply"}
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.customer.firstName}</td>
                <td>₹{o.amount}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={o.status}
                    onChange={(e) =>
                      updateStatus(o.id, e.target.value).then(load)
                    }>
                    <option value="created">Created</option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => navigate(`/orders/${o.id}`)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center p-3">
          <div>
            Showing {(page - 1) * pageSize + 1}
            {" - "}
            {Math.min(page * pageSize, total)}
            {" of "}
            {total} orders
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              disabled={page === 1}
              className="btn btn-outline-secondary"
              onClick={() => setPage(page - 1)}>
              Prev
            </button>

            <span className="fw-semibold">
              Page {page} of {pages}
            </span>

            <button
              disabled={page >= pages}
              className="btn btn-outline-secondary"
              onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
