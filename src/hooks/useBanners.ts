import { useEffect, useState } from "react";
import { Banner } from "../models/Banner";
import { getBanners } from "../services/BannerService";
import {
  fetchPaginatedBanners,
  fetchBannerCount,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../api/banner.api";

/* ---------------- FRONTEND ---------------- */
export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBanners()
      .then(setBanners)
      .finally(() => setLoading(false));
  }, []);
  console.log(banners);

  return { banners, loading };
}

/* ---------------- ADMIN ---------------- */
export function useAdminBanners(page: number, pageSize: number) {
  const [banners, setBanners] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const skip = (page - 1) * pageSize;

  const load = async () => {
    try {
      setLoading(true);
      const [list, count] = await Promise.all([
        fetchPaginatedBanners(skip, pageSize),
        fetchBannerCount(),
      ]);

      setBanners(list.successData || []);
      setTotal(count.successData?.intResponse || 0);
    } catch {
      setError("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, pageSize]);

  const create = async (payload: any) => {
    try {
      setActionLoading(true);
      setError(null);
      await createBanner(payload);
      await load();
    } catch (e: any) {
      setError(e?.errorData?.displayMessage || "Create failed");
    } finally {
      setActionLoading(false);
    }
  };

  const update = async (id: number, payload: any) => {
    try {
      setActionLoading(true);
      setError(null);
      await updateBanner(id, payload);
      await load();
    } catch (e: any) {
      setError(e?.errorData?.displayMessage || "Update failed");
    } finally {
      setActionLoading(false);
    }
  };

  const remove = async (id: number) => {
    try {
      setActionLoading(true);
      setError(null);
      await deleteBanner(id);
      await load();
    } catch (e: any) {
      setError(e?.errorData?.displayMessage || "Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  return {
    banners,
    total,
    loading,
    actionLoading,
    error,
    create,
    update,
    remove,
  };
}
