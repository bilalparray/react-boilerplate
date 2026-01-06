export function TopProducts({ products }: { products: any[] }) {
  return (
    <div className="card shadow-sm">
      <div className="card-header fw-semibold">Top Products</div>
      <table className="table table-sm mb-0">
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={i}>
              <td>{p.productName}</td>
              <td>{p.totalQuantity}</td>
              <td>₹{p.totalRevenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
