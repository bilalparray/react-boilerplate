import { WildValleyFoodsServiceModelBase } from '../../service-models/app/base/WildValleyFoods-service-model-base';
import { ProductSM } from '../../service-models/app/v1/product-s-m';
import { UnitValueSM } from './unit-value-s-m';

/**
 * Product Variant Service Model
 * Represents a product variant (size, weight, etc.)
 */
export class ProductVariantSM extends WildValleyFoodsServiceModelBase<number> {
  productId!: number;
  unitValueId!: number;
  quantity!: number;
  price!: number;
  comparePrice?: number;
  sku!: string;
  barcode?: string;
  gtin?: string;
  stock!: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  discount?: number;
  wholesalePrice?: number;
  wholesaleMinQuantity?: number;
  razorpayItemId?: string;
  isDefaultVariant!: boolean;
  isActive!: boolean;
  
  // Relations
  product?: ProductSM;
  unitValue?: UnitValueSM;
}

