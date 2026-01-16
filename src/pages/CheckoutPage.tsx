import { useCheckoutStore } from "../store/useCheckoutStore";
import { placeOrder, createCustomer } from "../services/checkout.service";
import { useState } from "react";
import { useCartStore } from "../store/useCartStore";
import "./CheckoutPage.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { customers, selected, select, save } = useCheckoutStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showNewAddress, setShowNewAddress] = useState(false);

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

  const cartItems = useCartStore((s) => s.cartItems);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  /* ---------------- SAVE CUSTOMER ---------------- */
  async function handleSaveCustomer() {
    // Check required fields and collect missing ones
    const missingFields: string[] = [];
    
    if (!form.firstName?.trim()) {
      missingFields.push("First Name");
    }
    if (!form.lastName?.trim()) {
      missingFields.push("Last Name");
    }
    if (!form.email?.trim()) {
      missingFields.push("Email");
    }
    if (!form.contact?.trim()) {
      missingFields.push("Contact");
    }
    if (!form.street?.trim()) {
      missingFields.push("Street Address");
    }
    if (!form.city?.trim()) {
      missingFields.push("City");
    }
    if (!form.state?.trim()) {
      missingFields.push("State");
    }
    if (!form.postalCode?.trim()) {
      missingFields.push("Postal Code");
    }

    // Show toast with missing field names
    if (missingFields.length > 0) {
      const fieldNames = missingFields.join(", ");
      toast.warning(`Please fill the following required fields: ${fieldNames}`);
      return;
    }

    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.warning("Please enter a valid email address");
      return;
    }

    // Contact validation
    const contactDigits = form.contact.replace(/\D/g, "");
    if (!/^[0-9]{10}$/.test(contactDigits)) {
      toast.warning("Please enter a valid 10-digit contact number");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        contact: form.contact.replace(/\D/g, ""),
        addresses: [
          {
            addressLine1: form.street.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            postalCode: form.postalCode.trim(),
            country: "India",
            addressType: form.addressType,
          },
        ],
      };

      const res = await createCustomer(payload);

      if (!res?.successData) {
        toast.error("Failed to save address");
        return;
      }

      save(res.successData);
      select(res.successData);
      setShowNewAddress(false);
      toast.success("Address saved successfully!");
    } catch (error) {
      toast.error("Failed to save address");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- PLACE ORDER ---------------- */
  async function handlePlaceOrder() {
    if (!selected) {
      toast.warning("Please select an address");
      return;
    }

    if (cartItems.length === 0) {
      toast.warning("Your cart is empty");
      navigate("/cart");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customerId: selected.id,
        items: cartItems.map((i) => ({
          productId: i.productId,
          productVariantId: i.variantId,
          variantPrice: i.price.toString(),
          unitSymbol: i.unit,
          quantity: i.qty,
        })),
        subtotal,
        taxAmount: tax,
        shippingAmount: shipping,
        totalAmount: total,
        couponCode: null,
      };

      const res = await placeOrder(payload);

      const url = res?.successData?.paymentLink?.short_url;

      if (url) {
        window.location.href = url;
      } else {
        toast.error("Payment link not created");
      }
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- UI ---------------- */
  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="empty-content">
          <i className="bi bi-cart-x empty-icon"></i>
          <h3 className="empty-title">Your cart is empty</h3>
          <p className="empty-text">Add some products to your cart to checkout</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/shop")}>
            <i className="bi bi-arrow-left me-2"></i>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <h2 className="checkout-title">Checkout</h2>
          <p className="checkout-subtitle">
            Review your order and complete your purchase
          </p>
        </div>

        <div className="checkout-grid">
          {/* Left Column - Address & Form */}
          <div className="checkout-left">
            {/* Saved Addresses */}
            {customers.length > 0 && (
              <div className="checkout-section">
                <div className="section-header">
                  <div className="section-title">
                    <i className="bi bi-bookmark-check me-2"></i>
                    Saved Addresses
                  </div>
                </div>
                <div className="address-cards">
                  {customers.map((c) => {
                    const address = c.addresses?.[0];
                    const isSelected = selected?.id === c.id;
                    return (
                      <div
                        key={c.id}
                        className={`address-card ${isSelected ? "selected" : ""}`}
                        onClick={() => select(c)}>
                        <div className="address-card-header">
                          <div className="address-radio">
                            <input
                              type="radio"
                              checked={isSelected}
                              onChange={() => select(c)}
                            />
                          </div>
                          <div className="address-name">
                            <strong>
                              {c.firstName} {c.lastName}
                            </strong>
                            <span className="address-type-badge">
                              {address?.addressType || "Home"}
                            </span>
                          </div>
                        </div>
                        {address && (
                          <div className="address-details">
                            <p className="address-line">
                              <i className="bi bi-geo-alt me-2"></i>
                              {address.addressLine1}
                            </p>
                            <p className="address-city">
                              {address.city}, {address.state} - {address.postalCode}
                            </p>
                            {c.contact && (
                              <p className="address-contact">
                                <i className="bi bi-telephone me-2"></i>
                                {c.contact}
                              </p>
                            )}
                            {c.email && (
                              <p className="address-email">
                                <i className="bi bi-envelope me-2"></i>
                                {c.email}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* New Address Form */}
            {(!selected || showNewAddress) && (
              <div className="checkout-section">
                <div className="section-header">
                  <div className="section-title">
                    <i className="bi bi-plus-circle me-2"></i>
                    {customers.length > 0 ? "Add New Address" : "Delivery Information"}
                  </div>
                  {selected && (
                    <button
                      className="btn-close-section"
                      onClick={() => setShowNewAddress(false)}>
                      <i className="bi bi-x-lg"></i>
                    </button>
                  )}
                </div>

                <div className="checkout-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        First Name <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <i className="bi bi-person input-icon"></i>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter first name"
                          value={form.firstName}
                          onChange={(e) =>
                            setForm({ ...form, firstName: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>
                        Last Name <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <i className="bi bi-person input-icon"></i>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter last name"
                          value={form.lastName}
                          onChange={(e) =>
                            setForm({ ...form, lastName: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        Email <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <i className="bi bi-envelope input-icon"></i>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter email"
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>
                        Contact <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <i className="bi bi-telephone input-icon"></i>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="Enter 10-digit number"
                          value={form.contact}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              contact: e.target.value.replace(/\D/g, "").slice(0, 10),
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      Street Address <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <i className="bi bi-geo-alt input-icon"></i>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter street address"
                        value={form.street}
                        onChange={(e) =>
                          setForm({ ...form, street: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        City <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <i className="bi bi-building input-icon"></i>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter city"
                          value={form.city}
                          onChange={(e) =>
                            setForm({ ...form, city: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>
                        State <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <i className="bi bi-map input-icon"></i>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter state"
                          value={form.state}
                          onChange={(e) =>
                            setForm({ ...form, state: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>
                        Postal Code <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <i className="bi bi-postcard input-icon"></i>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter PIN code"
                          value={form.postalCode}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              postalCode: e.target.value.replace(/\D/g, "").slice(0, 6),
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Address Type</label>
                    <div className="address-type-buttons">
                      {["Home", "Work", "Other"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          className={`address-type-btn ${
                            form.addressType === type ? "active" : ""
                          }`}
                          onClick={() => setForm({ ...form, addressType: type })}>
                          <i
                            className={`bi ${
                              type === "Home"
                                ? "bi-house"
                                : type === "Work"
                                ? "bi-briefcase"
                                : "bi-geo-alt"
                            } me-1`}></i>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    className="btn btn-primary btn-save-address"
                    disabled={loading}
                    onClick={handleSaveCustomer}>
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Save & Continue
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Add New Address Button */}
            {selected && !showNewAddress && customers.length > 0 && (
              <button
                className="btn btn-outline-primary btn-add-address"
                onClick={() => setShowNewAddress(true)}>
                <i className="bi bi-plus-circle me-2"></i>
                Add New Address
              </button>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="checkout-right">
            <div className="checkout-section order-summary-section">
              <div className="section-header">
                <div className="section-title">
                  <i className="bi bi-receipt me-2"></i>
                  Order Summary
                </div>
              </div>

              <div className="order-items">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <div className="order-item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="order-item-placeholder">
                          <i className="bi bi-image"></i>
                        </div>
                      )}
                    </div>
                    <div className="order-item-details">
                      <div className="order-item-name">{item.name}</div>
                      <div className="order-item-meta">
                        <span className="order-item-unit">
                          <i className="bi bi-tag me-1"></i>
                          {item.unit}
                        </span>
                        <span className="order-item-qty">
                          <i className="bi bi-x me-1"></i>
                          Qty: {item.qty}
                        </span>
                      </div>
                    </div>
                    <div className="order-item-price">
                      {formatCurrency(item.qty * item.price)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="total-row">
                  <span>Shipping</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
                <div className="total-row">
                  <span>Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="total-row total-final">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                className="btn btn-success btn-place-order"
                onClick={handlePlaceOrder}
                disabled={loading || !selected}>
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-lock-fill me-2"></i>
                    Confirm & Pay
                  </>
                )}
              </button>

              {!selected && (
                <div className="order-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Please select or add a delivery address to continue
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
