import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchInvoiceByOrder,
  fetchInvoiceByRazorpay,
} from "../../../services/admin/invoice.service";
import "./InvoicePage.css";

export default function InvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="invoice-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading invoice...</p>
      </div>
    );
  }

  if (error || !invoice || !invoice.customer) {
    return (
      <div className="invoice-error">
        <div className="error-content">
          <i className="bi bi-exclamation-triangle-fill error-icon"></i>
          <h5 className="error-title">Invoice Not Found</h5>
          <p className="error-text">
            {error || "Invoice data is corrupted or unavailable"}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/invoices")}>
            <i className="bi bi-arrow-left me-2"></i>
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  const { customer, items, totals, payment } = invoice;

  return (
    <div className="invoice-page">
      {/* Action Bar */}
      <div className="invoice-actions-bar">
        <button
          className="btn btn-outline-secondary btn-back"
          onClick={() => navigate("/invoices")}>
          <i className="bi bi-arrow-left me-2"></i>
          Back to Invoices
        </button>
        <div className="action-buttons-group">
          <button
            className="btn btn-outline-primary"
            onClick={() => window.print()}>
            <i className="bi bi-printer me-2"></i>
            Print
          </button>
          <button className="btn btn-primary" onClick={() => window.print()}>
            <i className="bi bi-download me-2"></i>
            Download PDF
          </button>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="invoice-document">
        {/* Invoice Header */}
        <div className="invoice-header">
          <div className="invoice-header-left">
            <div className="invoice-logo">
              <i className="bi bi-receipt-cutoff"></i>
            </div>
            <div>
              <h1 className="invoice-company-name"> Alpine Saffron Commerce</h1>
              <p className="invoice-company-tagline">
                Premium Kashmiri Products
              </p>
            </div>
          </div>
          <div className="invoice-header-right">
            <h2 className="invoice-title">INVOICE</h2>
            <div className="invoice-number-display">
              <span className="invoice-label">Invoice #</span>
              <span className="invoice-number-value">
                {invoice.invoiceNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Info Section */}
        <div className="invoice-info-section">
          <div className="invoice-bill-to">
            <h3 className="section-title">
              <i className="bi bi-person-fill me-2"></i>
              Bill To
            </h3>
            <div className="customer-details">
              <div className="customer-name">{customer.name || "N/A"}</div>
              <div className="customer-email">
                <i className="bi bi-envelope me-2"></i>
                {customer.email || "N/A"}
              </div>
              <div className="customer-phone">
                <i className="bi bi-telephone me-2"></i>
                {customer.contact || "N/A"}
              </div>
              {customer.address && (
                <div className="customer-address">
                  <i className="bi bi-geo-alt-fill me-2"></i>
                  <div>
                    {customer.address.addressLine1}
                    {customer.address.addressLine2 && (
                      <>, {customer.address.addressLine2}</>
                    )}
                    <br />
                    {customer.address.city}, {customer.address.state}{" "}
                    {customer.address.postalCode}
                    <br />
                    {customer.address.country}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="invoice-meta">
            <div className="meta-item">
              <span className="meta-label">Invoice Date</span>
              <span className="meta-value">
                {formatDate(invoice.invoiceDate)}
              </span>
            </div>
            {invoice.orderNumber && (
              <div className="meta-item">
                <span className="meta-label">Order Number</span>
                <span className="meta-value">{invoice.orderNumber}</span>
              </div>
            )}
            {payment?.method && (
              <div className="meta-item">
                <span className="meta-label">Payment Method</span>
                <span className="meta-value payment-method">
                  <i className="bi bi-credit-card me-2"></i>
                  {payment.method}
                </span>
              </div>
            )}
            {invoice.status && (
              <div className="meta-item">
                <span className="meta-label">Status</span>
                <span
                  className={`meta-value status-badge status-${invoice.status}`}>
                  {invoice.status}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="invoice-items-section">
          <table className="invoice-items-table">
            <thead>
              <tr>
                <th className="col-item">Item</th>
                <th className="col-sku">SKU</th>
                <th className="col-qty">Quantity</th>
                <th className="col-unit">Unit</th>
                <th className="col-price">Unit Price</th>
                <th className="col-total">Total</th>
              </tr>
            </thead>
            <tbody>
              {items && items.length > 0 ? (
                items.map((item: any, index: number) => (
                  <tr key={item.id || index}>
                    <td className="col-item">
                      <div className="item-name">{item.productName}</div>
                    </td>
                    <td className="col-sku">
                      <span className="sku-badge">{item.variantSku}</span>
                    </td>
                    <td className="col-qty">{item.quantity}</td>
                    <td className="col-unit">
                      {item.variantDetails?.quantity}{" "}
                      {item.variantDetails?.unitSymbol || ""}
                    </td>
                    <td className="col-price">
                      {formatCurrency(item.unitPrice || 0)}
                    </td>
                    <td className="col-total">
                      <strong>{formatCurrency(item.total || 0)}</strong>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="invoice-totals-section">
          <div className="totals-wrapper">
            <div className="total-row">
              <span className="total-label">Subtotal</span>
              <span className="total-value">
                {formatCurrency(totals?.subtotal || 0)}
              </span>
            </div>
            {totals?.taxAmount > 0 && (
              <div className="total-row">
                <span className="total-label">Tax (GST)</span>
                <span className="total-value">
                  {formatCurrency(totals.taxAmount)}
                </span>
              </div>
            )}
            {totals?.shippingAmount > 0 && (
              <div className="total-row">
                <span className="total-label">Shipping</span>
                <span className="total-value">
                  {formatCurrency(totals.shippingAmount)}
                </span>
              </div>
            )}
            <div className="total-row total-row-final">
              <span className="total-label">Total Amount</span>
              <span className="total-value-final">
                {formatCurrency(totals?.totalAmount || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="invoice-footer">
          <div className="footer-note">
            <p className="thank-you">Thank you for your business!</p>
            <p className="footer-text">
              For any queries, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
