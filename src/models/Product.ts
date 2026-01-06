import type { ProductVariant } from "./ProductVaraint";

export class Product {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  images: string[];
  variants: ProductVariant[];
  rating: number; // e.g. 3.7
  reviewCount: number; // e.g. 124

  constructor(
    id: number,
    name: string,
    description: string,
    categoryId: number,
    images: string[],
    variants: ProductVariant[],
    rating = 0,
    reviewCount = 0
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.images = images;
    this.variants = variants;
    this.categoryId = categoryId;
    this.rating = rating;
    this.reviewCount = reviewCount;
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
