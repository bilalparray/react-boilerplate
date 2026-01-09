import { useEffect, useState } from "react";
import { fetchOrdersByEmail } from "../api/order.api";

export function useMyOrders(email: string, page: number, pageSize: number) {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const skip = (page - 1) * pageSize;

  const load = async () => {
    if (!email) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetchOrdersByEmail(email, skip, pageSize);

      setOrders(res.successData?.data || []);
      setTotal(res.successData?.total || 0);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [email, page]);

  return {
    orders,
    total,
    loading,
    error,
    reload: load,
  };
}
