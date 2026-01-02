// components/ProductView.tsx
import { useProduct } from "../hooks/useProduct";

export function ProductView({ productId }: { productId: number }) {
  const { product, loading } = useProduct(productId);

  if (loading) return <p>Loading...</p>;
  if (!product) return null;

  const v = product.defaultVariant;

  return (
    <div>
      <h2>{product.name}</h2>
      <img src={product.images[0]} width={300} />

      <p>{product.description}</p>

      <h3>₹{v.price}</h3>
      <p>{v.displayWeight}</p>

      {v.discountPercent > 0 && <p>{v.discountPercent}% OFF</p>}

      <p>{v.isInStock ? "In Stock" : "Out of Stock"}</p>
    </div>
  );
}
