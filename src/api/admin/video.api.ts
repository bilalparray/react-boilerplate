import { apiGet, apiPost, apiPut, apiDelete } from "../base/apiClient";

/* List */
export function fetchVideos(skip: number, top: number) {
  return apiGet<any>(`/video/getall/paginated?skip=${skip}&top=${top}`);
}

/* Count */
export function fetchVideoCount() {
  return apiGet<any>(`/video/count`);
}

/* Create */
export function createVideo(payload: any) {
  return apiPost(`/video/create`, {
    reqData: payload,
  });
}

/* Update */
export function updateVideo(id: number, payload: any) {
  return apiPut(`/video/update/${id}`, {
    reqData: payload,
  });
}

/* Delete */
export function deleteVideo(id: number) {
  return apiDelete(`/video/delete/${id}`);
}
