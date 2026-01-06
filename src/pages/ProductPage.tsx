import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useProduct } from "../hooks/useProduct";
import { useProductRating } from "../hooks/useProductRating";
import { RatingStars } from "../components/Ratings/RatingStars";
import "./ProductPage.css";
import { WriteReviewModal } from "../components/Ratings/WriteReviewModal";

export default function ProductPage() {
  const { id } = useParams();
  const { product, loading } = useProduct(Number(id));
  const { rating, count } = useProductRating(Number(id));
  const [showReviewModal, setShowReviewModal] = useState(false);

  const { addToCart, addToWishlist, wishlistItems } = useCartStore();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState<"desc" | "specs" | "reviews">("desc");

  if (loading) return <div className="container py-5">Loading…</div>;
  if (!product) return <div className="container py-5">Product not found</div>;

  const variant = product.variants[selectedVariantIndex];

  const isInWishlist = wishlistItems.some(
    (x) => x.productId === product.id && x.variantId === variant.id
  );

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        image: product.images[0],
        price: variant.price,
        comparePrice: variant.comparePrice,
        weight: variant.weight,
        unit: variant.unit.symbol,
        stock: variant.stock,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="container py-5">
      <div className="row g-5">
        {/* IMAGE GALLERY */}
        <div className="col-md-6">
          <div className="border rounded-4 p-3">
            <img
              src={product.images[activeImage]}
              className="w-100 rounded-3"
              style={{ height: "480px", objectFit: "cover" }}
            />

            <div className="d-flex gap-3 mt-3 justify-content-center">
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
        </div>

        {/* PRODUCT INFO */}
        <div className="col-md-6">
          <div className="product-meta-box">
            <div className="d-flex justify-content-between">
              <div>
                <h2 className="fw-bold">{product.name}</h2>
                <div className="text-muted small">
                  Seller: Wild Valley Foods
                </div>
              </div>

              <button
                onClick={() =>
                  addToWishlist({
                    productId: product.id,
                    variantId: variant.id,
                    name: product.name,
                    image: product.images[0],
                    price: variant.price,
                    comparePrice: variant.comparePrice,
                    weight: variant.weight,
                    unit: variant.unit.symbol,
                    stock: variant.stock,
                  })
                }
                className="btn btn-light rounded-circle shadow-sm">
                <i
                  className={`bi ${
                    isInWishlist ? "bi-heart-fill text-danger" : "bi-heart"
                  }`}
                />
              </button>
            </div>

            <div className="mt-2">
              <RatingStars rating={rating} count={count} />
            </div>

            <div className="price-box mt-3">
              ₹{variant.price}
              {variant.comparePrice > variant.price && (
                <span className="old-price ms-2">₹{variant.comparePrice}</span>
              )}
            </div>

            <div className="mt-2 fw-semibold text-success">
              {variant.isInStock ? "In Stock" : "Out of Stock"}
            </div>

            {/* Variants */}
            <div className="mt-4">
              <div className="fw-semibold mb-2">Choose Variant</div>
              <div className="variant-grid">
                {product.variants.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariantIndex(i);
                      setQty(1);
                    }}
                    className={`variant-chip ${
                      i === selectedVariantIndex ? "active" : ""
                    }`}>
                    {v.displayWeight}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Cart */}
            <div className="d-flex align-items-center gap-3 mt-4">
              <div className="qty-box">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span>{qty}</span>
                <button
                  onClick={() => setQty(Math.min(variant.stock, qty + 1))}>
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!variant.isInStock}
                className="btn btn-warning flex-fill fw-semibold py-3 rounded-pill">
                {added ? "✔ Added" : "Add to Cart"}
              </button>
            </div>

            {/* Feature Icons */}
            <div className="feature-list mt-4">
              <div>🌱 Vegetarian</div>
              <div>🚚 Fast Delivery</div>
              <div>♻️ Non Returnable</div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="mt-5">
        <div className="d-flex gap-4 border-bottom pb-2">
          {["desc", "specs", "reviews"].map((t) => (
            <button
              key={t}
              className={`btn p-0 ${
                tab === t ? "fw-bold text-success" : "text-muted"
              }`}
              onClick={() => setTab(t as any)}>
              {t === "desc"
                ? "Product Description"
                : t === "specs"
                ? "Specifications"
                : "Ratings & Reviews"}
            </button>
          ))}
        </div>

        {tab === "desc" && (
          <p className="mt-4 text-muted">{product.description}</p>
        )}

        {tab === "specs" && (
          <table className="table mt-4">
            <tbody>
              <tr>
                <th>SKU</th>
                <td>{product.id}</td>
              </tr>
              <tr>
                <th>Weight</th>
                <td>{variant.displayWeight}</td>
              </tr>
              <tr>
                <th>Availability</th>
                <td>{variant.isInStock ? "In Stock" : "Out of Stock"}</td>
              </tr>
            </tbody>
          </table>
        )}

        {tab === "reviews" && (
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center">
              <RatingStars rating={rating} count={count} />
              <button
                className="btn btn-outline-success"
                onClick={() => setShowReviewModal(true)}>
                Write a Review
              </button>
            </div>
          </div>
        )}
      </div>
      {showReviewModal && (
        <WriteReviewModal
          productId={product.id}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
}
