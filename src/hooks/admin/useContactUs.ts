import { useEffect, useState } from "react";
import {
  fetchContactUs,
  fetchContactUsCount,
  createContactUs,
  updateContactUs,
  deleteContactUs,
} from "../../api/admin/contactus.api";

export function useContactUs(page: number, pageSize: number) {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const skip = (page - 1) * pageSize;

  const load = async () => {
    try {
      setLoading(true);
      const [list, count] = await Promise.all([
        fetchContactUs(skip, pageSize),
        fetchContactUsCount(),
      ]);

      setItems(list.successData || []);
      setTotal(count.successData?.intResponse || 0);
    } catch {
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, pageSize]);

  const create = async (data: any) => {
    try {
      setActionLoading(true);
      await createContactUs(data);
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
      await updateContactUs(id, data);
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
      await deleteContactUs(id);
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
