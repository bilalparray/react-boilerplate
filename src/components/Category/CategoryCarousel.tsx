import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./CategoryCarousel.css";
import { useCategories } from "../../hooks/useCategories";

export default function CategoryCarousel() {
  const { categories, loading } = useCategories();
  const sliderRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (dir: "left" | "right") => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  if (loading) return null;

  return (
    <section className="category-carousel">
      <button className="nav-btn left" onClick={() => scroll("left")}>
        ‹
      </button>

      <div className="slider" ref={sliderRef}>
        {categories.map((c) => (
          <div
            key={c.id}
            className="cat-card"
            onClick={() => navigate(`/category/${c.id}`)}>
            <div className="cat-circle">
              <img src={c.image} alt={c.name} />
            </div>

            <div className="cat-name">{c.name}</div>
            <div className="cat-count">125+ Products</div>
          </div>
        ))}
      </div>

      <button className="nav-btn right" onClick={() => scroll("right")}>
        ›
      </button>
    </section>
  );
}
