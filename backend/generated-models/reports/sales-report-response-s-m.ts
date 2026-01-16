import { ApiResponse } from '../../service-models/foundation/api-contracts/base/api-response';
import { OrderSM } from '../order/order-s-m';

/**
 * Sales Report Response
 * Response shape for GET /api/reports/sales
 */
export class SalesReportResponseSM extends ApiResponse<SalesReportDataSM> {
  successData!: SalesReportDataSM;
}

export class SalesReportDataSM {
  dateRange!: {
    startDate: string;
    endDate: string;
  };
  summary!: {
    totalOrders: number;
    totalAmount: number;
    totalPaid: number;
  };
  pagination!: {
    total: number;
    skip: number;
    top: number;
  };
  data!: OrderSM[];
}

