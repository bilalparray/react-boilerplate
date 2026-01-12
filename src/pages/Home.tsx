import { BannerCarousel } from "../components/Banner/BannerCarousel";
import { BestSelling } from "../components/BestSelling/BestSelling";

import { FeatureBar } from "../components/Feature/FeatureBar";
import { ProductsGrid } from "../components/Product/ProductGrid/ProductGrid";
import DryFruitPromoGrid from "../components/Promo/DryFruitPromoGrid";
import CustomerTestimonials from "../components/Testimonial/CustomerTestimonials";
import VideoShowcase from "../components/Videos/VideoShowcase";

export default function Home() {
  return (
    <div className="w-100">
      <BannerCarousel />
      <FeatureBar />
      <DryFruitPromoGrid />
      <BestSelling />
      <ProductsGrid />
      <CustomerTestimonials />
      <VideoShowcase />
    </div>
  );
}
