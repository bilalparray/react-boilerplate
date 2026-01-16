import { ApiResponse } from '../../service-models/foundation/api-contracts/base/api-response';
import { PaymentSM } from '../payment/payment-s-m';

/**
 * Payment Report Response
 * Response shape for GET /api/reports/payments
 */
export class PaymentReportResponseSM extends ApiResponse<PaymentReportDataSM> {
  successData!: PaymentReportDataSM;
}

export class PaymentReportDataSM {
  dateRange!: {
    startDate: string;
    endDate: string;
  };
  filters!: {
    status?: string;
  };
  summary!: {
    totalPayments: number;
    totalAmount: number;
    uniqueCustomers: number;
  };
  pagination!: {
    total: number;
    skip: number;
    top: number;
  };
  data!: PaymentSM[];
}

