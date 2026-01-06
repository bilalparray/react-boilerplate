import "./Dashboard.css";
export default function DashboardPage() {
  return (
    <div className="p-4">
      <div className="bg-white rounded-4 p-4 shadow-sm">
        <h4 className="fw-bold">Dashboard</h4>
        <p className="text-muted">Admin overview</p>

        <div className="alert alert-info mt-3">
          Your admin data will render here.
        </div>
      </div>
    </div>
  );
}
