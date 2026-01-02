import type { BannerDTO } from "../dto/bannerDTO";
import { apiGet } from "./base/apiClient";

export function fetchBanners() {
  return apiGet<BannerDTO[]>("/banner/getall");
}
