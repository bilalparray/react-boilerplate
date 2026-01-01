import { ProductCard } from "./ProductCard";

export function BestSelling() {
  const products = [
    {
      id: 1,
      name: "Kashmiri Almonds",
      category: "Dry Fruits",
      price: 799,
      image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2",
    },
    {
      id: 2,
      name: "Organic Honey",
      category: "Honey",
      price: 499,
      image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2",
    },
    {
      id: 3,
      name: "Walnuts",
      category: "Dry Fruits",
      price: 699,
      image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2",
    },
    {
      id: 4,
      name: "Saffron",
      category: "Spices",
      price: 1499,
      image: "https://images.unsplash.com/photo-1598373182133-52452f7691ef",
    },
  ];

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ letterSpacing: "-0.5px" }}>
          Best Selling Products
        </h2>

        <button
          className="btn rounded-pill"
          style={{ border: "1px solid #F59E0B", color: "#F59E0B" }}>
          View All
        </button>
      </div>

      <div className="row g-4">
        {products.map((p) => (
          <div key={p.id} className="col-6 col-md-4 col-lg-3">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
