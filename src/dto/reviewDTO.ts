export interface ReviewDTO {
  id: number;
  name: string;
  email: string;
  rating: number; // 1–5
  comment: string;
  productId: number;
  createdOnUTC: string;
}
