import { useState, useEffect } from "react";
import { useCartStore } from "../store/useCartStore";
import { Link } from "react-router-dom";

export function ProductCard({ product }: any) {
  const { addToCart, addToWishlist, wishlistItems } = useCartStore();

  // ---- Safe default variant
  const defaultVariant =
    product?.variants?.find((v: any) => v.isDefaultVariant) ||
    product?.variants?.[0] ||
    null;

  const [variant, setVariant] = useState<any>(defaultVariant);

  useEffect(() => {
    setVariant(defaultVariant);
  }, [product]);

  if (!product || !variant) return null;

  // ---- Prices
  const price = Number(variant.price ?? 0);
  const compare = Number(variant.comparePrice ?? 0);
  const discount =
    compare > price ? Math.round(((compare - price) / compare) * 100) : 0;

  // ---- Wishlist state
  const isWishlisted = wishlistItems?.some(
    (p: any) => p.variantId === variant.id
  );

  // ---- Cart handler
  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.images?.[0],
      variantId: variant.id,
      price: price,
      comparePrice: compare,
      weight: variant.weight,
      unit: variant.unitSymbol,
      stock: variant.stock,
      sku: variant.sku,
    });
  };

  const handleWishlist = () => {
    addToWishlist({
      productId: product.id,
      name: product.name,
      image: product.images?.[0],
      variantId: variant.id,
      price: price,
      weight: variant.weight,
      unit: variant.unitSymbol,
    });
  };

  return (
    <div
      className="bg-white rounded-4 h-100 overflow-hidden"
      style={{
        boxShadow: "0 12px 30px rgba(0,0,0,.06)",
        transition: "all .3s ease",
      }}>
      {/* IMAGE */}
      <div className="position-relative p-3">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images?.[0]}
            className="w-100 rounded-3"
            style={{ height: "240px", objectFit: "cover" }}
          />
        </Link>

        {/* Stock */}
        {variant.stock > 0 && (
          <span className="badge bg-success position-absolute top-0 start-0 m-3">
            In Stock
          </span>
        )}

        {/* Discount */}
        {discount > 0 && (
          <span className="badge bg-danger position-absolute bottom-0 start-0 m-3">
            -{discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3 shadow-sm">
          <i
            className={`bi ${
              isWishlisted ? "bi-heart-fill text-danger" : "bi-heart"
            }`}></i>
        </button>
      </div>

      {/* BODY */}
      <div className="p-4 pt-2">
        <div className="text-muted small">{product.category?.name}</div>

        <Link
          to={`/product/${product.id}`}
          className="fw-semibold d-block text-dark text-decoration-none">
          {product.name}
        </Link>

        {/* Rating */}
        <div className="text-warning small my-2">
          ★★★★☆ <span className="text-muted">(3.0)</span>
        </div>

        {/* Price */}
        <div className="d-flex align-items-center gap-2">
          <div className="fw-bold fs-5 text-primary">₹{price}</div>
          {compare > price && (
            <div className="text-muted text-decoration-line-through">
              ₹{compare}
            </div>
          )}
        </div>

        {/* Variant selector */}
        {product.variants?.length > 1 && (
          <select
            className="form-select form-select-sm mt-2"
            value={variant.id}
            onChange={(e) =>
              setVariant(
                product.variants.find(
                  (v: any) => v.id === Number(e.target.value)
                )
              )
            }>
            {product.variants.map((v: any) => (
              <option key={v.id} value={v.id}>
                {v.weight}
                {v.unitSymbol} – ₹{v.price}
              </option>
            ))}
          </select>
        )}

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          className="btn w-100 mt-3 fw-semibold"
          style={{
            background: "#f59e0b",
            color: "#fff",
            borderRadius: "12px",
          }}>
          <i className="bi bi-cart me-2"></i> Add to Cart
        </button>
      </div>
    </div>
  );
}
