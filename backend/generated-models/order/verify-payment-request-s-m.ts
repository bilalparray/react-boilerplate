import { ApiRequest } from '../../service-models/foundation/api-contracts/base/api-request';

/**
 * Verify Payment Request DTO
 * reqData shape for POST /api/order/verify
 */
export class VerifyPaymentRequestSM extends ApiRequest<VerifyPaymentRequestDataSM> {
  // reqData is inherited from ApiRequest<T>
}

export class VerifyPaymentRequestDataSM {
  razorpay_order_id!: string;
  razorpay_payment_id!: string;
  razorpay_signature!: string;
}

