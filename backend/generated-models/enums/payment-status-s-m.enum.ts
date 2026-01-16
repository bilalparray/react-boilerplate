/**
 * Payment Status Enum
 * Status values for payments
 */
export enum PaymentStatusSM {
  Created = 'created',
  Authorized = 'authorized',
  Captured = 'captured',
  Failed = 'failed',
  Refunded = 'refunded',
  PartiallyRefunded = 'partially_refunded'
}

