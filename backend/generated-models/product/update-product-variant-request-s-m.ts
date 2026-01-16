import { ApiRequest } from '../../service-models/foundation/api-contracts/base/api-request';

/**
 * Update Product Variant Request DTO
 * reqData shape for PUT /api/admin/products/:productId/variants/:variantId
 */
export class UpdateProductVariantRequestSM extends ApiRequest<UpdateProductVariantRequestDataSM> {
  // reqData is inherited from ApiRequest<T>
}

export class UpdateProductVariantRequestDataSM {
  unitValueId?: number;
  quantity?: number;
  price?: number;
  comparePrice?: number;
  sku?: string;
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

