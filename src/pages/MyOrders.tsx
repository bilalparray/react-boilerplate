import { useMemo, useState } from "react";
import { useMyOrders } from "../hooks/useMyOrders";

const TABS = ["all", "created", "paid", "shipped", "delivered", "cancelled"];

export default function MyOrders() {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { orders, total, loading, error } = useMyOrders(
    submittedEmail,
    page,
    pageSize
  );

  const [tab, setTab] = useState("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  const submit = () => {
    setPage(1);
    setSubmittedEmail(email.trim());
  };

  /* ---------------- Filtering ---------------- */

  const filtered = useMemo(() => {
    let data = [...orders];
    if (tab !== "all") data = data.filter((o) => o.status === tab);
    return data;
  }, [orders, tab]);

  const totalPages = Math.ceil(total / pageSize);

  /* ---------------- Invoice Print ---------------- */

  const downloadInvoice = (o: any) => {
    const html = `
    <div style="font-family:Arial;padding:24px">
      <h2>Wild Valley Foods</h2>
      <p>Invoice: myorders_${o.id}</p>
      <p>${new Date(o.createdOnUTC).toLocaleString()}</p>
      <hr/>
      ${o.items
        .map(
          (i: any) => `
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <div>${i.product.name} (${i.variant.weight}${i.variant.unitSymbol})</div>
          <div>₹${i.total}</div>
        </div>
      `
        )
        .join("")}
      <hr/>
      <h3>Total ₹${o.amount}</h3>
    </div>
  `;

    const w = window.open("");
    w!.document.write(
      `<html><head><title>myorders_${o.id}</title></head><body>${html}</body></html>`
    );
    w!.document.close();
    w!.print();
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">My Orders</h2>

      <div className="d-flex gap-2 mb-4">
        <input
          className="form-control"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn btn-success" onClick={submit}>
          Get Orders
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {submittedEmail && (
        <>
          {/* Tabs */}
          <div className="d-flex gap-2 mb-4 flex-wrap">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`btn btn-sm ${
                  tab === t ? "btn-primary" : "btn-outline-secondary"
                }`}>
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-5">Loading…</div>
          ) : (
            <>
              {filtered.map((o) => (
                <div key={o.id} className="card mb-4 shadow-sm">
                  {/* HEADER */}
                  <div className="card-body border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold fs-5">Order #{o.id}</div>
                        <small className="text-muted">
                          Placed:{" "}
                          {new Date(o.createdOnUTC).toLocaleDateString()}
                        </small>
                        <div className="small text-muted">
                          Order ID: {o.razorpayOrderId}
                        </div>
                      </div>

                      <div className="text-end">
                        <div className="fw-bold text-success">₹{o.amount}</div>
                        <div className="badge bg-dark">{o.status}</div>
                        <div>
                          <button
                            className="btn btn-link btn-sm"
                            onClick={() =>
                              setExpanded(expanded === o.id ? null : o.id)
                            }>
                            {expanded === o.id ? "Hide" : "View"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DETAILS */}
                  {expanded === o.id && (
                    <div className="card-body">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th className="text-end">Line Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {o.items.map((i: any) => (
                            <tr key={i.id}>
                              <td className="d-flex gap-3">
                                {i.product.images?.[0] && (
                                  <img
                                    src={i.product.images[0]}
                                    width={50}
                                    height={50}
                                    className="rounded"
                                  />
                                )}
                                <div>
                                  <div className="fw-semibold">
                                    {i.product.name}
                                  </div>
                                  <small className="text-muted">
                                    {i.variant.weight}
                                    {i.variant.unitSymbol}
                                  </small>
                                </div>
                              </td>
                              <td>{i.quantity}</td>
                              <td>₹{i.price}</td>
                              <td className="text-end">₹{i.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="row mt-3">
                        <div className="col-md-6 small">
                          <div>Status: {o.status}</div>
                          <div>Payment ID: {o.paymentId || "-"}</div>
                          <div>
                            Customer: {o.customer.firstName}{" "}
                            {o.customer.lastName}
                          </div>
                        </div>

                        <div className="col-md-6 text-end">
                          <div>Subtotal ₹{o.amount}</div>
                          <div>Paid ₹{o.paid_amount}</div>
                          <div className="fw-bold fs-5">Total ₹{o.amount}</div>

                          <button
                            className="btn btn-outline-primary btn-sm mt-2"
                            onClick={() => downloadInvoice(o)}>
                            Download Invoice PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination */}
              <div className="d-flex justify-content-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`btn btn-sm ${
                      page === i + 1 ? "btn-success" : "btn-outline-secondary"
                    }`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
