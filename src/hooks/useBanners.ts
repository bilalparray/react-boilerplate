import { useQuery } from "@tanstack/react-query";
import { getBanners } from "../api/banners";

export function useBanners() {
  return useQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
  });
}
