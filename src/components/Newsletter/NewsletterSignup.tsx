import { useState } from "react";
import "./NewsletterSignup.css";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      // Simulate API call
      setTimeout(() => {
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus("idle"), 3000);
      }, 500);
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h2 className="newsletter-title">Subscribe to Our Newsletter</h2>
            <p className="newsletter-subtitle">
              Get exclusive offers, new product updates, and special discounts
              delivered straight to your inbox.
            </p>
          </div>

          <form className="newsletter-form" onSubmit={handleSubmit}>
            <div className="newsletter-input-wrapper">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-button">
                Subscribe
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>

            {status === "success" && (
              <div className="newsletter-message success">
                <i className="bi bi-check-circle"></i>
                Thank you! Check your inbox for confirmation.
              </div>
            )}

            {status === "error" && (
              <div className="newsletter-message error">
                <i className="bi bi-exclamation-circle"></i>
                Please enter a valid email address.
              </div>
            )}
          </form>

          <div className="newsletter-trust">
            <div className="trust-item">
              <i className="bi bi-shield-check"></i>
              <span>No spam, unsubscribe anytime</span>
            </div>
            <div className="trust-item">
              <i className="bi bi-people"></i>
              <span>Join 10,000+ subscribers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
