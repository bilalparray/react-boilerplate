import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useProduct } from "../hooks/useProduct";

export default function ProductPage() {
  const { id } = useParams();
  const { product, loading } = useProduct(Number(id));

  const { addToCart, addToWishlist, wishlistItems } = useCartStore();

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

  const price = variant.price;
  const compare = variant.comparePrice;

  /* -------------------------------
     ADD TO CART (qty-aware)
  -------------------------------- */
  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        image: product.images?.[0],
        price,
        comparePrice: compare,
        weight: variant.weight,
        unit: variant.unit.symbol,
        stock: variant.stock,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = () => {
    addToWishlist({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      image: product.images?.[0],
      price,
      comparePrice: compare,
      weight: variant.weight,
      unit: variant.unit.symbol,
      stock: variant.stock,
    });
  };

  return (
    <div className="container py-5">
      <div className="row g-5 align-items-start">
        {/* GALLERY */}
        <div className="col-md-6">
          <div className="rounded-4 overflow-hidden shadow-lg">
            <img
              src={product.images[activeImage]}
              className="w-100"
              style={{ height: "480px", objectFit: "cover" }}
            />
          </div>

          <div className="d-flex gap-3 mt-3">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setActiveImage(i)}
                className="rounded-3 shadow-sm"
                style={{
                  width: "72px",
                  height: "72px",
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

        {/* INFO */}
        <div className="col-md-6">
          <div className="text-success fw-bold text-uppercase small">
            Starting from ₹{product.minPrice}
          </div>

          <h1 className="fw-bold mt-2">{product.name}</h1>

          <div className="fs-3 fw-bold mt-3" style={{ color: "#F59E0B" }}>
            ₹{price}
            {compare > 0 && (
              <span className="text-muted fs-6 ms-2 text-decoration-line-through">
                ₹{compare}
              </span>
            )}
          </div>

          <p className="text-muted mt-4">{product.description}</p>

          {/* VARIANTS */}
          <div className="mt-4">
            <div className="fw-semibold mb-2">Select Pack</div>
            <div className="d-flex gap-3 flex-wrap">
              {product.variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVariantIndex(i);
                    setQty(1);
                  }}
                  className="btn rounded-pill px-4 py-2 fw-semibold"
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

          {/* QUANTITY */}
          <div className="d-flex align-items-center gap-4 mt-4">
            <span className="fw-semibold">Quantity</span>

            <div className="d-flex border rounded-pill overflow-hidden shadow-sm">
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

          {/* ACTIONS */}
          <div className="d-flex gap-3 mt-5">
            <button
              onClick={handleAddToCart}
              disabled={!variant.isInStock}
              className="btn flex-fill rounded-pill py-3 fw-semibold shadow-lg"
              style={{
                background: added ? "#16a34a" : "#F59E0B",
                color: "#fff",
                opacity: variant.isInStock ? 1 : 0.5,
              }}>
              {added ? "✔ Added" : "Add to Cart"}
            </button>

            <button
              onClick={handleWishlist}
              className="btn rounded-circle shadow-lg"
              style={{
                width: "52px",
                height: "52px",
                background: isInWishlist ? "#16a34a" : "#fff",
                color: isInWishlist ? "#fff" : "#111",
              }}>
              <i className={isInWishlist ? "bi bi-check" : "bi bi-heart"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
