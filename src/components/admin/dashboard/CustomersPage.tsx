import { useEffect, useState } from "react";
import {
  fetchCustomers,
  removeCustomer,
} from "../../../services/admin/customers.service";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetchCustomers({
      skip: (page - 1) * pageSize,
      top: pageSize,
      search: search || undefined,
    });
    setCustomers(res.data);
    setTotal(res.total);
    setHasMore(res.hasMore);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [page, search]);

  const deleteRow = async (id: number) => {
    if (!confirm("Delete this customer permanently?")) return;
    await removeCustomer(id);
    setPage(1);
    load();
  };

  return (
    <div className="p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Customers</h3>
          <div className="text-muted">{total} total customers</div>
        </div>

        <div className="d-flex gap-2">
          <input
            className="form-control"
            style={{ width: 260 }}
            placeholder="Search name, email, phone…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="card border-0 shadow-sm">
        {loading ? (
          <div className="p-5 text-center">
            <div className="spinner-border text-primary" />
            <div className="mt-2 text-muted">Loading customers…</div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Addresses</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td className="fw-semibold">
                      {c.firstName} {c.lastName}
                    </td>
                    <td>{c.email}</td>
                    <td>{c.contact}</td>
                    <td style={{ maxWidth: 280 }}>
                      {c.addresses.map((a: any, i: number) => (
                        <div key={i} className="small text-muted">
                          {a.addressLine1}, {a.city}
                        </div>
                      ))}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteRow(c.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {customers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-muted">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer / Pagination */}
        <div className="d-flex justify-content-between align-items-center p-3 border-top">
          <div className="text-muted">
            Showing {(page - 1) * pageSize + 1} –{" "}
            {Math.min(page * pageSize, total)} of {total}
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}>
              ← Prev
            </button>

            <span className="fw-semibold">Page {page}</span>

            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={!hasMore}
              onClick={() => setPage((p) => p + 1)}>
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
