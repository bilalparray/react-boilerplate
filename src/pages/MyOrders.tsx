import { useMemo, useState } from "react";
import { useMyOrders } from "../hooks/useMyOrders";

const STATUS = ["all", "created", "paid", "shipped", "delivered", "cancelled"];

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

  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const submit = () => {
    setPage(1);
    setSubmittedEmail(email.trim());
  };

  /* ---------------- Filtering ---------------- */

  const filtered = useMemo(() => {
    let data = [...orders];

    if (status !== "all") data = data.filter((o) => o.status === status);

    if (search) {
      const s = search.toLowerCase();
      data = data.filter(
        (o) =>
          o.razorpayOrderId.toLowerCase().includes(s) ||
          o.items.some((i: any) => i.product.name.toLowerCase().includes(s))
      );
    }

    if (sort === "newest")
      data.sort(
        (a, b) =>
          new Date(b.createdOnUTC).getTime() -
          new Date(a.createdOnUTC).getTime()
      );

    if (sort === "oldest")
      data.sort(
        (a, b) =>
          new Date(a.createdOnUTC).getTime() -
          new Date(b.createdOnUTC).getTime()
      );

    if (sort === "high") data.sort((a, b) => b.amount - a.amount);
    if (sort === "low") data.sort((a, b) => a.amount - b.amount);

    return data;
  }, [orders, status, sort, search]);

  const totalPages = Math.ceil(total / pageSize);

  /* ---------------- Invoice ---------------- */

  const downloadInvoice = (o: any) => {
    const html = `
      <div style="font-family:Arial;padding:24px">
        <h2>Wild Valley Foods</h2>
        <p><b>Invoice:</b> myorders_${o.id}</p>
        <p><b>Order:</b> ${o.razorpayOrderId}</p>
        <p><b>Date:</b> ${new Date(o.createdOnUTC).toLocaleString()}</p>
        <hr/>
        ${o.items
          .map(
            (i: any) => `
          <div style="display:flex;justify-content:space-between">
            <div>
              ${i.product.name} (${i.variant.weight}${i.variant.unitSymbol})<br/>
              SKU: ${i.variant.sku}
            </div>
            <div>₹${i.total}</div>
          </div>`
          )
          .join("")}
        <hr/>
        <p>Subtotal: ₹${o.amount}</p>
        <p>Paid: ₹${o.paid_amount}</p>
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

      <div className="row g-2 mb-4">
        <div className="col-12 col-md-10">
          <input
            className="form-control rounded-pill"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="col-12 col-md-2">
          <button
            className="btn btn-success rounded-pill w-100"
            onClick={submit}>
            Fetch Orders
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {submittedEmail && (
        <div className="row">
          {/* Left Filters */}
          <div className="col-md-3">
            <div className="card p-3 shadow-sm sticky-top" style={{ top: 80 }}>
              <h6>Status</h6>
              {STATUS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`btn w-100 mb-2 ${
                    status === s ? "btn-success" : "btn-outline-secondary"
                  }`}>
                  {s.toUpperCase()}
                </button>
              ))}

              <hr />

              <input
                className="form-control mb-2"
                placeholder="Search order or product"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="form-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="high">Total: High → Low</option>
                <option value="low">Total: Low → High</option>
              </select>
            </div>
          </div>

          {/* Orders */}
          <div className="col-md-9">
            {loading ? (
              <div className="text-center py-5">Loading…</div>
            ) : (
              <>
                {filtered.map((o) => (
                  <div key={o.id} className="card mb-4 shadow-sm">
                    <div className="card-body d-flex justify-content-between">
                      <div>
                        <div className="fw-bold">Order #{o.id}</div>
                        <small>{o.razorpayOrderId}</small>
                        <div className="text-muted small">
                          {new Date(o.createdOnUTC).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="text-end">
                        <div className="fw-bold text-success">₹{o.amount}</div>
                        <span className="badge bg-dark">{o.status}</span>
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

                    {expanded === o.id && (
                      <div className="border-top p-4 bg-light">
                        {o.items.map((i: any) => (
                          <div
                            key={i.id}
                            className="d-flex justify-content-between mb-3">
                            <div>
                              <b>{i.product.name}</b>
                              <br />
                              SKU: {i.variant.sku}
                              <br />
                              Weight: {i.variant.weight}
                              {i.variant.unitSymbol}
                            </div>
                            <div>
                              Qty: {i.quantity}
                              <br />
                              Price: ₹{i.price}
                              <br />
                              Line: ₹{i.total}
                            </div>
                          </div>
                        ))}

                        <hr />

                        <div className="row">
                          <div className="col-md-6 small">
                            <div>Status: {o.status}</div>
                            <div>Payment ID: {o.paymentId || "-"}</div>
                            <div>Receipt: {o.receipt}</div>
                            <div>
                              Customer: {o.customer.firstName}{" "}
                              {o.customer.lastName}
                            </div>
                            <div>Email: {o.customer.email}</div>
                          </div>

                          <div className="col-md-6 text-end">
                            <div>Subtotal ₹{o.amount}</div>
                            <div>Paid ₹{o.paid_amount}</div>
                            <div className="fw-bold fs-5">
                              Total ₹{o.amount}
                            </div>
                            <button
                              className="btn btn-outline-success btn-sm mt-2"
                              onClick={() => downloadInvoice(o)}>
                              Download Invoice
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
          </div>
        </div>
      )}
    </div>
  );
}
