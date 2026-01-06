export interface CartItem {
  productId: number;
  variantId: number;

  name: string;
  image: string;

  price: number;
  comparePrice: number;

  weight: number;
  unit: string;

  stock: number;
  qty: number;
}
