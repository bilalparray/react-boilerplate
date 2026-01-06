export function RecentOrders({ orders }: { orders: any[] }) {
  return (
    <div className="card shadow-sm">
      <div className="card-header fw-semibold">Recent Orders</div>
      <div className="table-responsive">
        <table className="table table-sm mb-0">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.orderNumber}</td>
                <td>{o.customerName}</td>
                <td>
                  <span className="badge bg-secondary">{o.status}</span>
                </td>
                <td>₹{o.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
