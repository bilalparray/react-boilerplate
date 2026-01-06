import { KpiGrid } from "../../../components/admin/dashboard/KpiGrid";
import { RecentOrders } from "../../../components/admin/dashboard/RecentOrders";
import { TopProducts } from "../../../components/admin/dashboard/TopProducts";
import { Visitors } from "../../../components/admin/dashboard/Visitors";
import { useDashboard } from "../../../hooks/admin/useDashboard";

export default function DashboardPage() {
  const { data, loading, error } = useDashboard();

  if (loading) return <div className="p-4">Loading dashboard…</div>;
  if (error) return <div className="p-4 text-danger">{error}</div>;
  if (!data) return null;

  return (
    <div className="container-fluid p-4">
      <h3 className="mb-4">Dashboard</h3>

      <KpiGrid kpis={data.kpis} />

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <RecentOrders orders={data.widgets.recentOrders} />
        </div>
        <div className="col-lg-6">
          <TopProducts products={data.widgets.topProducts} />
        </div>
      </div>

      <div className="mb-4">
        <Visitors data={data.charts.dailyVisitors} />
      </div>

      <div className="alert alert-warning">
        {data.charts.dailyVisitorsNotification.message}
      </div>
    </div>
  );
}
