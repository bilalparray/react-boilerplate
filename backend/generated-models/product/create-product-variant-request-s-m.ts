import { ApiRequest } from '../../service-models/foundation/api-contracts/base/api-request';

/**
 * Create Product Variant Request DTO
 * reqData shape for POST /api/admin/products/:productId/variants
 */
export class CreateProductVariantRequestSM extends ApiRequest<CreateProductVariantRequestDataSM> {
  // reqData is inherited from ApiRequest<T>
}

export class CreateProductVariantRequestDataSM {
  unitValueId!: number;
  quantity!: number;
  price!: number;
  comparePrice?: number;
  sku!: string;
  barcode?: string;
  gtin?: string;
  stock?: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  discount?: number;
  wholesalePrice?: number;
  wholesaleMinQuantity?: number;
  isDefaultVariant?: boolean;
  isActive?: boolean;
}

