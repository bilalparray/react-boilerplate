import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartState = {
  cartCount: number;
  wishlistCount: number;
  addToCart: () => void;
  addToWishlist: () => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartCount: 0,
      wishlistCount: 0,

      addToCart: () => set((state) => ({ cartCount: state.cartCount + 1 })),

      addToWishlist: () =>
        set((state) => ({ wishlistCount: state.wishlistCount + 1 })),

      clear: () => set({ cartCount: 0, wishlistCount: 0 }),
    }),
    {
      name: "alpine-cart", // localStorage key
    }
  )
);
