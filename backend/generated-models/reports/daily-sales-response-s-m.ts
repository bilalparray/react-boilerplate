import { ApiResponse } from '../../service-models/foundation/api-contracts/base/api-response';

/**
 * Daily Sales Report Response
 * Response shape for GET /api/reports/daily
 */
export class DailySalesReportResponseSM extends ApiResponse<DailySalesReportDataSM> {
  successData!: DailySalesReportDataSM;
}

export class DailySalesReportDataSM {
  dateRange!: {
    startDate: string;
    endDate: string;
  };
  data!: DailySalesItemSM[];
}

export class DailySalesItemSM {
  date!: string;
  orderCount!: number;
  totalAmount!: number;
  totalPaid!: number;
}

