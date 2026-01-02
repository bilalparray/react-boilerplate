import { fetchBanners } from "../api/banner.api";
import { Banner } from "../models/Banner";

export async function getBanners(): Promise<Banner[]> {
  const res = await fetchBanners();

  if (res.isError || !res.successData) return [];

  return res.successData.map(
    (b) =>
      new Banner(
        b.id,
        b.title,
        b.description,
        b.imagePath,
        b.link,
        b.ctaText ?? "",
        b.image_base64 ?? ""
      )
  );
}
