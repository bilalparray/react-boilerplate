import { apiPost } from "./base/apiClient";

export function createContactRequest(reqData: {
  name: string;
  email: string;
  description: string;
}) {
  return apiPost<any>("/contactus/create", { reqData });
}
