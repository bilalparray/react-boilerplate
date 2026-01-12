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
  isBestSelling: boolean;
  category?: { id: number; name: string };

  constructor(
    id: number,
    name: string,
    description: string,
    categoryId: number,
    images: string[],
    variants: ProductVariant[],
    rating = 0,
    reviewCount = 0,
    isBestSelling = false,
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
    this.isBestSelling = isBestSelling;
    this.category = category;
  }
}
