import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useProduct } from "../hooks/useProduct";
import { BestSelling } from "../components/BestSelling";

export default function ProductPage() {
  const { id } = useParams();
  const { product, loading } = useProduct(Number(id));

  const { addToCart, addToWishlist, removeFromWishlist, wishlistItems } =
    useCartStore();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (loading) return <div className="container py-5">Loading…</div>;
  if (!product) return <div className="container py-5">Product not found</div>;

  const variant = product.variants[selectedVariantIndex];

  const isInWishlist = wishlistItems.some(
    (x) => x.productId === product.id && x.variantId === variant.id
  );

  /* ---------------------------------------------
     ADD TO CART — STRICTLY MATCHES CartItem TYPE
  --------------------------------------------- */
  const handleAddToCart = () => {
    if (!variant.isInStock) return;

    addToCart({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      variantId: variant.id,
      price: variant.price,
      comparePrice: variant.comparePrice,
      weight: variant.weight,
      unit: variant.unit.symbol,
      qty: qty,
      stock: variant.stock,
      sku: `${product.id}-${variant.id}`,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  /* ---------------------------------------------
     WISHLIST TOGGLE (ADD / REMOVE)
  --------------------------------------------- */
  const handleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id, variant.id);
      return;
    }

    addToWishlist({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      variantId: variant.id,
      price: variant.price,
      comparePrice: variant.comparePrice,
      weight: variant.weight,
      unit: variant.unit.symbol,
      qty: 1,
      stock: variant.stock,
      sku: `${product.id}-${variant.id}`,
    });
  };

  return (
    <div className="container py-5">
      <div className="row g-5">
        {/* Gallery */}
        <div className="col-md-6">
          <div className="rounded-4 overflow-hidden shadow">
            <img
              src={product.images[activeImage]}
              className="w-100"
              style={{ height: "450px", objectFit: "cover" }}
            />
          </div>

          <div className="d-flex gap-3 mt-3">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setActiveImage(i)}
                className="rounded-3"
                style={{
                  width: "70px",
                  height: "70px",
                  objectFit: "cover",
                  cursor: "pointer",
                  border:
                    i === activeImage
                      ? "2px solid #16a34a"
                      : "1px solid #e5e7eb",
                }}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="col-md-6">
          <div className="text-success fw-bold text-uppercase small">
            Starting from ₹{product.minPrice}
          </div>

          <h1 className="fw-bold mt-2">{product.name}</h1>

          <div className="fs-3 fw-bold mt-3" style={{ color: "#F59E0B" }}>
            ₹{variant.price}
            {variant.comparePrice > 0 && (
              <span className="text-muted fs-6 ms-2 text-decoration-line-through">
                ₹{variant.comparePrice}
              </span>
            )}
          </div>

          <p className="text-muted mt-4">{product.description}</p>

          {/* Variants */}
          <div className="mt-4">
            <div className="fw-semibold mb-2">Select Pack</div>
            <div className="d-flex gap-3 flex-wrap">
              {product.variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantIndex(i)}
                  className="btn rounded-pill px-4 py-2"
                  style={{
                    border:
                      i === selectedVariantIndex
                        ? "2px solid #16a34a"
                        : "1px solid #e5e7eb",
                    background: i === selectedVariantIndex ? "#ecfdf5" : "#fff",
                  }}>
                  {v.displayWeight}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="d-flex align-items-center gap-3 mt-4">
            <span className="fw-semibold">Quantity</span>

            <div className="d-flex border rounded-pill overflow-hidden">
              <button
                className="btn px-3"
                onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>

              <div className="px-4 py-2 fw-bold">{qty}</div>

              <button
                className="btn px-3"
                onClick={() => setQty((q) => Math.min(variant.stock, q + 1))}>
                +
              </button>
            </div>

            <span className="text-muted">Stock: {variant.stock}</span>
          </div>

          {/* Buttons */}
          <div className="d-flex gap-3 mt-5">
            <button
              onClick={handleAddToCart}
              disabled={!variant.isInStock}
              className="btn flex-fill rounded-pill py-3"
              style={{
                background: added ? "#16a34a" : "#F59E0B",
                color: "#fff",
                opacity: variant.isInStock ? 1 : 0.5,
              }}>
              {added ? "✔ Added" : "Add to Cart"}
            </button>

            <button
              onClick={handleWishlist}
              className="btn rounded-circle"
              style={{
                width: "52px",
                height: "52px",
                background: isInWishlist ? "#16a34a" : "#fff",
                color: isInWishlist ? "#fff" : "#111",
                boxShadow: "0 10px 20px rgba(0,0,0,.1)",
              }}>
              <i className={isInWishlist ? "bi bi-check" : "bi bi-heart"} />
            </button>
          </div>
        </div>
      </div>
      <BestSelling />
    </div>
  );
}
