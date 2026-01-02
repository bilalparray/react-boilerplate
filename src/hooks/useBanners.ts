// hooks/useBanners.ts
import { useEffect, useState } from "react";
import { Banner } from "../models/Banner";
import { getBanners } from "../services/BannerService";

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBanners().then((b) => {
      setBanners(b);
      setLoading(false);
    });
  }, []);

  return { banners, loading };
}
