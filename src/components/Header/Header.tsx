import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import { useCategories } from "../../hooks/useCategories";
import "./Header.css";

export function Header() {
  const navigate = useNavigate();
  const {
    cartCount,
    wishlistCount,
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
  } = useCartStore();
  const { categories } = useCategories();

  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  /* ================= MOBILE ================= */
  const MobileHeader = () => (
    <div className="d-lg-none">
      <div className="mp-sale-bar">
        Sale ends: 671 Days 18 Hours 14 Minutes 55 Sec.
      </div>

      <div className="mp-mobile-top">
        <Link to="/" className="d-flex align-items-center gap-2">
          <img src="/logo.png" className="mp-logo" />
          <span className="fw-bold">Alpine</span>
        </Link>

        <div className="d-flex align-items-center gap-3">
          <button className="icon-btn" onClick={() => navigate("/shop")}>
            <i className="bi bi-search"></i>
          </button>

          <Link to="/wishlist" className="position-relative icon-btn">
            <i className="bi bi-heart"></i>
            {wishlistCount > 0 && (
              <span className="mp-badge">{wishlistCount}</span>
            )}
          </Link>

          <button
            className="position-relative icon-btn"
            data-bs-toggle="offcanvas"
            data-bs-target="#cartDrawer">
            <i className="bi bi-cart"></i>
            {cartCount > 0 && <span className="mp-badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      <div className="mp-mobile-browse">
        <button
          className="mp-browse-btn"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileMenu">
          <i className="bi bi-grid"></i> Browse Categories
        </button>

        <button
          className="mp-hamburger"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileMenu">
          <i className="bi bi-list"></i>
        </button>
      </div>
    </div>
  );

  /* ================= DESKTOP ================= */
  const DesktopHeader = () => (
    <div className="d-none d-lg-block">
      <div className="mp-top-bar">
        <div className="container d-flex justify-content-between">
          <div>Kashmir, India • +91 98765 43210 • support@alpine.com</div>
          <div className="d-flex gap-3">
            <i className="bi bi-facebook"></i>
            <i className="bi bi-instagram"></i>
            <i className="bi bi-youtube"></i>
          </div>
        </div>
      </div>

      <div className="mp-main-header container">
        <Link to="/" className="d-flex align-items-center gap-3">
          <img src="/logo.png" className="mp-logo" />
          <span className="mp-brand">Alpine</span>
        </Link>

        <div className="mp-search">
          <input placeholder="Search for products..." />
          <button onClick={() => navigate("/shop")}>
            <i className="bi bi-search"></i>
          </button>
        </div>

        <div className="mp-icons">
          <Link to="/myorders">
            <i className="bi bi-person"></i>
          </Link>

          <Link to="/wishlist" className="position-relative">
            <i className="bi bi-heart"></i>
            {wishlistCount > 0 && (
              <span className="mp-badge">{wishlistCount}</span>
            )}
          </Link>

          <button
            className="icon-btn position-relative"
            data-bs-toggle="offcanvas"
            data-bs-target="#cartDrawer">
            <i className="bi bi-cart"></i>
            {cartCount > 0 && <span className="mp-badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      <div className="mp-nav container">
        <button
          className="mp-browse-btn"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileMenu">
          <i className="bi bi-grid"></i> Browse Categories
        </button>

        <div className="mp-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/about">About us</NavLink>
        </div>

        <div className="mp-help">Need help? +91 98765 43210</div>
      </div>
    </div>
  );

  return (
    <header>
      <MobileHeader />
      <DesktopHeader />

      {/* Mobile Menu */}
      <div className="offcanvas offcanvas-end" id="mobileMenu">
        <div className="offcanvas-header">
          <h5>Menu</h5>
          <button className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <h6 className="mt-3">Categories</h6>
          {categories.map((c) => (
            <NavLink key={c.id} to={`/category/${c.id}`}>
              {c.name}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Cart */}
      {/* Cart */}
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
              {/* Items */}
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
                  data-bs-dismiss="offcanvas"
                  onClick={() => navigate("/checkout")}>
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
