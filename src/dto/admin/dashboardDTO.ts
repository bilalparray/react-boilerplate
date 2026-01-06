export interface DashboardResponseDTO {
  kpis: KPIsDTO;
  charts: ChartsDTO;
  widgets: WidgetsDTO;
  visitorCleanup: VisitorCleanupDTO;
  lastUpdated: string;
}

export interface KPIsDTO {
  totalSales: string;
  totalOrders: number;
  activeUsers: number;
  totalCustomers: number;
  returnRate: string;
  todaySales: string;
  todayOrders: number;
  thisMonthSales: string;
  thisMonthOrders: number;
  pendingOrders: number;
}

export interface ChartsDTO {
  monthlySales: {
    labels: string[];
    data: number[];
    orders: number[];
  };
  categorySales: {
    labels: string[];
    data: number[];
    percentages: string[];
    raw: {
      categoryId: number;
      categoryName: string;
      sales: number;
      quantity: number;
    }[];
  };
  dailyVisitors: {
    date: string;
    visitors: number;
    pageViews: number;
    avgTime: string;
  }[];
  dailyVisitorsNotification: {
    message: string;
    type: string;
    cleanupTime: string;
    retentionPeriod: string;
    exportAvailable: boolean;
    exportMessage: string;
  };
}

export interface WidgetsDTO {
  recentOrders: RecentOrderDTO[];
  topProducts: TopProductDTO[];
}

export interface RecentOrderDTO {
  id: number;
  orderNumber: string;
  amount: number;
  status: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
}

export interface TopProductDTO {
  productId: number;
  productName: string;
  sku: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface VisitorCleanupDTO {
  lastCleanupDate: string | null;
  totalLogs: number;
  oldestLogDate: string;
}
