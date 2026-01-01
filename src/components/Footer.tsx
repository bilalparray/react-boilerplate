export function Footer() {
  return (
    <footer
      className="pt-5 position-relative overflow-hidden"
      style={{
        background: "#1C1F23",
        color: "#E5E7EB",
      }}>
      {/* Center watermark logo */}
      <img
        src="https://wildvalleyfoods.in/media/logo-no-bg-ERF2T3VH.png"
        alt=""
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "200px",
          opacity: 0.06,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="container pb-4">
          <div className="row g-4">
            {/* Brand */}
            <div className="col-md-4">
              <h4 style={{ color: "#F59E0B", fontWeight: 700 }}>
                Wild Valley Foods
              </h4>
              <p
                className="mt-3"
                style={{ lineHeight: "1.7", color: "#D1D5DB" }}>
                Wild Valley Foods brings you premium natural products straight
                from the farms of Kashmir. We believe in purity, honest
                sourcing, and wellness for every home.
              </p>
            </div>

            {/* Links */}
            <div className="col-md-4">
              <h5 className="mb-3">Customer Service</h5>
              <ul className="list-unstyled d-flex flex-column gap-2">
                <li>
                  <a className="footer-link">Privacy Policy</a>
                </li>
                <li>
                  <a className="footer-link">Returns & Refunds</a>
                </li>
                <li>
                  <a className="footer-link">Terms & Conditions</a>
                </li>
                <li>
                  <a className="footer-link">Contact</a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="col-md-4">
              <h5 className="mb-3">Contact & Connect</h5>

              <div className="mb-3">
                <i className="bi bi-envelope me-2"></i>
                support@wildvalleyfoods.in
              </div>

              <div className="mb-3">
                <i className="bi bi-telephone me-2"></i>
                +91 98765 43210
              </div>

              <div className="d-flex gap-3 fs-4" style={{ color: "#F59E0B" }}>
                <i className="bi bi-facebook"></i>
                <i className="bi bi-twitter-x"></i>
                <i className="bi bi-instagram"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            background: "#111317",
          }}
          className="py-3">
          <div className="container d-flex flex-column flex-md-row justify-content-between text-center text-md-start">
            <div>
              Designed & Developed by{" "}
              <span style={{ color: "#22D3EE" }}>
                Siffrum Analytics Pvt Ltd
              </span>
            </div>
            <div>
              © 2025 <span style={{ color: "#F59E0B" }}>WildValleyFoods</span>.
              All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
