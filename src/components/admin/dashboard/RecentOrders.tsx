import { useNavigate } from "react-router-dom";

export function RecentOrders({ orders }: { orders: any[] }) {
  const navigate = useNavigate();

  const statusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "status-paid";
      case "delivered":
        return "status-delivered";
      case "created":
        return "status-created";
      case "shipped":
        return "status-shipped";
      case "cancelled":
        return "status-cancelled";
      case "failed":
        return "status-failed";
      default:
        return "status-default";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div className="fw-semibold">Recent Orders</div>
            <div className="text-muted small">Latest customer orders</div>
          </div>
          {orders.length > 0 && (
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => navigate("/orders")}>
              View All
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <i className="bi bi-inbox" style={{ fontSize: 32 }}></i>
            <p className="mt-2 mb-0">No recent orders</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="small text-muted">Order</th>
                  <th className="small text-muted">Customer</th>
                  <th className="small text-muted">Status</th>
                  <th className="small text-muted text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/orders/${o.id}`)}>
                    <td className="fw-semibold">
                      <i className="bi bi-receipt me-1"></i>
                      {o.orderNumber?.slice(0, 10) || `#${o.id}`}
                    </td>
                    <td>
                      <div className="fw-semibold">{o.customerName}</div>
                      <div className="text-muted small">{o.customerEmail}</div>
                    </td>
                    <td>
                      <span
                        className={`badge ${statusColor(o.status)} px-3 py-2`}
                        style={{ borderRadius: 999 }}>
                        {o.status === "paid" && (
                          <i className="bi bi-check-circle-fill me-1"></i>
                        )}
                        {o.status === "delivered" && (
                          <i className="bi bi-truck me-1"></i>
                        )}
                        {o.status === "created" && (
                          <i className="bi bi-clock-fill me-1"></i>
                        )}
                        {o.status === "cancelled" && (
                          <i className="bi bi-x-circle-fill me-1"></i>
                        )}
                        {o.status}
                      </span>
                    </td>
                    <td className="fw-semibold text-end">
                      {formatCurrency(o.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
