import { useCartStore } from "../store/useCartStore";
import { Link, useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cartItems, increaseQty, decreaseQty, removeFromCart } =
    useCartStore();

  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3>Your cart is empty</h3>
        <Link to="/shop" className="btn btn-success mt-3">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Shopping Cart</h2>

      <div className="row g-5">
        {/* CART ITEMS */}
        <div className="col-lg-8">
          {cartItems.map((item) => (
            <div
              key={`${item.productId}-${item.variantId}`}
              className="cart-row border-bottom py-3">
              <div className="row align-items-center g-3">
                {/* Image */}
                <div className="col-3 col-md-2">
                  <img
                    src={item.image}
                    className="img-fluid rounded"
                    style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
                  />
                </div>

                {/* Info */}
                <div className="col-9 col-md-4">
                  <div className="fw-semibold">{item.name}</div>
                  <small className="text-muted">
                    {item.weight} {item.unit}
                  </small>
                  <div className="fw-bold mt-1">₹{item.price}</div>
                </div>

                {/* Qty */}
                <div className="col-6 col-md-3">
                  <div className="d-flex align-items-center border rounded-pill justify-content-center">
                    <button
                      className="btn btn-sm"
                      onClick={() =>
                        decreaseQty(item.productId, item.variantId)
                      }>
                      −
                    </button>
                    <div className="px-3 fw-bold">{item.qty}</div>
                    <button
                      className="btn btn-sm"
                      onClick={() =>
                        increaseQty(item.productId, item.variantId)
                      }>
                      +
                    </button>
                  </div>
                </div>

                {/* Total + Delete */}
                <div className="col-6 col-md-3 d-flex justify-content-between align-items-center">
                  <div className="fw-bold">
                    ₹{(item.price * item.qty).toFixed(2)}
                  </div>
                  <button
                    onClick={() =>
                      removeFromCart(item.productId, item.variantId)
                    }
                    className="btn btn-light btn-sm">
                    <i className="bi bi-trash text-danger"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="col-lg-4">
          <div className="border rounded-4 p-4 shadow-sm">
            <h5 className="fw-bold mb-3">Order Summary</h5>

            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>Total</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="btn btn-success w-100 mt-4 py-3 fw-semibold">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
