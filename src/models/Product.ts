import type { ProductVariant } from "./ProductVaraint";

export class Product {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  images: string[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  category?: { id: number; name: string };

  constructor(
    id: number,
    name: string,
    description: string,
    categoryId: number,
    images: string[],
    variants: ProductVariant[],
    rating: number = 0,
    reviewCount: number = 0,
    category?: { id: number; name: string }
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.categoryId = categoryId;
    this.images = images;
    this.variants = variants;
    this.rating = rating;
    this.reviewCount = reviewCount;
    this.category = category; // ✅ THIS WAS MISSING
  }

  get defaultVariant() {
    return this.variants.find((v) => v.isDefault) || this.variants[0];
  }

  get minPrice() {
    return Math.min(...this.variants.map((v) => v.price));
  }

  get hasReviews() {
    return this.reviewCount > 0;
  }

  get fullStars() {
    return Math.floor(this.rating);
  }

  get hasHalfStar() {
    return this.rating % 1 >= 0.5;
  }
}
