/**
 * Order Status Enum
 * Status values for orders
 */
export enum OrderStatusSM {
  Created = 'created',
  Paid = 'paid',
  Failed = 'failed',
  Flagged = 'flagged',
  Refunded = 'refunded',
  PartiallyRefunded = 'partially_refunded'
}

