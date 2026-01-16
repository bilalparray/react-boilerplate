import { ApiResponse } from '../../service-models/foundation/api-contracts/base/api-response';

/**
 * Product Sales Report Response
 * Response shape for GET /api/reports/product-sales
 */
export class ProductSalesReportResponseSM extends ApiResponse<ProductSalesReportDataSM> {
  successData!: ProductSalesReportDataSM;
}

export class ProductSalesReportDataSM {
  dateRange!: {
    startDate: string;
    endDate: string;
  };
  filters!: {
    productId?: number;
    variantId?: number;
  };
  summary!: {
    totalQuantity: number;
    totalRevenue: number;
    uniqueProducts: number;
    uniqueVariants: number;
  };
  pagination!: {
    total: number;
    skip: number;
    top: number;
  };
  data!: ProductSalesItemSM[];
}

export class ProductSalesItemSM {
  productVariantId!: number;
  productId!: number;
  variant?: {
    id: number;
    sku: string;
    price: number;
    product?: {
      id: number;
      name: string;
    };
  };
  totalQuantity!: number;
  totalRevenue!: number;
  orderCount!: number;
}

