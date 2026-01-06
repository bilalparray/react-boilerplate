export function DailyVisitors({ data }: { data: any[] }) {
  return (
    <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
      <div className="card-body">
        <div className="fw-semibold mb-3">Daily Visitors</div>

        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="small text-muted">Date</th>
                <th className="small text-muted text-end">Visitors</th>
                <th className="small text-muted text-end">Page Views</th>
                <th className="small text-muted text-end">Avg Time</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.date}>
                  <td className="fw-semibold">
                    {new Date(d.date).toLocaleDateString()}
                  </td>

                  <td className="text-end fw-semibold">{d.visitors}</td>

                  <td className="text-end">{d.pageViews.toLocaleString()}</td>

                  <td className="text-end text-muted">{d.avgTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
