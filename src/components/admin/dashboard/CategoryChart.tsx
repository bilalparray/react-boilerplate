import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f97316"];

export function CategoryChart({ data }: { data: any }) {
  const chartData = data.raw.map((c: any) => ({
    name: c.categoryName,
    value: c.sales,
  }));

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header fw-semibold">Sales by Category</div>
      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={60}
              outerRadius={100}
              dataKey="value">
              {chartData.map((_: any, i: any) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
