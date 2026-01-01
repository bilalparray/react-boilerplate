import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container py-2 d-flex align-items-center justify-content-between">

        {/* Left: Logo */}
        <div className="d-flex align-items-center gap-3">
          <img src="/logo.png" alt="Wild Valley" style={{ height: "40px" }} />
          <div>
            <div className="fw-bold">Wild Valley Foods</div>
            <div className="small text-muted d-none d-md-block">
              Fresh from the farms of Kashmir
            </div>
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="d-none d-lg-flex gap-4">
          <Link className="text-decoration-none text-dark" to="/">Home</Link>
          <Link className="text-decoration-none text-dark" to="/shop">Shop</Link>
          <Link className="text-decoration-none text-dark" to="/categories">Categories</Link>
          <Link className="text-decoration-none text-dark" to="/story">Our Story</Link>
          <Link className="text-decoration-none text-dark" to="/contact">Contact</Link>
        </nav>

        {/* Desktop Icons */}
        <div className="d-none d-lg-flex gap-4 align-items-center">
          <i className="bi bi-search fs-5"></i>

          <div className="position-relative">
            <i className="bi bi-heart fs-5"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge bg-success">0</span>
          </div>

          <div className="position-relative">
            <i className="bi bi-cart fs-5"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge bg-success">0</span>
          </div>

          <i className="bi bi-person fs-5"></i>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="btn d-lg-none"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileMenu"
        >
          <i className="bi bi-list fs-3"></i>
        </button>

        {/* Mobile Offcanvas */}
        <div className="offcanvas offcanvas-end" id="mobileMenu">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Menu</h5>
            <button className="btn-close" data-bs-dismiss="offcanvas"></button>
          </div>

          <div className="offcanvas-body">
            <nav className="d-flex flex-column gap-3">
              <Link to="/" className="text-decoration-none">Home</Link>
              <Link to="/shop" className="text-decoration-none">Shop</Link>
              <Link to="/categories" className="text-decoration-none">Categories</Link>
              <Link to="/story" className="text-decoration-none">Our Story</Link>
              <Link to="/contact" className="text-decoration-none">Contact</Link>
            </nav>

            <hr />

            <div className="d-flex justify-content-around fs-4">
              <i className="bi bi-search"></i>
              <i className="bi bi-heart"></i>
              <i className="bi bi-cart"></i>
              <i className="bi bi-person"></i>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
