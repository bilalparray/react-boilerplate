import { useEffect, useState } from "react";
import { useBanners } from "../../hooks/useBanners";
import "./BannerCarousel.css";
import { Link } from "react-router-dom";

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

          <p className="hero-sub">{current.description}</p>

          <div className="hero-cta-row">
            <Link to={current.link || "#"} className="hero-btn">
              Explore Shop
            </Link>
            <span className="hero-price">{current.ctaText}</span>
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

        {/* SCROLL DOWN BUTTON */}
        <button
          className="hero-scroll-down"
          onClick={() => {
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: "smooth",
            });
          }}
          aria-label="Scroll to bottom">
          <div className="scroll-down-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7 10L12 15L17 10"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="scroll-down-arrow">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7 10L12 15L17 10"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="scroll-pulse-ring"></div>
        </button>
      </div>
    </section>
  );
}
