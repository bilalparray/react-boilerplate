import type { BannerDTO } from "../dto/bannerDTO";
import { apiDelete, apiGet, apiPost, apiPut } from "./base/apiClient";

export function fetchBanners() {
  return apiGet<BannerDTO[]>("/banner/getall");
}

/* List */
export function fetchPaginatedBanners(skip: number, top: number) {
  return apiGet<BannerDTO[]>(
    `/banner/getall/paginated?skip=${skip}&top=${top}`
  );
}

/* Count */
export function fetchBannerCount() {
  return apiGet<any>(`/banner/count`);
}

/* Create */
export function createBanner(payload: any) {
  return apiPost(
    "/banner/create",
    {
      reqData: payload,
    },
    true
  );
}

/* Update */
export function updateBanner(id: number, payload: any) {
  return apiPut(`/banner/update/${id}`, {
    reqData: payload,
  });
}

/* Delete */
export function deleteBanner(id: number) {
  return apiDelete(`/banner/delete/${id}`);
}
