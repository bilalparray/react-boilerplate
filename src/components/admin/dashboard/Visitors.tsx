export function Visitors({ data }: { data: any[] }) {
  return (
    <div className="card shadow-sm">
      <div className="card-header fw-semibold">Daily Visitors</div>
      <table className="table table-sm mb-0">
        <thead>
          <tr>
            <th>Date</th>
            <th>Visitors</th>
            <th>Views</th>
            <th>Avg Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.date}>
              <td>{d.date}</td>
              <td>{d.visitors}</td>
              <td>{d.pageViews}</td>
              <td>{d.avgTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
