import { environment } from "../environment";

export async function fetchProduct(productId: number) {
  const res = await fetch(`${environment.apiBaseUrl}/product/${productId}`);
  const json = await res.json();
  return json.successData;
}
