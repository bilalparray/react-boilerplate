import { getInvoiceByOrder } from "../../api/admin/invoice.client";

export async function fetchInvoiceByOrder(orderId: number) {
  const res = await getInvoiceByOrder(orderId);
  return res.successData;
}
