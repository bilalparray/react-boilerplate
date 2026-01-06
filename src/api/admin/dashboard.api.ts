import type { DashboardResponseDTO } from "../../dto/admin/dashboardDTO";
import { apiGet } from "../base/apiClient";

export function fetchDashboard() {
  return apiGet<DashboardResponseDTO>("/dashboard");
}
