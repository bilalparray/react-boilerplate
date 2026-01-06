export function Footer() {
  return (
    <footer
      style={{
        background: "#0f1418",
        color: "#E5E7EB",
      }}
      className="pt-5 mt-5">
      {/* Top CTA bar */}
      <div className="container pb-4 border-bottom border-secondary">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <h4 className="fw-bold mb-1">Alpine</h4>
            <p className="text-secondary mb-0">
              The one stop shop for all your Healthy Foods
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-5">
        <div className="row g-4">
          {/* Quick Links */}
          <div className="col-md-4">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 text-secondary">
              <li>Home</li>
              <li>About Us</li>
              <li>Contact Us</li>
            </ul>

            <div className="mt-4">
              <h6>Follow Us</h6>
              <div className="d-flex gap-3 fs-5">
                <i className="bi bi-facebook"></i>
                <i className="bi bi-linkedin"></i>
                <i className="bi bi-instagram"></i>
                <i className="bi bi-youtube"></i>
                <i className="bi bi-twitter-x"></i>
              </div>
            </div>
          </div>

          {/* Policies */}
          <div className="col-md-4">
            <h5 className="mb-3">Company Policy</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 text-secondary">
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
              <li>Return & Exchange Policy</li>
              <li>Shipping Policy</li>
              <li>Cancellation Policy</li>
            </ul>
          </div>

          {/* Store Info */}
          <div className="col-md-4">
            <h5 className="mb-3">Store Info</h5>

            <div className="d-flex gap-3 mb-3">
              <i className="bi bi-geo-alt fs-5 text-success"></i>
              <span className="text-secondary">
                #262-263, Time Square Empire, SH-42 Mirjapar Highway, Bhuj –
                Kutch 370001, Jammu And Kashmir, India
              </span>
            </div>

            <div className="d-flex gap-3 mb-3">
              <i className="bi bi-envelope fs-5 text-success"></i>
              <span className="text-secondary">support@alpine.com</span>
            </div>

            <div className="d-flex gap-3">
              <i className="bi bi-telephone fs-5 text-success"></i>
              <span className="text-secondary">+91 96354762034</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="py-3 text-center text-secondary"
        style={{
          background: "#0a0f13",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}>
        Designed & Developed by{" "}
        <span>
          <a href="https://www.siffrum.com/" target="_blank">
            {" "}
            Siffrum Analytics Pvt Ltd
          </a>
        </span>{" "}
        © 2025 Alpine. All rights reserved.
      </div>
    </footer>
  );
}
