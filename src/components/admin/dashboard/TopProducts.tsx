import { useNavigate } from "react-router-dom";

export function TopProducts({ products }: { products: any[] }) {
  const navigate = useNavigate();

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
            <div className="fw-semibold">Top Products</div>
            <div className="text-muted small">Best performing products</div>
          </div>
          {products.length > 0 && (
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => navigate("/products")}>
              View All
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <i className="bi bi-box-seam" style={{ fontSize: 32 }}></i>
            <p className="mt-2 mb-0">No product data available</p>
          </div>
        ) : (
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
                    <td>
                      <div className="rank-badge">{i + 1}</div>
                    </td>
                    <td>
                      <div className="fw-semibold">{p.productName}</div>
                      <div className="text-muted small">
                        <i className="bi bi-upc me-1"></i>
                        {p.sku}
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="quantity-badge">{p.totalQuantity}</span>
                    </td>
                    <td className="text-end fw-bold text-success">
                      {formatCurrency(p.totalRevenue)}
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
