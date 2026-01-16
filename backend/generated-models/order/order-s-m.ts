import { WildValleyFoodsServiceModelBase } from '../../service-models/app/base/WildValleyFoods-service-model-base';
import { OrderRecordSM } from './order-record-s-m';
import { CustomerDetailSM } from '../../service-models/app/v1/customer-detail-s-m';
import { OrderStatusSM } from '../enums/order-status-s-m.enum';

/**
 * Order Service Model
 * Represents an order in the system
 */
export class OrderSM extends WildValleyFoodsServiceModelBase<number> {
  razorpayOrderId!: string;
  customerId!: number;
  amount!: number;
  paid_amount!: number;
  due_amount!: number;
  currency!: string;
  status!: OrderStatusSM;
  paymentId?: string;
  signature?: string;
  receipt?: string;
  
  // Relations
  items?: OrderRecordSM[];
  customer?: CustomerDetailSM;
  customerDetails?: {
    name: string;
    email: string;
    contact: string;
  };
  
  // Payment link (from create order response)
  paymentLink?: {
    id: string;
    short_url: string;
    amount: number;
    currency: string;
    status: string;
    expire_by?: number;
    created_at?: number;
  };
  
  // Razorpay order data (from create order response)
  razorpayOrder?: any;
}

