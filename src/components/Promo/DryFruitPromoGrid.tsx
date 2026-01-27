import "./DryFruitPromoGrid.css";
import { useNavigate } from "react-router-dom";

const promos = [
  {
    title: "Premium Almonds",
    subtitle: "Handpicked Kashmiri Almonds",
    price: "₹699",
    img: "almonds.png",
    bg: "bg-blue",
  },
  {
    title: "Organic Walnuts",
    subtitle: "Fresh from the orchard",
    price: "₹799",
    img: "walnuts.png",
    bg: "bg-light",
  },
  {
    title: "Dried Berries",
    subtitle: "Antioxidant rich",
    price: "₹899",
    img: "berries.png",
    bg: "bg-white",
  },
  {
    title: "Premium Cashews",
    subtitle: "Perfect gifting packs",
    price: "",
    img: "cashews.png",
    bg: "bg-cream",
  },
];

export default function DryFruitPromoGrid() {
  const navigate = useNavigate();

  return (
    <div className="container my-5">
      <div className="row g-4">
        {promos.map((p, i) => (
          <div key={i} className="col-12 col-md-6 col-lg-3">
            <div className={`promo-card ${p.bg}`}>
              <div className="promo-content">
                <h3>{p.title}</h3>
                <p>{p.subtitle}</p>
                {p.price && (
                  <div className="promo-price">
                    Starting at <span>{p.price}</span>
                  </div>
                )}
                <button
                  className="promo-btn"
                  onClick={() => {
                    navigate("/shop");
                  }}>
                  Shop Now <i className="bi bi-arrow-right"></i>
                </button>
              </div>

              <img src={p.img} className="promo-img" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
