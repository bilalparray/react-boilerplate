import { useEffect, useState } from "react";
import { useBanners } from "../hooks/useBanners";

export function BannerCarousel() {
  const { data: banners, isLoading } = useBanners();
  const [index, setIndex] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners]);

  if (isLoading) {
    return (
      <div
        className="w-100 rounded"
        style={{
          height: "380px",
          backgroundColor: "#e5e7eb",
          animation: "pulse 1.5s infinite",
        }}
      />
    );
  }

  if (!banners || banners.length === 0) return null;

  const current = banners[index];

  const imageUrl = current.image_base64
    ? current.image_base64
    : `https://api.wildvalleyfoods.in${current.imagePath}`;

  return (
    <div
      className="position-relative overflow-hidden rounded shadow w-100"
      style={{ height: "380px" }}
    >
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={current.title}
        className="w-100 h-100 position-absolute top-0 start-0"
        style={{
          objectFit: "cover",
          transform: "scale(1.05)",
          transition: "transform 0.7s",
        }}
      />

      {/* Gradient Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3), transparent)",
        }}
      />

      {/* Content */}
      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center px-5 text-white">
        <div style={{ maxWidth: "520px" }}>
          <h1 className="fw-bold display-5">{current.title}</h1>
          <p className="mt-3 text-light">{current.description}</p>

          {current.ctaText && (
            <a
              href={current.link}
              className="btn btn-light fw-semibold rounded-pill px-4 py-2 mt-3"
            >
              {current.ctaText}
            </a>
          )}
        </div>
      </div>

      {/* Left Arrow */}
      <button
        onClick={() =>
          setIndex((i) => (i - 1 + banners.length) % banners.length)
        }
        className="position-absolute top-50 start-0 translate-middle-y btn btn-dark rounded-circle ms-3"
        style={{ width: "48px", height: "48px", opacity: 0.7 }}
      >
        ‹
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => setIndex((i) => (i + 1) % banners.length)}
        className="position-absolute top-50 end-0 translate-middle-y btn btn-dark rounded-circle me-3"
        style={{ width: "48px", height: "48px", opacity: 0.7 }}
      >
        ›
      </button>

      {/* Dots */}
      <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-2">
        {banners.map((_: any, i: number) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              cursor: "pointer",
              backgroundColor: i === index ? "#fff" : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
