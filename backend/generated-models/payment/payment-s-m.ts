import { WildValleyFoodsServiceModelBase } from '../../service-models/app/base/WildValleyFoods-service-model-base';
import { PaymentStatusSM } from '../enums/payment-status-s-m.enum';
import { OrderSM } from '../order/order-s-m';
import { CustomerDetailSM } from '../../service-models/app/v1/customer-detail-s-m';

/**
 * Payment Service Model
 * Represents a payment record
 */
export class PaymentSM extends WildValleyFoodsServiceModelBase<number> {
  razorpayPaymentId!: string;
  razorpayOrderId!: string;
  orderId!: number;
  customerId!: number;
  amount!: number;
  amountPaise!: number;
  currency!: string;
  status!: PaymentStatusSM;
  method?: string;
  signature?: string;
  isAmountValid!: boolean;
  isProcessed!: boolean;
  processedAt?: Date;
  metadata?: any;
  
  // Relations
  order?: OrderSM;
  customer?: CustomerDetailSM;
}

