import {
  getCustomers,
  deleteCustomer as deleteCustomerApi,
} from "../../api/admin/customers.client";

export async function fetchCustomers(params: {
  skip: number;
  top: number;
  search?: string;
}) {
  const res = await getCustomers(params);
  return res.successData; // { data, total, hasMore }
}

export async function removeCustomer(id: number) {
  return deleteCustomerApi(id);
}
