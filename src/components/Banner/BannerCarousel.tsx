import { useEffect, useState } from "react";
import { useBanners } from "../../hooks/useBanners";
import "./BannerCarousel.css";

export function BannerCarousel() {
  const { banners, loading } = useBanners();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 6000);
    return () => clearInterval(t);
  }, [banners]);

  if (loading) return <div className="banner-skeleton" />;
  if (banners.length === 0) return null;

  const current = banners[index];

  return (
    <section className="hero-wrap">
      <div className="hero-container">
        {/* LEFT CONTENT */}
        <div className="hero-left">
          <span className="hero-badge">
            Save Up To 50% Off On Your First Order
          </span>

          <h1 className="hero-title">{current.title}</h1>

          <p className="hero-sub">
            Get fresh Kashmiri produce delivered to your home with express speed
            and farm-grade quality.
          </p>

          <div className="hero-cta-row">
            <a href={current.link || "#"} className="hero-btn">
              Explore Shop
            </a>
            <span className="hero-price">Starting at ₹160.99</span>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hero-right">
          <img
            src={current.image_base64}
            alt={current.title}
            className="hero-image"
          />
        </div>

        {/* SLIDER ARROWS */}
        <button
          className="hero-nav left"
          onClick={() =>
            setIndex((i) => (i - 1 + banners.length) % banners.length)
          }>
          ‹
        </button>

        <button
          className="hero-nav right"
          onClick={() => setIndex((i) => (i + 1) % banners.length)}>
          ›
        </button>
      </div>
    </section>
  );
}
