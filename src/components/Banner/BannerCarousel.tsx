import { useEffect, useState } from "react";
import { useBanners } from "../../hooks/useBanners";
import "./BannerCarousel.css";

export function BannerCarousel() {
  const { banners, loading } = useBanners();
  const [index, setIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    if (banners.length === 0) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [banners]);

  if (loading) {
    return (
      <div
        className="w-100 rounded-4"
        style={{
          height: "420px",
          background:
            "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 37%, #e5e7eb 63%)",
          backgroundSize: "400% 100%",
          animation: "shimmer 1.4s ease infinite",
        }}
      />
    );
  }

  if (banners.length === 0) return null;

  const current = banners[index];

  return (
    <div
      className="position-relative overflow-hidden rounded-4 shadow-lg"
      style={{ height: "460px" }}>
      {/* Background image */}
      <img
        src={current.image_base64}
        alt={current.title}
        className="w-100 h-100 position-absolute top-0 start-0 banner-image"
        style={{ objectFit: "cover" }}
      />

      {/* Premium gradient */}
      <div className="position-absolute top-0 start-0 w-100 h-100 banner-overlay" />

      {/* Content */}
      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center px-5">
        <div className="banner-glass text-white" style={{ maxWidth: "520px" }}>
          <h1 className="fw-bold display-5 lh-sm mb-3">{current.title}</h1>

          <p style={{ color: "#d1fae5" }}>
            Pure Kashmiri produce, sourced directly from farms and delivered to
            your home with uncompromised freshness.
          </p>

          {current.link && (
            <a
              href={current.link}
              className="btn banner-cta rounded-pill px-4 py-2 fw-semibold mt-3">
              Shop Now
            </a>
          )}
        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={() =>
          setIndex((i) => (i - 1 + banners.length) % banners.length)
        }
        className="position-absolute top-50 start-0 translate-middle-y btn btn-light rounded-circle ms-3 shadow"
        style={{ width: "46px", height: "46px", opacity: 0.9 }}>
        ‹
      </button>

      <button
        onClick={() => setIndex((i) => (i + 1) % banners.length)}
        className="position-absolute top-50 end-0 translate-middle-y btn btn-light rounded-circle me-3 shadow"
        style={{ width: "46px", height: "46px", opacity: 0.9 }}>
        ›
      </button>

      {/* Indicators */}
      <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 d-flex gap-2">
        {banners.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: i === index ? "32px" : "10px",
              height: "10px",
              borderRadius: "20px",
              cursor: "pointer",
              backgroundColor:
                i === index ? "#facc15" : "rgba(255,255,255,0.4)",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
