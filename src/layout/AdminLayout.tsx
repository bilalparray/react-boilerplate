import { Outlet } from "react-router-dom";
import DashboardSidebar from "../pages/admin/Dashboard/DashboardSidebar";

export default function AdminLayout() {
  return (
    <div className="d-flex min-vh-100 bg-light">
      <DashboardSidebar />
      <div className="flex-grow-1">
        <div className="bg-white shadow-sm px-4 py-3">
          <h6 className="fw-bold mb-0">Admin Panel</h6>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
