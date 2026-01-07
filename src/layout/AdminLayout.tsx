import { Outlet } from "react-router-dom";
import DashboardSidebar from "../pages/admin/Dashboard/DashboardSidebar";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <DashboardSidebar />

      <main style={{ flex: 1, overflowY: "auto" }}>
        <Outlet /> {/* or your routes */}
      </main>
    </div>
  );
}
