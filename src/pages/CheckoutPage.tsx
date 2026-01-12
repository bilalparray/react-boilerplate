import { useCheckoutStore } from "../store/useCheckoutStore";
import { placeOrder, createCustomer } from "../services/checkout.service";
import { useState } from "react";

export default function CheckoutPage() {
  const { customers, selected, select, save } = useCheckoutStore();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    addressType: "Home",
  });

  const cartItems = [
    {
      productId: 8,
      productVariantId: 10,
      name: "Seed Cycling Pack",
      price: 1000,
      qty: 4,
      unitSymbol: "Kg",
    },
  ];

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  /* ---------------- SAVE CUSTOMER ---------------- */

  async function handleSaveCustomer() {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.contact ||
      !form.street ||
      !form.city ||
      !form.state ||
      !form.postalCode
    ) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email,
        contact: form.contact,
        addresses: [
          {
            addressLine1: form.street,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
            country: "India",
            addressType: form.addressType,
          },
        ],
      };

      const res = await createCustomer(payload);

      if (!res?.successData) {
        alert("Failed to save address");
        return;
      }

      save(res.successData);
      select(res.successData);
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- PLACE ORDER ---------------- */

  async function handlePlaceOrder() {
    if (!selected) {
      alert("Please select an address");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customerId: selected.id,
        items: cartItems.map((i) => ({
          productId: i.productId,
          productVariantId: i.productVariantId,
          variantPrice: i.price.toString(),
          unitSymbol: i.unitSymbol,
          quantity: i.qty,
        })),
        subtotal,
        taxAmount: 0,
        shippingAmount: 0,
        totalAmount: subtotal,
        couponCode: null,
      };

      const res = await placeOrder(payload);

      const url = res?.successData?.paymentLink?.short_url;

      if (url) window.location.href = url;
      else alert("Payment link not created");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      <h3 className="mb-4">Checkout</h3>

      {/* ADDRESS LIST */}
      {customers.length > 0 && (
        <div className="mb-4">
          <h5>Saved Addresses</h5>

          <select
            className="form-select"
            value={selected?.id || ""}
            onChange={(e) => {
              const id = Number(e.target.value);
              const c = customers.find((x) => x.id === id);
              if (c) select(c);
            }}>
            <option value="">Select saved delivery address</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.firstName} {c.lastName} – {c.addresses?.[0]?.addressLine1}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* NEW ADDRESS */}
      {!selected && (
        <div className="card p-4 mb-4">
          <h5 className="mb-3">Customer & Delivery Information</h5>

          <div className="row g-3">
            <div className="col-md-6">
              <label>First Name *</label>
              <input
                className="form-control"
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
            </div>

            <div className="col-md-6">
              <label>Last Name *</label>
              <input
                className="form-control"
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label>Email</label>
              <input
                className="form-control"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label>Contact *</label>
              <input
                className="form-control"
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
              />
            </div>

            <div className="col-12">
              <label>Street *</label>
              <input
                className="form-control"
                onChange={(e) => setForm({ ...form, street: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <label>City *</label>
              <input
                className="form-control"
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <label>State *</label>
              <input
                className="form-control"
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <label>Postal Code *</label>
              <input
                className="form-control"
                onChange={(e) =>
                  setForm({ ...form, postalCode: e.target.value })
                }
              />
            </div>
          </div>

          <button
            className="btn btn-primary mt-3"
            disabled={loading}
            onClick={handleSaveCustomer}>
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      )}

      {/* ORDER SUMMARY */}
      {selected && (
        <div className="card p-4">
          <h5 className="mb-3">Order Summary</h5>

          {cartItems.map((i, idx) => (
            <div
              key={idx}
              className="d-flex justify-content-between border-bottom py-2">
              <div>
                <strong>{i.name}</strong>
                <div className="text-muted">
                  {i.qty} × ₹{i.price}
                </div>
              </div>
              <strong>₹{i.qty * i.price}</strong>
            </div>
          ))}

          <div className="mt-3">
            <p>Subtotal: ₹{subtotal}</p>
            <p>Shipping: ₹0</p>
            <h5>Total: ₹{subtotal}</h5>
          </div>

          <button
            className="btn btn-success w-100 mt-3"
            onClick={handlePlaceOrder}
            disabled={loading}>
            {loading ? "Processing..." : "Confirm & Pay"}
          </button>
        </div>
      )}
    </div>
  );
}
