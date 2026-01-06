import { BannerCarousel } from "../components/Banner/BannerCarousel";
import { BestSelling } from "../components/BestSelling/BestSelling";

import { FeatureBar } from "../components/Feature/FeatureBar";

export default function Home() {
  return (
    <div className="w-100">
      <BannerCarousel />
      <FeatureBar />
      <BestSelling />
    </div>
  );
}
