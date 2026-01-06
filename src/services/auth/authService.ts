import { loginApi } from "../../api/auth/auth.api";
import { decodeJwt } from "../../auth/jwt";
import { getToken } from "../../auth/tokenManager";

export function getAuthState() {
  const token = getToken();
  if (!token) return { authenticated: false };

  const payload = decodeJwt(token);
  if (!payload) return { authenticated: false };

  const now = Date.now() / 1000;
  if (payload.exp < now) return { authenticated: false };

  return {
    authenticated: true,
    role: payload.role,
    userId: payload.sub,
  };
}
export async function loginUser(username: string, password: string) {
  const res = await loginApi({ username, role: "Admin", password });

  if (res.isError || !res.successData) {
    throw new Error(res.errorData?.displayMessage || "Login failed");
  }

  return res.successData;
}
