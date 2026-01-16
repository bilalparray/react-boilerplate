import { ApiRequest } from '../../service-models/foundation/api-contracts/base/api-request';

/**
 * Create Order Request DTO
 * reqData shape for POST /api/order
 */
export class CreateOrderRequestSM extends ApiRequest<CreateOrderRequestDataSM> {
  // reqData is inherited from ApiRequest<T>
}

export class CreateOrderRequestDataSM {
  customerId!: number;
  items!: OrderItemRequestSM[];
}

export class OrderItemRequestSM {
  productVariantId!: number;
  quantity!: number;
}

