import { useEffect, useState } from "react";
import {
  fetchReviews,
  fetchReviewCount,
  updateReviewStatus,
} from "../../api/admin/review.api";

export function useReviews(page: number, pageSize: number) {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const skip = (page - 1) * pageSize;

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const [list, count] = await Promise.all([
        fetchReviews(skip, pageSize),
        fetchReviewCount(),
      ]);

      setItems(list.successData || []);
      setTotal(count.successData?.intResponse || 0);
    } catch {
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  const setStatus = async (id: number, approved: boolean) => {
    try {
      setActionLoading(true);
      await updateReviewStatus(id, approved);
      await load();
    } catch (e: any) {
      setError(e?.errorData?.displayMessage || "Update failed");
    } finally {
      setActionLoading(false);
    }
  };

  return {
    items,
    total,
    loading,
    actionLoading,
    error,
    setStatus,
  };
}
