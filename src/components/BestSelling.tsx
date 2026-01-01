import { ProductCard } from "./ProductCard";

export function BestSelling() {
  const products = [
    {
      id: 1,
      name: "KASHMIRI ALMONDS PREMIUM",
      category: { id: 1, name: "Dry Fruits" },
      images: [
        "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2",
        "https://images.unsplash.com/photo-1573812461383-e5f8b759d12e",
      ],
      description: "Premium Kashmiri almonds sourced from Himalayan farms.",
      richDescription:
        "Naturally grown, chemical-free almonds with rich taste.",
      isBestSelling: true,

      variants: [
        {
          id: 101,
          productId: 1,
          isDefaultVariant: true,
          weight: "500",
          unitSymbol: "g",
          price: "799",
          comparePrice: "999",
          stock: 22,
          sku: "ALM-500G",
        },
        {
          id: 102,
          productId: 1,
          weight: "1",
          unitSymbol: "Kg",
          price: "1499",
          comparePrice: "1799",
          stock: 15,
          sku: "ALM-1KG",
        },
      ],
    },

    {
      id: 2,
      name: "ORGANIC KASHMIRI HONEY",
      category: { id: 2, name: "Honey" },
      images: ["https://images.unsplash.com/photo-1587049633312-d628ae50a8ae"],
      description: "Raw, unprocessed Himalayan honey.",
      richDescription: "Collected from wild Himalayan bees. No sugar added.",
      isBestSelling: true,

      variants: [
        {
          id: 201,
          productId: 2,
          isDefaultVariant: true,
          weight: "500",
          unitSymbol: "g",
          price: "499",
          comparePrice: "650",
          stock: 40,
          sku: "HON-500G",
        },
        {
          id: 202,
          productId: 2,
          weight: "1",
          unitSymbol: "Kg",
          price: "899",
          comparePrice: "1100",
          stock: 25,
          sku: "HON-1KG",
        },
      ],
    },

    {
      id: 3,
      name: "HIMALAYAN WALNUTS",
      category: { id: 1, name: "Dry Fruits" },
      images: ["https://images.unsplash.com/photo-1580910051074-7c37b2eec4d7"],
      description: "Crunchy, high-nutrition Kashmiri walnuts.",
      richDescription: "Rich in Omega-3 and antioxidants.",

      variants: [
        {
          id: 301,
          productId: 3,
          isDefaultVariant: true,
          weight: "500",
          unitSymbol: "g",
          price: "699",
          comparePrice: "899",
          stock: 18,
          sku: "WAL-500G",
        },
      ],
    },

    {
      id: 4,
      name: "KASHMIRI SAFFRON",
      category: { id: 3, name: "Spices" },
      images: ["https://images.unsplash.com/photo-1598373182133-52452f7691ef"],
      description: "Pure Kashmiri Kesar.",
      richDescription: "Hand-picked from Pampore fields.",

      variants: [
        {
          id: 401,
          productId: 4,
          isDefaultVariant: true,
          weight: "1",
          unitSymbol: "g",
          price: "1499",
          comparePrice: "1999",
          stock: 10,
          sku: "KES-1G",
        },
      ],
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
