import { useCartStore } from "../store/useCartStore";

export function CartDrawer() {
  const { cartItems, cartCount, increaseQty, decreaseQty, removeFromCart } =
    useCartStore();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex={-1}
      id="cartDrawer"
      aria-labelledby="cartDrawerLabel"
      style={{ width: "420px" }}>
      {/* Header */}
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-bold">Your Cart ({cartCount})</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"></button>
      </div>

      {/* Body */}
      <div className="offcanvas-body d-flex flex-column p-0">
        {cartItems.length === 0 ? (
          <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-muted">
            <i className="bi bi-cart fs-1 mb-3"></i>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-grow-1 overflow-auto p-3">
              {cartItems.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="d-flex gap-3 mb-4 align-items-center">
                  <img
                    src={item.image}
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />

                  <div className="flex-grow-1">
                    <div className="fw-semibold">{item.name}</div>
                    <div className="small text-muted">
                      {item.weight} {item.unit}
                    </div>

                    <div className="d-flex align-items-center gap-3 mt-2">
                      <div className="fw-bold">₹{item.price}</div>

                      {/* Qty controls */}
                      <div className="d-flex border rounded-pill overflow-hidden">
                        <button
                          className="btn px-2"
                          onClick={() =>
                            decreaseQty(item.productId, item.variantId)
                          }>
                          −
                        </button>
                        <div className="px-3 fw-semibold">{item.qty}</div>
                        <button
                          className="btn px-2"
                          onClick={() =>
                            increaseQty(item.productId, item.variantId)
                          }>
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() =>
                      removeFromCart(item.productId, item.variantId)
                    }
                    className="btn btn-sm text-danger">
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-top p-4">
              <div className="d-flex justify-content-between mb-3">
                <span className="fw-semibold">Subtotal</span>
                <span className="fw-bold">₹{total.toFixed(2)}</span>
              </div>

              <button
                className="btn btn-success w-100 py-3 rounded-pill"
                data-bs-dismiss="offcanvas">
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
