import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Address = {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
};

type CheckoutState = {
  savedAddresses: Address[];
  selectedAddress?: Address;
  saveAddress: (addr: Address) => void;
  selectAddress: (addr: Address) => void;
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      savedAddresses: [],
      selectedAddress: undefined,

      saveAddress: (addr) => {
        const existing = get().savedAddresses.find(
          (a) =>
            a.contact === addr.contact && a.addressLine1 === addr.addressLine1
        );

        if (!existing) {
          set({
            savedAddresses: [...get().savedAddresses, addr],
            selectedAddress: addr,
          });
        } else {
          set({ selectedAddress: existing });
        }
      },

      selectAddress: (addr) => set({ selectedAddress: addr }),
    }),
    { name: "checkout-addresses" }
  )
);
