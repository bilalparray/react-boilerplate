import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchInvoiceByOrder } from "../../../services/admin/invoice.service";

export default function InvoicePage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoiceByOrder(Number(id)).then((data) => {
      setInvoice(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  const { customer, items, totals, payment } = invoice;

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        <div className="card shadow-sm border-0 p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
            <div>
              <h4 className="mb-0">Invoice</h4>
              <small className="text-muted">{invoice.invoiceNumber}</small>
            </div>
            <button className="btn btn-primary" onClick={() => window.print()}>
              Download PDF
            </button>
          </div>

          {/* Company + Customer */}
          <div className="row mb-4">
            <div className="col-md-6">
              <h6 className="text-uppercase text-muted">From</h6>
              <strong>Wild Valley Foods</strong>
              <div className="text-muted small">Premium Kashmiri Foods</div>
              <div className="text-muted small">support@wildvalleyfoods.in</div>
            </div>

            <div className="col-md-6 text-md-end mt-3 mt-md-0">
              <h6 className="text-uppercase text-muted">Bill To</h6>
              <strong>{customer.name}</strong>
              <div className="text-muted small">{customer.email}</div>
              <div className="text-muted small">{customer.contact}</div>
              <div className="text-muted small">
                {customer.address.addressLine1}, {customer.address.city},{" "}
                {customer.address.state} {customer.address.postalCode}
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="text-muted small">Invoice Date</div>
              <div>{new Date(invoice.invoiceDate).toLocaleDateString()}</div>
            </div>
            <div className="col-md-4">
              <div className="text-muted small">Order ID</div>
              <div>{invoice.orderNumber}</div>
            </div>
            <div className="col-md-4">
              <div className="text-muted small">Payment Method</div>
              <div className="text-capitalize">{payment.method}</div>
            </div>
          </div>

          {/* Items */}
          <div className="table-responsive mb-4">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th className="text-center">Qty</th>
                  <th className="text-end">Unit Price</th>
                  <th className="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i: any) => (
                  <tr key={i.id}>
                    <td>
                      <div className="fw-semibold">{i.productName}</div>
                      <div className="text-muted small">
                        {i.variantDetails.quantity}{" "}
                        {i.variantDetails.unitSymbol}
                      </div>
                    </td>
                    <td>{i.variantSku}</td>
                    <td className="text-center">{i.quantity}</td>
                    <td className="text-end">₹{i.unitPrice.toFixed(2)}</td>
                    <td className="text-end fw-semibold">
                      ₹{i.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="row justify-content-end">
            <div className="col-md-5">
              <div className="border-top pt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span>₹{totals.subtotal}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Tax</span>
                  <span>₹{totals.taxAmount}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Shipping</span>
                  <span>₹{totals.shippingAmount}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fs-5 fw-bold">
                  <span>Total</span>
                  <span>₹{totals.totalAmount}</span>
                </div>
                <div className="d-flex justify-content-between text-success mt-2">
                  <span>Paid</span>
                  <span>₹{totals.paidAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-muted small mt-5">
            Thank you for shopping with Wild Valley Foods.
          </div>
        </div>
      </div>
    </div>
  );
}
