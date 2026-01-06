import { useCartStore } from "../store/useCartStore";
import { useCheckoutStore } from "../store/useCheckoutStore";
import { getRazorpayKey } from "../services/checkout.service";

export default function OrderSummaryPage() {
  const { cartItems } = useCartStore();
  const { selectedAddress } = useCheckoutStore();

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handlePay = async () => {
    const { keyId } = await getRazorpayKey();

    const options = {
      key: keyId,
      amount: Math.round(subtotal * 100),
      currency: "INR",
      name: "Wild Valley Foods",
      description: "Order Payment",
      handler: function (response: any) {
        alert("Payment Successful: " + response.razorpay_payment_id);
      },
      prefill: {
        name: selectedAddress?.firstName,
        email: selectedAddress?.email,
        contact: selectedAddress?.contact,
      },
      theme: {
        color: "#16a34a",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4">Order Summary</h3>

      <div className="border rounded p-4 mb-4 bg-light">
        <div className="fw-semibold">Deliver To</div>
        <div>
          {selectedAddress?.firstName} {selectedAddress?.lastName}
        </div>
        <div>{selectedAddress?.addressLine1}</div>
        <div>
          {selectedAddress?.city}, {selectedAddress?.state}
        </div>
        <div>{selectedAddress?.contact}</div>
      </div>

      {cartItems.map((item) => (
        <div
          key={item.productId}
          className="d-flex justify-content-between border-bottom py-2">
          <div>
            {item.name} × {item.qty}
          </div>
          <div>₹{item.price * item.qty}</div>
        </div>
      ))}

      <hr />

      <div className="d-flex justify-content-between fw-bold fs-5">
        <span>Total</span>
        <span>₹{subtotal}</span>
      </div>

      <button
        onClick={handlePay}
        className="btn btn-success w-100 py-3 mt-4 fw-semibold">
        Place Order Now
      </button>
    </div>
  );
}
