export function KpiGrid({ kpis }: { kpis: any }) {
  const items = [
    ["Total Sales", `₹${kpis.totalSales}`],
    ["Orders", kpis.totalOrders],
    ["Customers", kpis.totalCustomers],
    ["Active Users", kpis.activeUsers],
    ["Pending Orders", kpis.pendingOrders],
    ["Return Rate", kpis.returnRate],
  ];

  return (
    <div className="row g-3 mb-4">
      {items.map(([label, value]) => (
        <div key={label} className="col-6 col-lg-2">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="text-muted small">{label}</div>
              <div className="fs-4 fw-bold">{value}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
