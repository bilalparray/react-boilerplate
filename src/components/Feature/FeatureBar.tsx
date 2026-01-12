import type { FC } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./FeatureBar.css";

const features = [
  {
    icon: "bi-globe",
    title: "Worldwide Delivery",
    subtitle: "Ships to 180+ countries",
  },
  {
    icon: "bi-headset",
    title: "24×7 Support",
    subtitle: "Real humans, not bots",
  },
  {
    icon: "bi-percent",
    title: "Seasonal Offers",
    subtitle: "Festival & bulk discounts",
  },
  {
    icon: "bi-shield-check",
    title: "Secure Checkout",
    subtitle: "PCI-DSS compliant",
  },
];

export const FeatureBar: FC = () => {
  return (
    <section className="feature-rail">
      <div className="container">
        <div className="feature-track">
          {features.map((f, i) => (
            <div key={i} className="feature-pill">
              <div className="icon-wrap">
                <i className={`bi ${f.icon}`} />
              </div>
              <div className="text-wrap">
                <div className="title">{f.title}</div>
                <div className="subtitle">{f.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
