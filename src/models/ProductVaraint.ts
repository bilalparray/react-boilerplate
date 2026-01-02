import type { Unit } from "./Unit";

export class ProductVariant {
  id: number;
  price: number;
  comparePrice: number;
  stock: number;
  weight: number;
  unit: Unit;
  isDefault: boolean;

  constructor(
    id: number,
    price: number,
    comparePrice: number,
    stock: number,
    weight: number,
    unit: Unit,
    isDefault: boolean
  ) {
    this.id = id;
    this.price = price;
    this.comparePrice = comparePrice;
    this.stock = stock;
    this.weight = weight;
    this.unit = unit;
    this.isDefault = isDefault;
  }

  get discountPercent() {
    if (!this.comparePrice) return 0;
    return Math.round(
      ((this.comparePrice - this.price) / this.comparePrice) * 100
    );
  }

  get isInStock() {
    return this.stock > 0;
  }

  get displayWeight() {
    return `${this.weight} ${this.unit.symbol}`;
  }
}
