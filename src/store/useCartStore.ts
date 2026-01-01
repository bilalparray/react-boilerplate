import { create } from "zustand";
import { persist } from "zustand/middleware";

type Product = any;

type CartState = {
  cartItems: Product[];
  wishlistItems: Product[];

  cartCount: number;
  wishlistCount: number;

  addToCart: (product: Product) => void;
  addToWishlist: (product: Product) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      wishlistItems: [],

      cartCount: 0,
      wishlistCount: 0,

      addToCart: (product) => {
        const items = get().cartItems;

        const exists = items.find((p) => p.id === product.id);
        if (exists) return;

        const updated = [...items, product];

        set({
          cartItems: updated,
          cartCount: updated.length,
        });
      },

      addToWishlist: (product) => {
        const items = get().wishlistItems;

        const exists = items.find((p) => p.id === product.id);
        if (exists) return;

        const updated = [...items, product];

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
