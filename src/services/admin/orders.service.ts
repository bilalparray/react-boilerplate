import {
  getOrders,
  getOrder,
  getCustomers,
  setOrderStatus,
} from "../../api/admin/orders.client";

export interface OrderFilters {
  page: number;
  pageSize: number;
  customerName?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  minAmount?: number;
  maxAmount?: number;
}

export async function fetchOrders(filters: OrderFilters) {
  const skip = (filters.page - 1) * filters.pageSize;
  const top = filters.pageSize;

  const params = new URLSearchParams({
    skip: String(skip),
    top: String(top),
    customerName: filters.customerName || "",
    status: filters.status || "",
    startDate: filters.startDate || "",
    endDate: filters.endDate || "",
    search: filters.search || "",
    minAmount: filters.minAmount?.toString() || "",
    maxAmount: filters.maxAmount?.toString() || "",
  });

  const res = await getOrders(params.toString());

  return {
    orders: res.successData.data,
    total: res.successData.total,
    hasMore: res.successData.hasMore,
  };
}

export function fetchCustomers() {
  return getCustomers();
}

export function fetchOrderById(id: number) {
  return getOrder(id);
}

export function updateStatus(orderId: number, status: string) {
  return setOrderStatus(orderId, status);
}
