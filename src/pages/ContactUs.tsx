import { useState } from "react";
import { submitContact } from "../services/contact.service";
import "./ContactUs.css";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.description) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await submitContact(form);
      setSent(true);
      setForm({ name: "", email: "", description: "" });
    } catch {
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* HERO */}
      <div
        className="contact-hero d-flex align-items-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80)",
        }}>
        <div className="container text-white">
          <h1 className="fw-bold display-5">Contact Us</h1>
          <p className="lead">We are here to help you. Reach out anytime.</p>
        </div>
      </div>

      {/* FORM */}
      <div className="container py-5">
        <div className="row g-5">
          {/* Info */}
          <div className="col-md-5">
            <h3 className="fw-bold">Wild Valley Foods</h3>
            <p className="text-muted mt-3">
              Have a question about our products, shipping, or orders? Our
              support team is ready to help you.
            </p>

            <div className="mt-4">
              <p>
                <i className="bi bi-geo-alt me-2"></i> Kashmir, India
              </p>
              <p>
                <i className="bi bi-envelope me-2"></i>{" "}
                support@wildvalleyfoods.in
              </p>
              <p>
                <i className="bi bi-phone me-2"></i> +91 98765 43210
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="col-md-7">
            <div className="bg-white p-4 rounded-4 shadow-sm">
              <h5 className="fw-bold mb-3">Send us a message</h5>

              {sent && (
                <div className="alert alert-success">
                  Your message has been sent successfully.
                </div>
              )}

              <input
                className="form-control mb-3"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                className="form-control mb-3"
                placeholder="Your Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <textarea
                className="form-control mb-3"
                rows={5}
                placeholder="How can we help you?"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-success w-100 py-3 fw-semibold">
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
