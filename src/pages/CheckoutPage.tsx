import { useState } from "react";
import { useCheckoutStore } from "../store/useCheckoutStore";
import { placeOrder, createCustomer } from "../services/checkout.service";

export default function CheckoutPage() {
  const { customers, selected, select, save } = useCheckoutStore();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", // We will split this for firstName/lastName
    email: "",
    contact: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const cartItems = [
    {
      productId: 8,
      productVariantId: 10,
      price: 1000,
      qty: 4,
      unitSymbol: "Kg",
    },
  ];
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  async function handleCreateAndSaveCustomer() {
    if (!form.name || !form.contact || !form.addressLine1) {
      return alert("Please fill in Name, Contact, and Address");
    }

    setLoading(true);
    try {
      // Split name logic
      const nameParts = form.name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName =
        nameParts.length > 1 ? nameParts.slice(1).join(" ") : ".";

      // Construct payload according to your interfaces
      const payload = {
        firstName,
        lastName,
        email: form.email,
        contact: form.contact,
        addresses: [
          {
            addressLine1: form.addressLine1,
            city: form.city || "N/A",
            state: form.state || "N/A",
            postalCode: form.postalCode || "000000",
            country: "India",
            addressType: "Home", // From your AddressType enum
          },
        ],
      };

      const res = await createCustomer(payload);

      if (res?.successData) {
        // Save the actual object returned from DB to Store/Local Storage
        const savedCustomer = res.successData;
        save(savedCustomer);
        select(savedCustomer); // Automatically select the new customer
      } else {
        alert("Server failed to create customer profile.");
      }
    } catch (error) {
      console.error("Creation Error:", error);
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePlaceOrder(e: React.MouseEvent) {
    e.preventDefault();
    if (!selected) return alert("Select an address first");

    setLoading(true);
    try {
      const payload = {
        customerId: selected.id, // This is now the real DB ID
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

      const paymentUrl = res?.successData?.paymentLink?.short_url;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        alert("Order placed, but payment link generation failed.");
      }
    } catch (err) {
      console.error("Order error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>Checkout</h2>

      {/* Address Selection Section */}
      <section>
        <h3>1. Select Address</h3>
        <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
          {customers.map((c) => (
            <div
              key={c.id}
              onClick={() => select(c)}
              style={{
                padding: "15px",
                borderRadius: "8px",
                cursor: "pointer",
                border:
                  selected?.id === c.id
                    ? "2px solid #007bff"
                    : "1px solid #ddd",
                backgroundColor: selected?.id === c.id ? "#f0f7ff" : "#fff",
              }}>
              <strong>
                {c.firstName} {c.lastName}
              </strong>
              <p style={{ margin: "5px 0", fontSize: "0.9em" }}>
                {c.addresses?.[0]?.addressLine1}, {c.addresses?.[0]?.city}
              </p>
              <span>📞 {c.contact}</span>
            </div>
          ))}
        </div>
      </section>

      {/* New Customer Form */}
      {!selected && (
        <section
          style={{
            border: "1px solid #eee",
            padding: "20px",
            borderRadius: "8px",
          }}>
          <h4>Add New Delivery Details</h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              placeholder="Contact Number"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
            />
            <input
              placeholder="Address (House No, Building, Street)"
              value={form.addressLine1}
              onChange={(e) =>
                setForm({ ...form, addressLine1: e.target.value })
              }
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                placeholder="City"
                style={{ flex: 1 }}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <input
                placeholder="State"
                style={{ flex: 1 }}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
            </div>
            <button
              type="button"
              onClick={handleCreateAndSaveCustomer}
              disabled={loading}
              style={{
                backgroundColor: "#28a745",
                color: "#fff",
                padding: "10px",
                border: "none",
                borderRadius: "4px",
              }}>
              {loading ? "Saving..." : "Save & Continue"}
            </button>
          </div>
        </section>
      )}

      {/* Order Summary Section */}
      {selected && (
        <section
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#f8f9fa",
            borderRadius: "8px",
          }}>
          <h3>2. Order Summary</h3>
          <div
            style={{
              borderBottom: "1px solid #ddd",
              paddingBottom: "10px",
              marginBottom: "10px",
            }}>
            <p>Subtotal: ₹{subtotal}</p>
            <p>Shipping: ₹0</p>
            <p style={{ fontWeight: "bold", fontSize: "1.2em" }}>
              Total: ₹{subtotal}
            </p>
          </div>
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: loading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "1.1em",
              cursor: "pointer",
            }}>
            {loading ? "Processing..." : "Confirm & Pay Now"}
          </button>
          <button
            type="button"
            onClick={() => select(null as any)}
            style={{
              width: "100%",
              marginTop: "10px",
              background: "none",
              border: "none",
              color: "#666",
              cursor: "pointer",
            }}>
            Edit Address / Use different address
          </button>
        </section>
      )}
    </div>
  );
}
