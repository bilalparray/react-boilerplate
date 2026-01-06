import type { FC } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./FeatureBar.css";

interface Feature {
  icon: string;
  title: string;
  subtitle: string;
}

export const FeatureBar: FC = () => {
  const features: Feature[] = [
    {
      icon: "bi-truck",
      title: "Worldwide Delivery",
      subtitle: "Fast & reliable shipping",
    },
    {
      icon: "bi-clock",
      title: "24×7 Support",
      subtitle: "We are always here to help",
    },
    {
      icon: "bi-megaphone",
      title: "Festive Offers",
      subtitle: "Up to 50% seasonal discounts",
    },
    {
      icon: "bi-credit-card",
      title: "Secure Payments",
      subtitle: "All major cards & UPI supported",
    },
  ];

  return (
    <section className="feature-section">
      <div className="container">
        <div className="row g-4">
          {features.map((item, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-3">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className={`bi ${item.icon}`}></i>
                </div>

                <div className="feature-text">
                  <h6>{item.title}</h6>
                  <p>{item.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
