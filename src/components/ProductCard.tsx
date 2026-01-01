import { useCartStore } from "../store/useCartStore";

export function ProductCard({ product }: any) {
  const { addToCart, addToWishlist } = useCartStore();

  return (
    <div
      className="bg-white rounded-4 h-100 overflow-hidden"
      style={{
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.05)";
      }}>
      {/* Image Area */}
      <div className="position-relative">
        <img
          src={product.image}
          className="w-100"
          style={{
            height: "260px",
            objectFit: "cover",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
          }}
        />

        {/* Action Icons */}
        <div className="position-absolute top-0 end-0 m-3 d-flex flex-column gap-2">
          <button
            onClick={addToWishlist}
            className="btn rounded-circle"
            style={{
              background: "#fff",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            }}>
            <i className="bi bi-heart"></i>
          </button>

          <button
            className="btn rounded-circle"
            style={{
              background: "#fff",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            }}>
            <i className="bi bi-eye"></i>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="fw-bold text-uppercase">{product.name}</div>
        <div className="text-muted small">{product.category}</div>

        <div className="mt-3 fw-bold fs-5" style={{ color: "#F59E0B" }}>
          ₹{product.price}
        </div>
        <button
          className="btn w-100 mt-3"
          style={{
            background: "#F59E0B",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          }}
          onClick={addToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
