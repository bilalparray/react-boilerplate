import { CategoryChart } from "../../../components/admin/dashboard/CategoryChart";
import { KpiGrid } from "../../../components/admin/dashboard/KpiGrid";
import { MonthlySalesChart } from "../../../components/admin/dashboard/MonthlySalesChart";
import { RecentOrders } from "../../../components/admin/dashboard/RecentOrders";
import { TopProducts } from "../../../components/admin/dashboard/TopProducts";
import { DailyVisitors } from "../../../components/admin/dashboard/DailyVisitors";
import { VisitorsChart } from "../../../components/admin/dashboard/VisitorsChart";
import { useDashboard } from "../../../hooks/admin/useDashboard";
import "./Dashboard.css";

export default function DashboardPage() {
  const { data, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-content">
          <i className="bi bi-exclamation-triangle-fill error-icon"></i>
          <h5 className="error-title">Failed to Load Dashboard</h5>
          <p className="error-text">{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard-error">
        <div className="error-content">
          <i className="bi bi-inbox error-icon"></i>
          <h5 className="error-title">No Data Available</h5>
          <p className="error-text">Dashboard data is not available at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Dashboard</h2>
          <p className="dashboard-subtitle">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        {data.lastUpdated && (
          <div className="dashboard-updated">
            <i className="bi bi-clock-history me-2"></i>
            <span className="updated-text">
              Last updated: {new Date(data.lastUpdated).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* KPI Grid */}
      <div className="dashboard-section">
        <KpiGrid kpis={data.kpis} />
      </div>

      {/* Charts Row */}
      <div className="dashboard-section">
        <div className="dashboard-charts-grid">
          <div className="chart-card-large">
            <MonthlySalesChart data={data.charts.monthlySales} />
          </div>
          <div className="chart-card-small">
            <CategoryChart data={data.charts.categorySales} />
          </div>
        </div>
      </div>

      {/* Visitors Chart */}
      <div className="dashboard-section">
        <VisitorsChart data={data.charts.dailyVisitors} />
      </div>

      {/* Widgets Row */}
      <div className="dashboard-section">
        <div className="dashboard-widgets-grid">
          <div className="widget-card">
            <RecentOrders orders={data.widgets.recentOrders} />
          </div>
          <div className="widget-card">
            <TopProducts products={data.widgets.topProducts} />
          </div>
        </div>
      </div>

      {/* Daily Visitors Table */}
      <div className="dashboard-section">
        <DailyVisitors data={data.charts.dailyVisitors} />
      </div>

      {/* Notification Alert */}
      {data.charts.dailyVisitorsNotification?.message && (
        <div className="dashboard-notification">
          <div className="notification-card">
            <div className="notification-icon">
              <i className="bi bi-info-circle-fill"></i>
            </div>
            <div className="notification-content">
              <div className="notification-title">Visitor Data Notice</div>
              <div className="notification-message">
                {data.charts.dailyVisitorsNotification.message}
              </div>
              {data.charts.dailyVisitorsNotification.cleanupTime && (
                <div className="notification-meta">
                  <i className="bi bi-clock me-1"></i>
                  Cleanup Time: {data.charts.dailyVisitorsNotification.cleanupTime}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
