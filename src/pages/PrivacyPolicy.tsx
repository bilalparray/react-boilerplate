export default function PrivacyPolicy() {
  return (
    <div>
      {/* HERO */}
      <div
        className="contact-hero d-flex align-items-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1556745753-b2904692b3cd?auto=format&fit=crop&w=1400&q=80)",
        }}>
        <div className="container text-white">
          <h1 className="fw-bold display-5">Privacy Policy</h1>
          <p className="lead">Your data. Your trust. Our responsibility.</p>
        </div>
      </div>

      <div className="container py-5">
        <h3 className="fw-bold"> Alpine Saffron Privacy Policy</h3>

        <p className="text-muted mt-3">
          At Alpine, we respect your privacy and are committed to protecting
          your personal information. This policy explains how we collect, use,
          and protect your data when you use our website.
        </p>

        <h5 className="fw-bold mt-4">1. Information We Collect</h5>
        <p className="text-muted">
          We collect your name, email, phone number, address, and payment
          details when you place an order or contact us. This data is used
          strictly to process your order and provide customer support.
        </p>

        <h5 className="fw-bold mt-4">2. How We Use Your Data</h5>
        <p className="text-muted">
          Your information is used to fulfill orders, improve our services, send
          important updates, and provide personalized shopping experiences.
        </p>

        <h5 className="fw-bold mt-4">3. Data Security</h5>
        <p className="text-muted">
          We use industry-standard security measures to protect your data.
          Payment details are processed securely through certified payment
          gateways like Razorpay.
        </p>

        <h5 className="fw-bold mt-4">4. Cookies</h5>
        <p className="text-muted">
          We use cookies to improve website functionality and analyze user
          behavior. You can control cookies in your browser settings.
        </p>

        <h5 className="fw-bold mt-4">5. Your Rights</h5>
        <p className="text-muted">
          You have the right to access, modify, or request deletion of your
          personal data. Contact us anytime for assistance.
        </p>
      </div>
    </div>
  );
}
