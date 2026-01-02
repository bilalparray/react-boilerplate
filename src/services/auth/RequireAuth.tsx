import { Navigate, Outlet } from "react-router-dom";
import { getAuthState } from "./authService";

export function RequireAuth({ role }: { role?: string }) {
  const auth = getAuthState();

  if (!auth.authenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (role && auth.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
