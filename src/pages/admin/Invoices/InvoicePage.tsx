import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchInvoiceByOrder,
  fetchInvoiceByRazorpay,
} from "../../../services/admin/invoice.service";

export default function InvoicePage() {
  const { id } = useParams(); // can be orderId or invoiceNumber

  const [invoice, setInvoice] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    const isNumber = /^\d+$/.test(id);

    const apiCall = isNumber
      ? fetchInvoiceByOrder(Number(id))
      : fetchInvoiceByRazorpay(id);

    apiCall
      .then((res) => {
        if (!res || !res.successData) {
          throw new Error("Invalid invoice response");
        }
        setInvoice(res.successData);
      })
      .catch(() => {
        setError("Invoice not found");
      })
      .finally(() => setLoading(false));
  }, [id]);

  /* ---------- HARD SAFETY GATE ---------- */
  if (loading) {
    return (
      <div className="p-5 text-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (error || !invoice || !invoice.customer) {
    return (
      <div className="p-5 text-center text-danger fw-semibold">
        {error || "Invoice data is corrupted"}
      </div>
    );
  }

  /* ---------- SAFE DATA ---------- */
  const { customer, items, totals, payment } = invoice;

  return (
    <div className="p-4 bg-light min-vh-100">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          {/* Header */}
          <div className="d-flex justify-content-between mb-4">
            <div>
              <h4 className="fw-bold mb-1">Invoice</h4>
              <div className="text-muted">{invoice.invoiceNumber}</div>
            </div>
            <button className="btn btn-primary" onClick={() => window.print()}>
              Print / Save PDF
            </button>
          </div>

          {/* Billing */}
          <div className="row mb-4">
            <div className="col-md-6">
              <h6 className="text-muted">Bill To</h6>
              <div className="fw-semibold">{customer.name}</div>
              <div>{customer.email}</div>
              <div>{customer.contact}</div>
              <div className="text-muted">
                {customer.address?.addressLine1}, {customer.address?.city}
              </div>
            </div>

            <div className="col-md-6 text-end">
              <div>
                Invoice Date:{" "}
                {new Date(invoice.invoiceDate).toLocaleDateString()}
              </div>
              <div>Order: {invoice.orderNumber}</div>
              <div>Payment: {payment?.method}</div>
            </div>
          </div>

          {/* Items */}
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i: any) => (
                <tr key={i.id}>
                  <td>{i.productName}</td>
                  <td>{i.variantSku}</td>
                  <td>{i.quantity}</td>
                  <td>
                    {i.variantDetails.quantity} {i.variantDetails.unitSymbol}
                  </td>
                  <td>₹{i.unitPrice}</td>
                  <td>₹{i.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="row justify-content-end mt-4">
            <div className="col-md-4">
              <div className="d-flex justify-content-between">
                <span>Subtotal</span>
                <span>₹{totals.subtotal}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Tax</span>
                <span>₹{totals.taxAmount}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Shipping</span>
                <span>₹{totals.shippingAmount}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span>₹{totals.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
