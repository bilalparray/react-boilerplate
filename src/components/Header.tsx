import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="w-100">
      {/* ───── Brand Ribbon ───── */}
      <div
        className="w-100 text-center py-2"
        style={{
          background: "linear-gradient(90deg, #0f3d2e, #1f6f50)",
          color: "#eaf7f1",
          fontSize: "14px",
          letterSpacing: "0.5px",
        }}>
        Pure Kashmiri produce • Farm-to-Home • No middlemen
      </div>

      {/* ───── Main Header ───── */}
      <div
        className="bg-white border-bottom"
        style={{ position: "sticky", top: 0, zIndex: 1000 }}>
        <div className="container py-3 d-flex align-items-center justify-content-between">
          {/* Brand Block */}
          <Link
            to="/"
            className="d-flex align-items-center gap-3 text-decoration-none">
            <img
              src="/logo.png"
              alt="Alpine"
              style={{ height: "46px", borderRadius: "50%" }}
            />
            <div>
              <div
                className="fw-bold"
                style={{ fontSize: "20px", color: "#1f2937" }}>
                Alpine
              </div>
              <div className="small" style={{ color: "#6b7280" }}>
                Foods from the Valley
              </div>
            </div>
          </Link>

          {/* Center Nav */}
          <nav className="d-none d-lg-flex gap-5" style={{ fontSize: "15px" }}>
            <Link to="/" className="text-decoration-none text-dark fw-semibold">
              Home
            </Link>
            <Link
              to="/shop"
              className="text-decoration-none text-dark fw-semibold">
              Shop
            </Link>
            <Link
              to="/categories"
              className="text-decoration-none text-dark fw-semibold">
              Categories
            </Link>
            <Link
              to="/story"
              className="text-decoration-none text-dark fw-semibold">
              Our Story
            </Link>
          </nav>

          {/* Commerce Cluster */}
          <div className="d-flex align-items-center gap-4">
            <div className="d-none d-lg-block">
              <input
                placeholder="Search organic foods…"
                className="form-control rounded-pill px-4"
                style={{ width: "220px", background: "#f3f4f6" }}
              />
            </div>

            <div className="position-relative">
              <i className="bi bi-heart fs-5"></i>
              <span className="badge bg-success position-absolute top-0 start-100 translate-middle">
                0
              </span>
            </div>

            <div className="position-relative">
              <i className="bi bi-cart fs-5"></i>
              <span className="badge bg-success position-absolute top-0 start-100 translate-middle">
                0
              </span>
            </div>

            <i className="bi bi-person fs-5"></i>

            <button
              className="btn d-lg-none"
              data-bs-toggle="offcanvas"
              data-bs-target="#mobileMenu">
              <i className="bi bi-list fs-2"></i>
            </button>
          </div>
        </div>
      </div>

      {/* ───── Mobile Menu ───── */}
      <div className="offcanvas offcanvas-end" id="mobileMenu">
        <div className="offcanvas-header">
          <h5 className="fw-bold">Alpine</h5>
          <button className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>

        <div className="offcanvas-body">
          <nav className="d-flex flex-column gap-4 fs-5">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/story">Our Story</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
