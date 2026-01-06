export interface ReviewDTO {
  id: number;
  name: string;
  email: string;
  rating: number;
  comment: string;
  productId: number;
  createdOnUTC: string;
  isApproved: boolean | null;
}
