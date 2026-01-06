import type { KPIsDTO } from "../../../dto/admin/dashboardDTO";

/* ------------------------------
   Trend calculation
--------------------------------*/
function getTrend(current: number, previous: number) {
  if (!previous) return { value: 0, up: true };
  const diff = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(diff).toFixed(1),
    up: diff >= 0,
  };
}

/* ------------------------------
   KPI config
--------------------------------*/
const kpiConfig = [
  {
    key: "totalSales",
    label: "Total Sales",
    icon: "bi-currency-rupee",
    gradient: "linear-gradient(135deg,#6366f1,#4f46e5)",
    format: (v: any) => `₹${Number(v).toLocaleString()}`,
    getTrend: (k: KPIsDTO) =>
      getTrend(
        Number(k.thisMonthSales),
        Number(k.totalSales) - Number(k.thisMonthSales)
      ),
  },
  {
    key: "totalOrders",
    label: "Orders",
    icon: "bi-bag-check",
    gradient: "linear-gradient(135deg,#22c55e,#16a34a)",
    getTrend: (k: KPIsDTO) =>
      getTrend(k.thisMonthOrders, k.totalOrders - k.thisMonthOrders),
  },
  {
    key: "totalCustomers",
    label: "Customers",
    icon: "bi-people",
    gradient: "linear-gradient(135deg,#0ea5e9,#0284c7)",
  },
  {
    key: "activeUsers",
    label: "Active Users",
    icon: "bi-lightning",
    gradient: "linear-gradient(135deg,#ec4899,#db2777)",
  },
  {
    key: "pendingOrders",
    label: "Pending",
    icon: "bi-clock-history",
    gradient: "linear-gradient(135deg,#f59e0b,#d97706)",
  },
  {
    key: "returnRate",
    label: "Return Rate",
    icon: "bi-arrow-repeat",
    gradient: "linear-gradient(135deg,#8b5cf6,#7c3aed)",
  },
];

/* ------------------------------
   Component
--------------------------------*/
export function KpiGrid({ kpis }: { kpis: KPIsDTO }) {
  return (
    <div className="row g-3 mb-4">
      {kpiConfig.map((kpi) => {
        const rawValue = (kpis as any)[kpi.key];
        const value = kpi.format ? kpi.format(rawValue) : rawValue;
        const trend = kpi.getTrend?.(kpis);

        return (
          <div key={kpi.key} className="col-6 col-lg-2">
            <div
              className="card border-0 shadow-sm h-100"
              style={{ borderRadius: "14px" }}>
              <div className="card-body d-flex flex-column justify-content-between">
                {/* Top */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      background: kpi.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "20px",
                    }}>
                    <i className={`bi ${kpi.icon}`} />
                  </div>
                </div>

                {/* Value */}
                <div className="fs-4 fw-bold">{value}</div>

                <div className="text-muted small fw-semibold">{kpi.label}</div>

                {/* Trend */}
                {trend && (
                  <div
                    className={`small fw-semibold mt-2 ${
                      trend.up ? "text-success" : "text-danger"
                    }`}>
                    <i
                      className={`bi ${
                        trend.up ? "bi-arrow-up-right" : "bi-arrow-down-right"
                      }`}
                    />{" "}
                    {trend.value}% vs last period
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
