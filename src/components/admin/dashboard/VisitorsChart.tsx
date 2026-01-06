import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function VisitorsChart({ data }: { data: any[] }) {
  const chartData = data.map((d) => ({
    date: d.date.slice(5),
    visitors: d.visitors,
  }));

  return (
    <div className="card shadow-sm">
      <div className="card-header fw-semibold">Daily Visitors</div>
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line dataKey="visitors" stroke="#0ea5e9" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
