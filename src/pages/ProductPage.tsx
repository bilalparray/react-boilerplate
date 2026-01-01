import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProductApi } from "../hooks/useProductApi";
import { useCartStore } from "../store/useCartStore";

export default function ProductPage() {
  const { id } = useParams();
  const { data: product, isLoading } = useProductApi(id!);
  const { addToCart, addToWishlist, wishlistItems } = useCartStore();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (isLoading) return <div className="container py-5">Loading…</div>;
  if (!product) return <div className="container py-5">Product not found</div>;

  const variant = product.variants[selectedVariantIndex];
  const isInWishlist = wishlistItems.some((p: any) => p.id === product.id);

  const handleAddToCart = () => {
    addToCart({
      ...product,
      variantId: variant.id,
      price: variant.price,
      sku: variant.sku,
      unit: `${variant.weight}${variant.unitSymbol}`,
      quantity: qty,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = () => addToWishlist(product);

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
            {product.images.map((img: string, i: number) => (
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
            {product.category.name}
          </div>

          <h1 className="fw-bold mt-2">{product.name}</h1>

          <div className="fs-3 fw-bold mt-3" style={{ color: "#F59E0B" }}>
            ₹{variant.price}
            <span className="text-muted fs-6 ms-2 text-decoration-line-through">
              ₹{variant.comparePrice}
            </span>
          </div>

          <p className="text-muted mt-4">{product.richDescription}</p>

          {/* Variants */}
          <div className="mt-4">
            <div className="fw-semibold mb-2">Select Pack</div>
            <div className="d-flex gap-3 flex-wrap">
              {product.variants.map((v: any, i: number) => (
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
                    color: "#111827",
                  }}>
                  {v.weight}
                  {v.unitSymbol}
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
              <button className="btn px-3" onClick={() => setQty((q) => q + 1)}>
                +
              </button>
            </div>

            <span className="text-muted">Stock: {variant.stock}</span>
          </div>

          {/* Buttons */}
          <div className="d-flex gap-3 mt-5">
            <button
              onClick={handleAddToCart}
              className="btn flex-fill rounded-pill py-3"
              style={{
                background: added ? "#16a34a" : "#F59E0B",
                color: "#fff",
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
              <i className={isInWishlist ? "bi bi-check" : "bi bi-heart"}></i>
            </button>
          </div>

          {/* Trust */}
          <div className="d-flex gap-4 mt-5 text-muted">
            <div>
              <i className="bi bi-truck"></i> Free Shipping
            </div>
            <div>
              <i className="bi bi-shield-check"></i> 100% Natural
            </div>
            <div>
              <i className="bi bi-arrow-repeat"></i> 7-Day Return
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
