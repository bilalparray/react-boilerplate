export default function ThankYou() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #020617 60%, #020617 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}>
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          maxWidth: "520px",
          width: "100%",
          padding: "40px",
          textAlign: "center",
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
        }}>
        {/* Tick */}
        <div
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            background: "#22c55e",
            margin: "0 auto 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "48px",
            color: "white",
            fontWeight: "bold",
          }}>
          ✓
        </div>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "10px",
          }}>
          Payment Successful
        </h1>

        <p
          style={{
            color: "#475569",
            fontSize: "16px",
            lineHeight: 1.6,
          }}>
          Your order has been placed successfully.
          <br />
          We’re preparing it for dispatch.
        </p>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "#e2e8f0",
            margin: "30px 0",
          }}
        />

        {/* What happens next */}
        <div style={{ textAlign: "left" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: 600,
              marginBottom: "12px",
              color: "#0f172a",
            }}>
            What happens next
          </h3>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              color: "#334155",
              fontSize: "14px",
            }}>
            <li style={{ marginBottom: "10px" }}>✔ Order confirmed</li>
            <li style={{ marginBottom: "10px" }}>✔ Items being packed</li>
            <li style={{ marginBottom: "10px" }}>
              ✔ Shipping updates will be sent
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "30px",
          }}>
          <a
            href="/"
            style={{
              flex: 1,
              textDecoration: "none",
              background: "#2563eb",
              color: "#ffffff",
              padding: "14px",
              borderRadius: "8px",
              fontWeight: 600,
              textAlign: "center",
            }}>
            Continue Shopping
          </a>

          <a
            href="/myorders"
            style={{
              flex: 1,
              textDecoration: "none",
              background: "#218f12",
              color: "#0f172a",
              padding: "14px",
              borderRadius: "8px",
              fontWeight: 600,
              textAlign: "center",
              border: "1px solid #e2e8f0",
            }}>
            View Order
          </a>
        </div>

        <p
          style={{
            marginTop: "30px",
            fontSize: "12px",
            color: "#64748b",
          }}>
          If you need help, our support team is available 24/7.
        </p>
      </div>
    </div>
  );
}
