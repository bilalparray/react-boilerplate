import { apiPost } from "../base/apiClient";

export function loginApi(reqData: {
  username: string;
  role: string;
  password: string;
}) {
  return apiPost<any>("/login", { reqData });
}
