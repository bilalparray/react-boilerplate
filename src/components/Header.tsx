import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { categories } from "../data/categories";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { cartCount, wishlistCount } = useCartStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="w-100">
      {/* Top Ribbon */}
      <div
        className="w-100 text-center py-2"
        style={{
          background: "linear-gradient(90deg, #0f3d2e, #1f6f50)",
          color: "#eaf7f1",
          fontSize: "14px",
        }}>
        Pure Kashmiri produce • Farm-to-Home • No middlemen
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
                      to={`/category/${cat.slug}`}
                      className="dropdown-item">
                      {cat.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <NavLink
              to="/story"
              className={({ isActive }) =>
                `fw-semibold text-decoration-none ${
                  isActive ? "text-success" : "text-dark"
                }`
              }>
              Our Story
            </NavLink>
          </nav>

          {/* Right Cluster */}
          <div className="d-flex align-items-center gap-4">
            {!scrolled && (
              <input
                placeholder="Search organic foods…"
                className="form-control rounded-pill px-4 d-none d-lg-block"
                style={{ width: "220px", background: "#f3f4f6" }}
              />
            )}

            <div className="position-relative">
              <i className="bi bi-heart fs-5"></i>
              {wishlistCount > 0 && (
                <span className="badge bg-success position-absolute top-0 start-100 translate-middle">
                  {wishlistCount}
                </span>
              )}
            </div>

            <div className="position-relative">
              <i className="bi bi-cart fs-5"></i>
              {cartCount > 0 && (
                <span className="badge bg-success position-absolute top-0 start-100 translate-middle">
                  {cartCount}
                </span>
              )}
            </div>

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
                to={`/category/${cat.slug}`}
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

            <button className="btn btn-success w-100 rounded-pill">
              <i className="bi bi-person me-2"></i>
              My Account
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
