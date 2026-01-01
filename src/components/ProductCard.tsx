import { useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { Link } from "react-router-dom";

export function ProductCard({ product }: any) {
  const { addToCart, addToWishlist, wishlistItems } = useCartStore();

  const [cartAdded, setCartAdded] = useState(false);
  const [wishAdded, setWishAdded] = useState(false);

  const isInWishlist = wishlistItems?.some((p: any) => p.id === product.id);

  const handleAddToCart = () => {
    addToCart(product);
    setCartAdded(true);

    setTimeout(() => {
      setCartAdded(false);
    }, 2000);
  };

  const handleWishlist = () => {
    addToWishlist(product);
    setWishAdded(true);
  };

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
      {/* Image */}
      <div className="position-relative">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            className="w-100"
            style={{
              height: "260px",
              objectFit: "cover",
              borderTopLeftRadius: "1rem",
              borderTopRightRadius: "1rem",
              cursor: "pointer",
            }}
          />
        </Link>
        {/* Floating Buttons */}
        <div className="position-absolute top-0 end-0 m-3 d-flex flex-column gap-2">
          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="btn rounded-circle d-flex align-items-center justify-content-center"
            style={{
              background: isInWishlist || wishAdded ? "#16a34a" : "#fff",
              color: isInWishlist || wishAdded ? "#fff" : "#111",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              width: "42px",
              height: "42px",
              transition: "all 0.3s ease",
            }}>
            {isInWishlist || wishAdded ? (
              <i className="bi bi-check fs-5"></i>
            ) : (
              <i className="bi bi-heart fs-5"></i>
            )}
          </button>

          {/* Quick View */}
          <button
            className="btn rounded-circle"
            style={{
              background: "#fff",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              width: "42px",
              height: "42px",
            }}>
            <i className="bi bi-eye fs-5"></i>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link
          to={`/product/${product.id}`}
          className="text-decoration-none text-dark">
          <div className="fw-bold text-uppercase">{product.name}</div>
        </Link>

        <div className="text-muted small">{product.category}</div>

        <div className="mt-3 fw-bold fs-5" style={{ color: "#F59E0B" }}>
          ₹{product.price}
        </div>

        {/* Add to Cart */}
        <button
          className="btn w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
          style={{
            background: cartAdded ? "#16a34a" : "#F59E0B",
            color: "#fff",
            transition: "all 0.3s ease",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          }}
          onClick={handleAddToCart}>
          {cartAdded ? (
            <>
              <i className="bi bi-check-circle"></i> Added
            </>
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>
    </div>
  );
}
