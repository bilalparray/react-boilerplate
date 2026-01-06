import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = [
  { from: "#6366f1", to: "#4f46e5" },
  { from: "#22c55e", to: "#16a34a" },
  { from: "#f97316", to: "#ea580c" },
];

export function CategoryChart({ data }: { data: any }) {
  const chartData = data.raw.map((c: any) => ({
    name: c.categoryName,
    value: c.sales,
  }));

  const total = chartData.reduce((sum: number, c: any) => sum + c.value, 0);

  return (
    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
      <div className="card-body">
        <div className="fw-semibold mb-2">Sales by Category</div>
        <div className="text-muted small mb-3">Revenue distribution</div>

        <div style={{ height: 260, position: "relative" }}>
          {/* Center text */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              pointerEvents: "none",
            }}>
            <div className="fs-5 fw-bold">₹{total.toLocaleString()}</div>
            <div className="small text-muted">Total</div>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {COLORS.map((c, i) => (
                  <linearGradient
                    key={i}
                    id={`grad${i}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1">
                    <stop offset="0%" stopColor={c.from} />
                    <stop offset="100%" stopColor={c.to} />
                  </linearGradient>
                ))}
              </defs>

              <Pie
                data={chartData}
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                stroke="none">
                {chartData.map((_: any, i: number) => (
                  <Cell key={i} fill={`url(#grad${i})`} />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                }}
                formatter={(v: any) => [`₹${v.toLocaleString()}`, "Revenue"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-3">
          {chartData.map((c: any, i: number) => (
            <div
              key={i}
              className="d-flex justify-content-between align-items-center mb-2 small">
              <div className="d-flex align-items-center gap-2">
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: COLORS[i].from,
                  }}
                />
                {c.name}
              </div>
              <div className="fw-semibold">₹{c.value.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
