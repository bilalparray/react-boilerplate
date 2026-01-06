import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import type { Product } from "../../models/Product";
import type { ProductVariant } from "../../models/ProductVaraint";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const { addToCart, addToWishlist, wishlistItems } = useCartStore();

  const defaultVariant =
    product.variants.find((v) => v.isDefault) || product.variants[0];

  const [variant, setVariant] = useState<ProductVariant>(defaultVariant);

  useEffect(() => {
    setVariant(defaultVariant);
  }, [product]);

  const price = variant.price;
  const compare = variant.comparePrice;
  const discount =
    compare > price ? Math.round(((compare - price) / compare) * 100) : 0;

  const isWishlisted = wishlistItems.some(
    (x) => x.productId === product.id && x.variantId === variant.id
  );

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      image: product.images?.[0],
      price: variant.price,
      comparePrice: variant.comparePrice,
      weight: variant.weight,
      unit: variant.unit.symbol,
      stock: variant.stock,
    });
  };

  const handleWishlist = () => {
    addToWishlist({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      image: product.images?.[0],
      price: variant.price,
      comparePrice: variant.comparePrice,
      weight: variant.weight,
      unit: variant.unit.symbol,
      stock: variant.stock,
    });
  };

  return (
    <div className="bg-white rounded-4 overflow-hidden product-card h-100 w-100 d-flex flex-column">
      {/* IMAGE */}
      <div className="position-relative p-3">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images?.[0]}
            className="product-image rounded-3"
            alt={product.name}
          />
        </Link>

        {variant.isInStock && (
          <span className="badge bg-success position-absolute top-0 start-0 m-3">
            In Stock
          </span>
        )}

        {discount > 0 && (
          <span className="badge bg-danger position-absolute bottom-0 start-0 m-3">
            -{discount}%
          </span>
        )}

        <button
          onClick={handleWishlist}
          className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3 wishlist-btn">
          <i
            className={`bi ${
              isWishlisted ? "bi-heart-fill text-danger" : "bi-heart"
            }`}></i>
        </button>
      </div>

      {/* BODY */}
      <div className="p-4 pt-2 d-flex flex-column flex-grow-1">
        <div className="flex-grow-1">
          <div className="text-muted small">{product.categoryId}</div>

          <Link
            to={`/product/${product.id}`}
            className="fw-semibold d-block text-dark text-decoration-none product-title">
            {product.name}
          </Link>

          <div className="text-warning small my-2">
            ★★★★☆ <span className="text-muted">(3.0)</span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <div className="fw-bold fs-5 text-primary">₹{price}</div>
            {compare > price && (
              <div className="text-muted text-decoration-line-through">
                ₹{compare}
              </div>
            )}
          </div>

          {product.variants.length > 1 && (
            <select
              className="form-select form-select-sm mt-2"
              value={variant.id}
              onChange={(e) =>
                setVariant(
                  product.variants.find((v) => v.id === Number(e.target.value))!
                )
              }>
              {product.variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.displayWeight} – ₹{v.price}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!variant.isInStock}
          className="btn w-100 mt-3 fw-semibold add-cart-btn">
          <i className="bi bi-cart me-2"></i>
          {variant.isInStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
