import { WildValleyFoodsServiceModelBase } from '../../service-models/app/base/WildValleyFoods-service-model-base';
import { WebhookLogStatusSM } from '../enums/webhook-log-status-s-m.enum';

/**
 * Webhook Log Service Model
 * Represents a webhook event log entry
 */
export class WebhookLogSM extends WildValleyFoodsServiceModelBase<number> {
  event!: string;
  rawBody!: string;
  headers?: any;
  receivedSignature?: string;
  computedSignature?: string;
  isSignatureValid!: boolean;
  status!: WebhookLogStatusSM;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  errorMessage?: string;
  processingTimeMs?: number;
}

