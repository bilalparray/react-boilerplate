export default function AboutUs() {
  return (
    <div>
      {/* HERO */}
      <div
        className="about-hero d-flex align-items-center"
        style={{ backgroundColor: "#1c1e59", padding: "80px 0" }}>
        <div className="container text-white">
          <h1 className="display-4 fw-bold">Alpine</h1>
          <p className="lead">
            Pure ingredients. Honest sourcing. Real food from nature.
          </p>
        </div>
      </div>

      {/* INTRO */}
      <div className="container py-5">
        <div className="row g-5 align-items-center">
          <div className="col-md-6">
            <img src="/alpine.png" className="img-fluid rounded-4 shadow" />
          </div>

          <div className="col-md-6">
            <h2 className="fw-bold">Our Story</h2>
            <p className="text-muted mt-3">
              Alpine Saffron was created with a simple mission — bring
              authentic, unprocessed, and ethically sourced food to modern
              homes. We work directly with farmers and producers who respect
              nature, soil, and tradition.
            </p>
            <p className="text-muted">
              In a world full of artificial flavors and shortcuts, we choose
              purity, freshness, and transparency.
            </p>
          </div>
        </div>
      </div>

      {/* VALUES */}
      <div className="bg-light py-5">
        <div className="container">
          <h2 className="fw-bold text-center mb-5">Why Choose Us</h2>

          <div className="row g-4 text-center">
            <div className="col-md-3">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                <i className="bi bi-tree fs-1 text-success"></i>
                <h5 className="fw-bold mt-3">Natural</h5>
                <p className="text-muted">
                  No chemicals. No shortcuts. Just real ingredients.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                <i className="bi bi-shield-check fs-1 text-success"></i>
                <h5 className="fw-bold mt-3">Tested Quality</h5>
                <p className="text-muted">
                  Every batch is checked for purity and freshness.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                <i className="bi bi-people fs-1 text-success"></i>
                <h5 className="fw-bold mt-3">Farmer First</h5>
                <p className="text-muted">
                  We support local growers and ethical trade.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                <i className="bi bi-heart fs-1 text-success"></i>
                <h5 className="fw-bold mt-3">Health Focused</h5>
                <p className="text-muted">
                  Nutrition and safety come before profit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FARMERS */}
      <div className="container py-5">
        <div className="row g-5 align-items-center">
          <div className="col-md-6">
            <h2 className="fw-bold">From Farms to Families</h2>
            <p className="text-muted mt-3">
              We partner with farmers across Kashmir and India who grow
              ingredients with care and respect for the land. By cutting out
              unnecessary middlemen, we ensure both better quality and fair
              prices.
            </p>
            <p className="text-muted">
              When you buy from Alpine, you directly support the people who grow
              your food.
            </p>
          </div>

          <div className="col-md-6">
            <img
              src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80"
              className="img-fluid rounded-4 shadow"
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-success text-white py-5">
        <div className="container text-center">
          <h2 className="fw-bold">Taste the Difference</h2>
          <p className="mt-3">
            Join thousands of families who trust Alpine Saffron for purity and
            quality.
          </p>
          <a
            href="/shop"
            className="btn fw-semibold px-4 py-2 mt-3 about-shop-btn"
            style={{
              backgroundColor: "#951016",
              color: "white",
              border: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#1c1e59")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#951016")
            }>
            Shop Now
          </a>
        </div>
      </div>
    </div>
  );
}
