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
export function createBanner(formData: FormData) {
  return apiPost("/banner/create", formData, true);
}

/* Update */
export function updateBanner(id: number, formData: FormData) {
  return apiPut(`/banner/update/${id}`, formData, true);
}

/* Delete */
export function deleteBanner(id: number) {
  return apiDelete(`/banner/delete/${id}`);
}
