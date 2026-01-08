import { useEffect, useState } from "react";
import {
  fetchUnits,
  fetchUnitCount,
  createUnit,
  updateUnit,
  deleteUnit,
} from "../../api/admin/unit.api";

export function useUnits(page: number, pageSize: number) {
  const [units, setUnits] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true); // Page loading
  const [actionLoading, setActionLoading] = useState(false); // CRUD loading
  const [error, setError] = useState<string | null>(null);

  const skip = (page - 1) * pageSize;

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const [listRes, countRes] = await Promise.all([
        fetchUnits(skip, pageSize),
        fetchUnitCount(),
      ]);

      setUnits(listRes.successData);
      setTotal(countRes.successData.intResponse);
    } catch (e: any) {
      setError("Failed to load units");
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
      await createUnit(data);
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
      await updateUnit(id, data);
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
      const res = await deleteUnit(id);
      if (res.isError) {
        alert(res.errorData?.displayMessage);
      } else {
        alert("Unit deleted successfully");
        await load();
      }
    } catch (e: any) {
      setError(
        e?.errorData?.displayMessage ||
          "Cannot delete this unit because it is in use."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return {
    units,
    total,
    loading,
    actionLoading,
    error,
    create,
    update,
    remove,
  };
}
