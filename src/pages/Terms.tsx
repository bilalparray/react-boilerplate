export default function Terms() {
  return (
    <div>
      {/* HERO */}
      <div
        className="contact-hero d-flex align-items-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=1400&q=80)",
        }}>
        <div className="container text-white">
          <h1 className="fw-bold display-5">Terms & Conditions</h1>
          <p className="lead">
            Please read these terms carefully before using our services.
          </p>
        </div>
      </div>

      <div className="container py-5">
        <h3 className="fw-bold">Wild Valley Foods Terms of Service</h3>

        <p className="text-muted mt-3">
          By accessing or using our website, you agree to be bound by these
          Terms and Conditions. If you do not agree, please do not use our
          services.
        </p>

        <h5 className="fw-bold mt-4">1. Product Information</h5>
        <p className="text-muted">
          We strive to provide accurate product descriptions and pricing.
          However, we do not guarantee that all information is error-free.
        </p>

        <h5 className="fw-bold mt-4">2. Orders & Payments</h5>
        <p className="text-muted">
          All orders are subject to availability and confirmation. Payments are
          processed securely through authorized gateways.
        </p>

        <h5 className="fw-bold mt-4">3. Shipping & Delivery</h5>
        <p className="text-muted">
          Delivery timelines may vary depending on location. We are not
          responsible for delays caused by external factors.
        </p>

        <h5 className="fw-bold mt-4">4. Returns & Refunds</h5>
        <p className="text-muted">
          Perishable goods are non-returnable unless damaged or defective.
          Refunds will be processed after verification.
        </p>

        <h5 className="fw-bold mt-4">5. Limitation of Liability</h5>
        <p className="text-muted">
          Wild Valley Foods shall not be liable for any indirect or
          consequential damages arising from the use of our products.
        </p>

        <h5 className="fw-bold mt-4">6. Governing Law</h5>
        <p className="text-muted">
          These terms are governed by the laws of India. Any disputes will be
          subject to the jurisdiction of Indian courts.
        </p>
      </div>
    </div>
  );
}
