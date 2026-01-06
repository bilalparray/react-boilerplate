import { Link } from "react-router-dom";
import "./DashboardSidebar.css";

export default function DashboardSidebar() {
  return (
    <aside className="dashboard-sidebar">
      <div className="p-4 fw-bold fs-4 text-success">Alpine Admin</div>

      <nav className="px-3">
        <Link to="/dashboard/overview" className="dash-link">
          <i className="bi bi-speedometer2" /> Overview
        </Link>
        <Link to="/dashboard/orders" className="dash-link">
          <i className="bi bi-receipt" /> Orders
        </Link>
        <Link to="/dashboard/products" className="dash-link">
          <i className="bi bi-box" /> Products
        </Link>
        <Link to="/dashboard/customers" className="dash-link">
          <i className="bi bi-people" /> Customers
        </Link>
        <Link to="/dashboard/reviews" className="dash-link">
          <i className="bi bi-star" /> Reviews
        </Link>
        <Link to="/dashboard/settings" className="dash-link">
          <i className="bi bi-gear" /> Settings
        </Link>
      </nav>
    </aside>
  );
}
