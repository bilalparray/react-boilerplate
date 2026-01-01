export function FeatureBar() {
  const features = [
    {
      icon: "bi-truck",
      title: "Shipping",
      subtitle: "Shipping World Wide",
    },
    {
      icon: "bi-clock",
      title: "24 X 7 Service",
      subtitle: "Online Service For 24 X 7",
    },
    {
      icon: "bi-megaphone",
      title: "Festival Offer",
      subtitle: "Super Sale Upto 50% Off",
    },
    {
      icon: "bi-credit-card",
      title: "Online Pay",
      subtitle: "Online Payment Available",
    },
  ];

  return (
    <div className="container my-5">
      <div className="row g-3">
        {features.map((item, index) => (
          <div key={index} className="col-6 col-md-6 col-lg-3">
          <div
  className="rounded-4 p-3 p-md-4 h-100 d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3"
  style={{
    background: "#FAF9F7",
    boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
    transition: "all 0.3s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}

>


              {/* Icon */}
              <div
                className="d-flex align-items-center justify-content-center rounded-circle bg-warning bg-opacity-10 text-warning flex-shrink-0"
                style={{ width: "56px", height: "56px" }}
              >
                <i className={`bi ${item.icon} fs-4`}></i>
              </div>

              {/* Text */}
              <div className="text-center text-md-start" style={{ color: "#1F2937" }}>
                <div className="fw-bold">{item.title}</div>
                <div className="text-muted small">{item.subtitle}</div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
