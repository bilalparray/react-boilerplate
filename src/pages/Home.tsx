import { BannerCarousel } from "../components/Banner/BannerCarousel";
import { BestSelling } from "../components/BestSelling/BestSelling";

import { FeatureBar } from "../components/Feature/FeatureBar";
import { ProductsGrid } from "../components/Product/ProductGrid/ProductGrid";

export default function Home() {
  return (
    <div className="w-100">
      <BannerCarousel />
      <FeatureBar />
      <BestSelling />
      <ProductsGrid />
    </div>
  );
}
