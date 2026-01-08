import { useEffect, useState } from "react";
import {
  fetchVideos,
  fetchVideoCount,
  createVideo,
  updateVideo,
  deleteVideo,
} from "../../api/admin/video.api";

export function useVideos(page: number, pageSize: number) {
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

      const [listRes, countRes] = await Promise.all([
        fetchVideos(skip, pageSize),
        fetchVideoCount(),
      ]);

      setItems(listRes.successData || []);
      setTotal(countRes.successData?.intResponse || 0);
    } catch {
      setError("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  const create = async (data: any) => {
    try {
      setActionLoading(true);
      setError(null);
      await createVideo(data);
      await load();
    } catch (e: any) {
      setError(e?.errorData?.displayMessage || "Create failed");
    } finally {
      setActionLoading(false);
    }
  };

  const update = async (id: number, data: any) => {
    try {
      setActionLoading(true);
      setError(null);
      await updateVideo(id, data);
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
      await deleteVideo(id);
      await load();
    } catch (e: any) {
      setError(e?.errorData?.displayMessage || "Delete failed");
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
    create,
    update,
    remove,
  };
}
