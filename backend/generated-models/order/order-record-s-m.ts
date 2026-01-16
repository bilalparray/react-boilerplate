import { WildValleyFoodsServiceModelBase } from '../../service-models/app/base/WildValleyFoods-service-model-base';
import { ProductVariantSM } from '../product/product-variant-s-m';
import { ProductSM } from '../../service-models/app/v1/product-s-m';

/**
 * Order Record Service Model (Order Item)
 * Represents a single item in an order
 */
export class OrderRecordSM extends WildValleyFoodsServiceModelBase<number> {
  orderId!: number;
  productVariantId!: number;
  productId?: number; // Denormalized for reporting
  quantity!: number;
  price!: number;
  total!: number;
  
  // Relations
  variant?: ProductVariantSM;
  product?: ProductSM;
  variantDetails?: {
    name: string;
    sku: string;
    unitValue: string;
    unitSymbol: string;
  };
}

