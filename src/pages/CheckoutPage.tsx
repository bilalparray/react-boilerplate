import { useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { useCheckoutStore } from "../store/useCheckoutStore";
import { createCustomer, getRazorpayKey } from "../services/checkout.service";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { cartItems } = useCartStore();
  const { savedAddresses, saveAddress, selectAddress, selectedAddress } =
    useCheckoutStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const handlePlaceOrder = async () => {
    const addr = selectedAddress || form;

    if (!addr.firstName || !addr.contact || !addr.addressLine1)
      return alert("Fill address");

    saveAddress(addr);

    const customerPayload = {
      firstName: addr.firstName,
      lastName: addr.lastName,
      email: addr.email,
      contact: addr.contact,
      addresses: [
        {
          addressLine1: addr.addressLine1,
          city: addr.city,
          state: addr.state,
          postalCode: addr.postalCode,
          country: "India",
          addressType: "Home",
        },
      ],
    };

    await createCustomer(customerPayload);

    await getRazorpayKey();
    navigate("/order-summary");
  };

  return (
    <div className="container py-5">
      <div className="row g-5">
        {/* Address */}
        <div className="col-lg-7">
          <h4 className="fw-bold mb-3">Delivery Address</h4>

          {savedAddresses.length > 0 && (
            <div className="mb-3">
              <div className="fw-semibold mb-2">Saved Addresses</div>
              {savedAddresses.map((a, i) => (
                <div
                  key={i}
                  onClick={() => selectAddress(a)}
                  className={`border p-3 rounded mb-2 ${
                    selectedAddress === a ? "border-success" : ""
                  }`}>
                  {a.firstName} — {a.addressLine1}, {a.city}
                </div>
              ))}
            </div>
          )}

          <div className="row g-3">
            {Object.keys(form).map((k) => (
              <div key={k} className="col-md-6">
                <input
                  className="form-control"
                  placeholder={k}
                  value={(form as any)[k]}
                  onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="col-lg-5">
          <div className="border rounded-4 p-4 shadow-sm">
            <h5 className="fw-bold">Order Summary</h5>

            {cartItems.map((i) => (
              <div key={i.productId} className="d-flex justify-content-between">
                <span>
                  {i.name} × {i.qty}
                </span>
                <span>₹{i.price * i.qty}</span>
              </div>
            ))}

            <hr />

            <div className="d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="btn btn-success w-100 mt-4 py-3">
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
