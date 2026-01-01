import { useParams } from "react-router-dom";

export default function CategoryPage() {
  const { slug } = useParams();

  return (
    <div className="container py-5">
      <h1 className="fw-bold text-capitalize">{slug?.replace("-", " ")}</h1>

      <p className="text-muted">Showing products for {slug}</p>

      {/* Later you will load products by category */}
    </div>
  );
}
