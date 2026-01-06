export function RecentOrders({ orders }: { orders: any[] }) {
  const statusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "success";
      case "delivered":
        return "primary";
      case "created":
        return "secondary";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
      <div className="card-body">
        <div className="fw-semibold mb-3">Recent Orders</div>

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
                <tr key={o.id} style={{ cursor: "pointer" }}>
                  <td className="fw-semibold">{o.orderNumber.slice(0, 10)}…</td>
                  <td>
                    <div className="fw-semibold">{o.customerName}</div>
                    <div className="text-muted small">{o.customerEmail}</div>
                  </td>
                  <td>
                    <span
                      className={`badge bg-${statusColor(
                        o.status
                      )} bg-opacity-10 text-${statusColor(o.status)} px-3 py-2`}
                      style={{ borderRadius: 999 }}>
                      {o.status}
                    </span>
                  </td>
                  <td className="fw-semibold text-end">
                    ₹{o.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
