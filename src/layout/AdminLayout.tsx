import { Outlet, useLocation } from "react-router-dom";
import DashboardSidebar from "../pages/admin/Dashboard/DashboardSidebar";
import AdminTopNav from "../components/admin/nav/AdminTopNav";
import "./AdminLayout.css";

export default function AdminLayout() {
  const { pathname } = useLocation();
  const page = pathname.split("/")[1];

  return (
    <div className="admin-layout">
      <DashboardSidebar />

      <div className="admin-content">
        {/* <AdminTopNav  title={page.toUpperCase()} /> */}

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
