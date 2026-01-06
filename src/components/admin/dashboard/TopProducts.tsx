export function TopProducts({ products }: { products: any[] }) {
  return (
    <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
      <div className="card-body">
        <div className="fw-semibold mb-3">Top Products</div>

        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="small text-muted">#</th>
                <th className="small text-muted">Product</th>
                <th className="small text-muted text-center">Qty</th>
                <th className="small text-muted text-end">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i}>
                  <td className="fw-bold text-muted">{i + 1}</td>

                  <td>
                    <div className="fw-semibold">{p.productName}</div>
                    <div className="text-muted small">{p.sku}</div>
                  </td>

                  <td className="text-center fw-semibold">{p.totalQuantity}</td>

                  <td className="text-end fw-bold text-success">
                    ₹{p.totalRevenue.toLocaleString()}
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
