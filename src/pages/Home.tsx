import { BannerCarousel } from "../components/BannerCarousel";
import { BestSelling } from "../components/BestSelling";
import { FeatureBar } from "../components/FeatureBar";

export default function Home() {
  return (
    <div className="w-100">
      <BannerCarousel />
      <FeatureBar />
      <BestSelling />
    </div>
  );
}
