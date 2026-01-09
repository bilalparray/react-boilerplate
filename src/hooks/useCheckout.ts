import { useState } from "react";
import { getRazorpayKey } from "../services/checkout.service";

export function useCheckout() {
  const [key, setKey] = useState<string | null>(null);

  async function loadKey() {
    if (key) return key;
    const k = await getRazorpayKey();
    setKey(k);
    return k;
  }

  return { loadKey };
}
