import { apiGet, apiPost, apiDelete, apiPut } from "../base/apiClient";

/* Paginated list */
export function fetchContactUs(skip: number, top: number) {
  return apiGet<any>(`/contactus/getall/paginated?skip=${skip}&top=${top}`);
}

/* Count */
export function fetchContactUsCount() {
  return apiGet<any>(`/contactus/count`);
}

/* Create */
export function createContactUs(payload: any) {
  return apiPost(`/contactus/create`, {
    reqData: payload,
  });
}

/* Delete */
export function deleteContactUs(id: number) {
  return apiDelete(`/contactus/delete/${id}`, true);
}
export function updateContactUs(id: number, payload: any) {
  return apiPut(`/contactus/update/${id}`, {
    reqData: payload,
  });
}
