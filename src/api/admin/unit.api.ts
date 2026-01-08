import { apiDelete, apiGet, apiPost, apiPut } from "../base/apiClient";

/* List */
export function fetchUnits(skip: number, top: number) {
  return apiGet<any>(
    `/admin/unit-values/getAllUnitsBySkipTop?skip=${skip}&top=${top}`
  );
}

/* Count */
export function fetchUnitCount() {
  return apiGet<any>(`/admin/unit-values/count`);
}

/* Create */
export function createUnit(payload: any) {
  return apiPost<any>(`/admin/unit-values/createUnit`, {
    reqData: payload,
  });
}

/* Update */
export function updateUnit(id: number, payload: any) {
  return apiPut<any>(`/admin/unit-values/updateUnit/${id}`, {
    reqData: payload,
  });
}

/* Delete */
export function deleteUnit(id: number) {
  return apiDelete<any>(`/admin/unit-values/deleteUnit/${id}`);
}
