import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  productId: number;
  name: string;
  image: string;
  variantId: number;
  price: number;
  comparePrice?: number;
  weight: number;
  unit: string;
  qty: number;
  stock: number;
  sku: string;
};

type CartState = {
  cartItems: CartItem[];
  wishlistItems: CartItem[];

  cartCount: number;
  wishlistCount: number;

  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number, variantId: number) => void;
  increaseQty: (productId: number, variantId: number) => void;
  decreaseQty: (productId: number, variantId: number) => void;

  addToWishlist: (item: CartItem) => void;
  removeFromWishlist: (productId: number, variantId: number) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      wishlistItems: [],
      cartCount: 0,
      wishlistCount: 0,

      addToCart: (item) => {
        const items = get().cartItems;

        const existing = items.find(
          (x) =>
            x.productId === item.productId && x.variantId === item.variantId
        );

        if (existing) {
          if (existing.qty < existing.stock) {
            existing.qty += 1;
          }
          return set({
            cartItems: [...items],
            cartCount: get().cartCount + 1,
          });
        }

        set({
          cartItems: [...items, { ...item, qty: 1 }],
          cartCount: get().cartCount + 1,
        });
      },

      increaseQty: (productId, variantId) => {
        const items = get().cartItems;
        const item = items.find(
          (x) => x.productId === productId && x.variantId === variantId
        );
        if (!item) return;

        if (item.qty < item.stock) {
          item.qty += 1;
          set({ cartItems: [...items], cartCount: get().cartCount + 1 });
        }
      },

      decreaseQty: (productId, variantId) => {
        const items = get().cartItems;
        const item = items.find(
          (x) => x.productId === productId && x.variantId === variantId
        );
        if (!item) return;

        if (item.qty > 1) {
          item.qty -= 1;
          set({ cartItems: [...items], cartCount: get().cartCount - 1 });
        }
      },

      removeFromCart: (productId, variantId) => {
        const items = get().cartItems;
        const item = items.find(
          (x) => x.productId === productId && x.variantId === variantId
        );
        if (!item) return;

        set({
          cartItems: items.filter(
            (x) => !(x.productId === productId && x.variantId === variantId)
          ),
          cartCount: get().cartCount - item.qty,
        });
      },

      addToWishlist: (item) => {
        const items = get().wishlistItems;

        const exists = items.find(
          (x) =>
            x.productId === item.productId && x.variantId === item.variantId
        );
        if (exists) return;

        set({
          wishlistItems: [...items, item],
          wishlistCount: get().wishlistCount + 1,
        });
      },

      removeFromWishlist: (productId, variantId) => {
        const items = get().wishlistItems;
        const updated = items.filter(
          (x) => !(x.productId === productId && x.variantId === variantId)
        );

        set({
          wishlistItems: updated,
          wishlistCount: updated.length,
        });
      },
    }),
    {
      name: "alpine-cart-storage",
    }
  )
);
