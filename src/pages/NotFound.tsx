import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
      <div className="container text-center py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="mb-4">
              <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: "5rem" }}></i>
            </div>
            <h1 className="display-1 fw-bold text-dark mb-3">404</h1>
            <h2 className="h3 fw-semibold mb-3">Page Not Found</h2>
            <p className="text-muted mb-4 lead">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/" className="btn btn-success btn-lg px-4">
                <i className="bi bi-house-door me-2"></i>
                Go Home
              </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
