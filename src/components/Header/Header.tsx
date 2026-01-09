import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCartStore } from "../../store/useCartStore";
import { useCategories } from "../../hooks/useCategories";
import "./Header.css";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { cartCount, wishlistCount } = useCartStore();
  const { cartItems, increaseQty, decreaseQty, removeFromCart } =
    useCartStore();
  const navigate = useNavigate();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const { categories } = useCategories();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="w-100">
      {/* Top Ribbon */}
      <div
        className="w-100 py-2"
        style={{
          background: "linear-gradient(90deg, #0f3d2e, #1f6f50)",
          color: "#eaf7f1",
          fontSize: "14px",
        }}>
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          {/* Left: Store info */}
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <span>
              <i className="bi bi-geo-alt-fill me-1"></i>
              Kashmir, India
            </span>

            <span>
              <i className="bi bi-telephone-fill me-1"></i>
              +91 98765 43210
            </span>

            <span>
              <i className="bi bi-envelope-fill me-1"></i>
              support@alpine.com
            </span>
          </div>

          {/* Right: Brand message + Social */}
          <div className="d-flex align-items-center gap-3">
            <span className="d-none d-md-inline">
              Pure Kashmiri produce • Farm-to-Home • No middlemen
            </span>

            <div className="d-flex gap-3 fs-6">
              <i className="bi bi-facebook"></i>
              <i className="bi bi-instagram"></i>
              <i className="bi bi-youtube"></i>
              <i className="bi bi-twitter-x"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Header */}
      <div
        className="bg-white border-bottom"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          padding: scrolled ? "6px 0" : "16px 0",
          transition: "all 0.3s ease",
          boxShadow: scrolled ? "0 10px 30px rgba(0,0,0,0.08)" : "none",
        }}>
        <div className="container d-flex align-items-center justify-content-between">
          {/* Brand */}
          <Link
            to="/"
            className="d-flex align-items-center gap-3 text-decoration-none">
            <img
              src="/logo.png"
              alt="Alpine"
              style={{
                height: scrolled ? "36px" : "46px",
                borderRadius: "50%",
                transition: "all 0.3s ease",
              }}
            />
            <div>
              <div
                className="fw-bold"
                style={{ fontSize: "20px", color: "#1f2937" }}>
                Alpine
              </div>
              {!scrolled && (
                <div className="small text-muted">Foods from the Valley</div>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="d-none d-lg-flex align-items-center"
            style={{ gap: scrolled ? "2.5rem" : "4rem" }}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `fw-semibold text-decoration-none ${
                  isActive ? "text-success" : "text-dark"
                }`
              }>
              Home
            </NavLink>

            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `fw-semibold text-decoration-none ${
                  isActive ? "text-success" : "text-dark"
                }`
              }>
              Shop
            </NavLink>

            {/* Categories Dropdown */}
            <div className="dropdown">
              <NavLink
                to="/categories"
                className={({ isActive }) =>
                  `fw-semibold text-decoration-none dropdown-toggle ${
                    isActive ? "text-success" : "text-dark"
                  }`
                }
                data-bs-toggle="dropdown">
                Categories
              </NavLink>

              <ul className="dropdown-menu shadow-sm border-0 rounded-3">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <NavLink
                      to={`/category/${cat.id}`}
                      className="dropdown-item">
                      {cat.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `fw-semibold text-decoration-none ${
                  isActive ? "text-success" : "text-dark"
                }`
              }>
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `fw-semibold text-decoration-none ${
                  isActive ? "text-success" : "text-dark"
                }`
              }>
              Contact
            </NavLink>
          </nav>

          {/* Right Cluster */}
          <div className="d-flex align-items-center gap-4">
            <Link to="/shop" className="d-flex align-items-center">
              <div className="position-relative">
                <i className="bi bi-search fs-5"></i>
              </div>
            </Link>
            <Link to="/wishlist" className="d-flex align-items-center">
              <div className="position-relative">
                <i className="bi bi-heart fs-5"></i>
                {wishlistCount > 0 && (
                  <span className="badge bg-success position-absolute top-0 start-100 translate-middle">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </Link>
            <div
              className="position-relative cursor-pointer"
              data-bs-toggle="offcanvas"
              data-bs-target="#cartDrawer"
              role="button">
              <i className="bi bi-cart fs-5"></i>

              {cartCount > 0 && (
                <span className="badge bg-success position-absolute top-0 start-100 translate-middle">
                  {cartCount}
                </span>
              )}
            </div>
            <Link to="/myorders" className="d-flex align-items-center">
              <div className="position-relative">
                <i className="bi bi-bag-fill fs-5"></i>
              </div>
            </Link>
            <button
              className="btn d-lg-none"
              data-bs-toggle="offcanvas"
              data-bs-target="#mobileMenu">
              <i className="bi bi-list fs-2"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Offcanvas */}
      <div className="offcanvas offcanvas-end" id="mobileMenu">
        {/* Header */}
        <div
          className="offcanvas-header border-bottom"
          style={{ background: "#F9FAFB" }}>
          <div className="d-flex align-items-center gap-3">
            <img
              src="/logo.png"
              alt="Alpine"
              style={{ height: "42px", borderRadius: "50%" }}
            />
            <div>
              <div className="fw-bold" style={{ color: "#1f2937" }}>
                Alpine
              </div>
              <div className="small text-muted">Foods from the Valley</div>
            </div>
          </div>

          <button className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>

        {/* Body */}
        <div className="offcanvas-body p-0" style={{ background: "#ffffff" }}>
          {/* Menu */}
          <nav className="d-flex flex-column">
            <NavLink to="/" className="mobile-link">
              <i className="bi bi-house"></i> Home
            </NavLink>

            <NavLink to="/shop" className="mobile-link">
              <i className="bi bi-bag"></i> Shop
            </NavLink>

            <div
              className="px-4 pt-4 pb-2 fw-bold small"
              style={{ color: "#6B7280" }}>
              Categories
            </div>

            {categories.map((cat) => (
              <NavLink
                key={cat.slug}
                to={`/category/${cat.id}`}
                className="mobile-link ps-5">
                {cat.name}
              </NavLink>
            ))}

            <NavLink to="/story" className="mobile-link">
              <i className="bi bi-book"></i> Our Story
            </NavLink>

            <NavLink to="/contact" className="mobile-link">
              <i className="bi bi-telephone"></i> Contact
            </NavLink>
          </nav>

          {/* Account & Cart */}
          <div className="p-4 border-top mt-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-semibold">Wishlist</span>
              <span className="badge bg-success">{wishlistCount}</span>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="fw-semibold">Cart</span>
              <span className="badge bg-success">{cartCount}</span>
            </div>
            <button
              className="btn btn-success w-100 rounded-pill"
              onClick={() => navigate("/myorders")}>
              <i className="bi bi-person me-2"></i>
              My Account
            </button>
          </div>
        </div>
      </div>
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
                  className="btn btn-success w-50 py-3 rounded-pill"
                  data-bs-dismiss="offcanvas"
                  onClick={() => navigate("/cart")}>
                  View Cart
                </button>
                <button
                  className="btn btn-success w-50 py-3 rounded-pill"
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
