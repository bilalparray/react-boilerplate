import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchOrderById,
  updateStatus,
} from "../../../services/admin/orders.service";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetchOrderById(Number(id));
    setOrder(res.successData);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-5 text-center">
        <div className="spinner-border text-primary" />
        <div className="mt-2">Loading order...</div>
      </div>
    );
  }

  const customer = order.customer;
  const address = customer.addresses?.[0];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Order #{order.id}</h4>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate(`/orders/${order.id}/invoice`)}>
            View Invoice
          </button>

          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Order Summary */}
        <div className="col-md-4">
          <div className="card p-3 h-100">
            <h6 className="fw-bold">Order Summary</h6>

            <div className="d-flex justify-content-between mt-2">
              <span>Order ID</span>
              <span>#{order.id}</span>
            </div>

            <div className="d-flex justify-content-between">
              <span>Razorpay</span>
              <span>{order.razorpayOrderId}</span>
            </div>

            <div className="d-flex justify-content-between">
              <span>Receipt</span>
              <span>{order.receipt}</span>
            </div>

            <div className="d-flex justify-content-between">
              <span>Total</span>
              <strong>₹{order.amount}</strong>
            </div>

            <div className="d-flex justify-content-between">
              <span>Paid</span>
              <span>₹{order.paid_amount}</span>
            </div>

            <div className="d-flex justify-content-between">
              <span>Due</span>
              <span>₹{order.due_amount}</span>
            </div>

            <div className="mt-3">
              <label>Status</label>
              <select
                className="form-select"
                value={order.status}
                onChange={(e) =>
                  updateStatus(order.id, e.target.value).then(load)
                }>
                <option value="created">Created</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customer */}
        <div className="col-md-4">
          <div className="card p-3 h-100">
            <h6 className="fw-bold">Customer</h6>

            <div>
              {customer.firstName} {customer.lastName}
            </div>
            <div className="text-muted">{customer.email}</div>
            <div className="text-muted">{customer.contact}</div>

            {address && (
              <div className="mt-3">
                <h6>Shipping Address</h6>
                <div>{address.addressLine1}</div>
                <div>
                  {address.city}, {address.state}
                </div>
                <div>{address.postalCode}</div>
                <div>{address.country}</div>
              </div>
            )}
          </div>
        </div>

        {/* Payment */}
        <div className="col-md-4">
          <div className="card p-3 h-100">
            <h6 className="fw-bold">Payment</h6>

            <div>
              <strong>Payment ID:</strong> {order.paymentId}
            </div>
            <div className="text-muted small mt-2">
              Signature: {order.signature}
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="card mt-4">
        <div className="card-header fw-bold">Order Items</div>

        <table className="table mb-0">
          <thead>
            <tr>
              <th>Product</th>
              <th>Variant</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {order.items.map((i: any) => (
              <tr key={i.id}>
                <td>{i.product.name}</td>
                <td>
                  {i.variant.sku} ({i.variant.unitName})
                </td>
                <td>{i.quantity}</td>
                <td>₹{i.price}</td>
                <td>₹{i.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
