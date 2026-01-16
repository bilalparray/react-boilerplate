import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useProduct } from "../hooks/useProduct";
import { useProductRating } from "../hooks/useProductRating";
import { RatingStars } from "../components/Ratings/RatingStars";
import "./ProductPage.css";
import { WriteReviewModal } from "../components/Ratings/WriteReviewModal";
import { Product3DImage } from "../components/Product3DImage";
import { ProductCard } from "../components/Product/ProductCard";
import { useRelatedProduct } from "../hooks/useRelatedProduct";
import { toast } from "react-toastify";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading } = useProduct(Number(id));
  const [showReviewModal, setShowReviewModal] = useState(false);
  const { rating, count, reviews, refresh } = useProductRating(Number(id));

  const { addToCart, addToWishlist, wishlistItems } = useCartStore();
  const { relatedProducts } = useRelatedProduct(Number(id));
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState<"desc" | "specs" | "reviews">("desc");

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="product-page-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page-error">
        <div className="error-content">
          <i className="bi bi-exclamation-triangle-fill error-icon"></i>
          <h3 className="error-title">Product Not Found</h3>
          <p className="error-text">The product you're looking for doesn't exist.</p>
          <button className="btn btn-primary" onClick={() => navigate("/shop")}>
            <i className="bi bi-arrow-left me-2"></i>
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const variant = product.variants[selectedVariantIndex];

  const isInWishlist = wishlistItems.some(
    (x) => x.productId === product.id && x.variantId === variant.id
  );

  const handleAddToCart = () => {
    if (!variant.isInStock) {
      toast.warning("This product is currently out of stock");
      return;
    }

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
    toast.success(`${qty} item(s) added to cart`);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      toast.info("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }
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
    });
  };

  return (
    <div className="product-page">
      <div className="product-container">
        {/* Breadcrumb */}
        <nav className="product-breadcrumb">
          <button className="breadcrumb-link" onClick={() => navigate("/shop")}>
            <i className="bi bi-house me-1"></i>
            Shop
          </button>
          <i className="bi bi-chevron-right breadcrumb-separator"></i>
          {product.category && (
            <>
              <span className="breadcrumb-text">{product.category.name}</span>
              <i className="bi bi-chevron-right breadcrumb-separator"></i>
            </>
          )}
          <span className="breadcrumb-text">{product.name}</span>
        </nav>

        <div className="product-grid">
          {/* Image Gallery */}
          <div className="product-images">
            <div className="product-main-image">
              <div className="product-image-container">
                <Product3DImage image={product.images[activeImage]} />
              </div>
              {product.isBestSelling && (
                <div className="best-seller-badge">
                  <i className="bi bi-star-fill me-1"></i>
                  Best Seller
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="product-thumbnails">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className={`thumbnail-item ${i === activeImage ? "active" : ""}`}
                    onClick={() => setActiveImage(i)}>
                    <img src={img} alt={`${product.name} view ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <button
                className={`wishlist-btn ${isInWishlist ? "active" : ""}`}
                onClick={handleWishlistToggle}
                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}>
                <i className={`bi ${isInWishlist ? "bi-heart-fill" : "bi-heart"}`}></i>
              </button>
            </div>

            <div className="product-rating">
              <RatingStars rating={rating} count={count} />
              {count > 0 && (
                <span className="rating-text">
                  ({count} {count === 1 ? "review" : "reviews"})
                </span>
              )}
            </div>

            <div className="product-price-section">
              <div className="product-price">
                {formatCurrency(variant.price)}
              </div>
              {variant.comparePrice > variant.price && (
                <div className="product-compare-price">
                  <span className="compare-price">{formatCurrency(variant.comparePrice)}</span>
                  <span className="discount-badge">
                    {Math.round(((variant.comparePrice - variant.price) / variant.comparePrice) * 100)}% OFF
                  </span>
                </div>
              )}
            </div>

            <div className="product-stock">
              {variant.isInStock ? (
                <div className="stock-badge in-stock">
                  <i className="bi bi-check-circle-fill me-1"></i>
                  In Stock ({variant.stock} available)
                </div>
              ) : (
                <div className="stock-badge out-of-stock">
                  <i className="bi bi-x-circle-fill me-1"></i>
                  Out of Stock
                </div>
              )}
            </div>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div className="product-variants">
                <label className="variants-label">
                  <i className="bi bi-box-seam me-2"></i>
                  Select Variant
                </label>
                <div className="variants-grid">
                  {product.variants.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariantIndex(i);
                        setQty(1);
                      }}
                      className={`variant-btn ${i === selectedVariantIndex ? "active" : ""} ${
                        !v.isInStock ? "disabled" : ""
                      }`}
                      disabled={!v.isInStock}>
                      {v.displayWeight}
                      {!v.isInStock && (
                        <span className="variant-stock-badge">Out of Stock</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="product-actions">
              <div className="quantity-selector">
                <label className="quantity-label">
                  <i className="bi bi-123 me-2"></i>
                  Quantity
                </label>
                <div className="qty-controls">
                  <button
                    className="qty-btn"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={qty <= 1}>
                    <i className="bi bi-dash"></i>
                  </button>
                  <span className="qty-value">{qty}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQty(Math.min(variant.stock, qty + 1))}
                    disabled={qty >= variant.stock || !variant.isInStock}>
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
              </div>

              <button
                className={`btn-add-to-cart ${added ? "added" : ""}`}
                onClick={handleAddToCart}
                disabled={!variant.isInStock}>
                {added ? (
                  <>
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Added to Cart
                  </>
                ) : (
                  <>
                    <i className="bi bi-cart-plus me-2"></i>
                    Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* Product Features */}
            <div className="product-features">
              <div className="feature-item">
                <i className="bi bi-truck feature-icon"></i>
                <div>
                  <div className="feature-title">Free Shipping</div>
                  <div className="feature-desc">On orders above ₹500</div>
                </div>
              </div>
              <div className="feature-item">
                <i className="bi bi-arrow-repeat feature-icon"></i>
                <div>
                  <div className="feature-title">Easy Returns</div>
                  <div className="feature-desc">7-day return policy</div>
                </div>
              </div>
              <div className="feature-item">
                <i className="bi bi-shield-check feature-icon"></i>
                <div>
                  <div className="feature-title">Secure Payment</div>
                  <div className="feature-desc">100% secure transactions</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="product-tabs-section">
          <div className="product-tabs">
            <button
              className={`tab-btn ${tab === "desc" ? "active" : ""}`}
              onClick={() => setTab("desc")}>
              <i className="bi bi-file-text me-2"></i>
              Description
            </button>
            <button
              className={`tab-btn ${tab === "specs" ? "active" : ""}`}
              onClick={() => setTab("specs")}>
              <i className="bi bi-list-check me-2"></i>
              Specifications
            </button>
            <button
              className={`tab-btn ${tab === "reviews" ? "active" : ""}`}
              onClick={() => setTab("reviews")}>
              <i className="bi bi-star me-2"></i>
              Reviews ({count})
            </button>
          </div>

          <div className="tab-content">
            {tab === "desc" && (
              <div className="tab-panel">
                <h3 className="tab-panel-title">Product Description</h3>
                <p className="tab-panel-text">{product.description || "No description available."}</p>
              </div>
            )}

            {tab === "specs" && (
              <div className="tab-panel">
                <h3 className="tab-panel-title">Specifications</h3>
                <div className="specs-table">
                  <div className="spec-row">
                    <div className="spec-label">SKU</div>
                    <div className="spec-value">#{product.id}</div>
                  </div>
                  <div className="spec-row">
                    <div className="spec-label">Weight</div>
                    <div className="spec-value">{variant.displayWeight}</div>
                  </div>
                  <div className="spec-row">
                    <div className="spec-label">Unit</div>
                    <div className="spec-value">{variant.unit.symbol}</div>
                  </div>
                  <div className="spec-row">
                    <div className="spec-label">Availability</div>
                    <div className="spec-value">
                      {variant.isInStock ? (
                        <span className="spec-badge in-stock">In Stock</span>
                      ) : (
                        <span className="spec-badge out-of-stock">Out of Stock</span>
                      )}
                    </div>
                  </div>
                  {product.category && (
                    <div className="spec-row">
                      <div className="spec-label">Category</div>
                      <div className="spec-value">{product.category.name}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === "reviews" && (
              <div className="tab-panel">
                <div className="reviews-header">
                  <div className="reviews-summary">
                    <div className="reviews-rating">
                      <span className="rating-number">{rating.toFixed(1)}</span>
                      <RatingStars rating={rating} count={1} />
                      <span className="reviews-count-text">
                        Based on {count} {count === 1 ? "review" : "reviews"}
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn-write-review"
                    onClick={() => setShowReviewModal(true)}>
                    <i className="bi bi-pencil-square me-2"></i>
                    Write a Review
                  </button>
                </div>

                {reviews.length === 0 ? (
                  <div className="reviews-empty">
                    <i className="bi bi-chat-left-text"></i>
                    <p>No reviews yet. Be the first to review this product!</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowReviewModal(true)}>
                      Write First Review
                    </button>
                  </div>
                ) : (
                  <div className="reviews-list">
                    {reviews.map((r) => (
                      <div key={r.id} className="review-item">
                        <div className="review-header">
                          <div className="review-author">
                            <div className="review-avatar">
                              <i className="bi bi-person-fill"></i>
                            </div>
                            <div>
                              <div className="review-name">{r.name}</div>
                              <div className="review-date">
                                {new Date(r.createdOnUTC).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="review-rating">
                            <RatingStars rating={r.rating} count={1} />
                          </div>
                        </div>
                        {r.comment && (
                          <div className="review-comment">{r.comment}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <div className="section-header">
              <h2 className="section-title">
                <i className="bi bi-grid-3x3-gap me-2"></i>
                Related Products
              </h2>
            </div>
            <div className="related-products-grid">
              {relatedProducts.map((p) => (
                <div key={p.id} className="related-product-item">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <WriteReviewModal
          productId={product.id}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => {
            refresh();
            toast.success("Review submitted successfully!");
            setShowReviewModal(false);
          }}
        />
      )}
    </div>
  );
}
