import type { ProductVariant } from "./ProductVaraint";

export class Product {
  id: number;
  name: string;
  description: string;
  images: string[];
  variants: ProductVariant[];

  constructor(
    id: number,
    name: string,
    description: string,
    images: string[],
    variants: ProductVariant[]
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.images = images;
    this.variants = variants;
  }

  get defaultVariant() {
    return this.variants.find((v) => v.isDefault) || this.variants[0];
  }

  get minPrice() {
    return Math.min(...this.variants.map((v) => v.price));
  }
}
