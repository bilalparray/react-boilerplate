import { useEffect, useState } from "react";
import type { DashboardResponseDTO } from "../../dto/admin/dashboardDTO";
import { fetchDashboard } from "../../api/admin/dashboard.api";

export function useDashboard() {
  const [data, setData] = useState<DashboardResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard().then((res) => {
      if (res.isError) {
        setError(res.errorData?.displayMessage || "Failed to load dashboard");
      } else {
        setData(res.successData);
      }
      setLoading(false);
    });
  }, []);

  return { data, loading, error };
}
