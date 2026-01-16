import { Order, OrderRecord, ProductVariant, Product, Payment, CustomerDetail, categories as Category, VisitorLog } from "../../db/dbconnection.js";
import { sendSuccess, sendError } from "../../Helper/response.helper.js";
import { Op, Sequelize, fn, col } from "sequelize";
import { getDailyVisitors } from "../../middlewares/visitorTracker.middleware.js";

/**
 * Get Admin Dashboard Data
 * GET /api/dashboard
 * Returns comprehensive dashboard data including KPIs, charts, and widgets
 */
export const getDashboardData = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // ===============================
    // DEFAULT VALUES
    // ===============================
    let totalSales = 0;
    let totalOrders = 0;
    let activeUsers = 0;
    let returnRate = "0.00";
    let todaySales = 0;
    let todayOrders = 0;
    let thisMonthSales = 0;
    let thisMonthOrders = 0;
    let pendingOrders = 0;

    let last6Months = [];
    let categorySalesData = [];
    let recentOrdersData = [];
    let topProductsData = [];

    // ===============================
    // KPI CARDS
    // ===============================
    const [salesRes] = await Order.findAll({
      where: { status: "paid" },
      attributes: [[fn("SUM", col("Order.amount")), "total"]],
      raw: true
    });
    totalSales = parseFloat(salesRes?.total || 0);

    const [ordersRes] = await Order.findAll({
      attributes: [[fn("COUNT", col("Order.id")), "count"]],
      raw: true
    });
    totalOrders = parseInt(ordersRes?.count || 0);

    const [usersRes] = await Order.findAll({
      attributes: [[fn("COUNT", fn("DISTINCT", col("Order.customerId"))), "users"]],
      raw: true
    });
    activeUsers = parseInt(usersRes?.users || 0);

    // Total Customers
    const [totalCustomersRes] = await CustomerDetail.findAll({
      attributes: [[fn("COUNT", col("CustomerDetail.id")), "total"]],
      raw: true
    });
    const totalCustomers = parseInt(totalCustomersRes?.total || 0);

    const [refundRes] = await Order.findAll({
      where: { status: { [Op.in]: ["refunded", "partially_refunded"] } },
      attributes: [[fn("COUNT", col("Order.id")), "count"]],
      raw: true
    });

    const refundedCount = parseInt(refundRes?.count || 0);
    returnRate = totalOrders > 0
      ? ((refundedCount / totalOrders) * 100).toFixed(2)
      : "0.00";

    // ===============================
    // MONTHLY SALES (LAST 6 MONTHS)
    // ===============================
    const monthlySales = await Order.findAll({
      where: {
        status: "paid",
        createdOnUTC: { [Op.gte]: sixMonthsAgo }
      },
      attributes: [
        [Sequelize.literal(`DATE_TRUNC('month',"createdOnUTC")`), "month"],
        [fn("SUM", col("Order.amount")), "sales"],
        [fn("COUNT", col("Order.id")), "orders"]
      ],
      group: [Sequelize.literal(`DATE_TRUNC('month',"createdOnUTC")`)],
      order: [[Sequelize.literal(`DATE_TRUNC('month',"createdOnUTC")`), "ASC"]],
      raw: true
    });

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    last6Months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const found = monthlySales.find(
        m => new Date(m.month).getMonth() === d.getMonth()
      );
      return {
        month: monthNames[d.getMonth()],
        sales: parseFloat(found?.sales || 0),
        orders: parseInt(found?.orders || 0)
      };
    });

    // ===============================
    // CATEGORY SALES
    // ===============================
    const categorySales = await OrderRecord.findAll({
      include: [
        { model: Order, as: "order", where: { status: "paid" }, attributes: [] },
        {
          model: ProductVariant,
          as: "variant",
          attributes: [],
          include: [{
            model: Product,
            as: "product",
            attributes: [],
            include: [{ model: Category, as: "category", attributes: [] }]
          }]
        }
      ],
      attributes: [
        [col("variant->product->category.id"), "categoryId"],
        [col("variant->product->category.name"), "categoryName"],
        [fn("SUM", col("OrderRecord.total")), "sales"],
        [fn("SUM", col("OrderRecord.quantity")), "quantity"]
      ],
      group: [
        col("variant->product->category.id"),
        col("variant->product->category.name")
      ],
      raw: true
    });

    categorySalesData = categorySales.map(c => ({
      categoryId: c.categoryId,
      categoryName: c.categoryName || "Uncategorized",
      sales: parseFloat(c.sales || 0),
      quantity: parseInt(c.quantity || 0)
    }));

    const totalCategorySales = categorySalesData.reduce((a, b) => a + b.sales, 0);

    // ===============================
    // RECENT ORDERS
    // ===============================
    const recentOrders = await Order.findAll({
      include: [{
        model: CustomerDetail,
        as: "customer",
        attributes: ["firstName", "lastName", "email"]
      }],
      order: [["createdOnUTC", "DESC"]],
      limit: 10
    });

    recentOrdersData = recentOrders.map(o => ({
      id: o.id,
      orderNumber: o.razorpayOrderId || `ORD-${o.id}`,
      amount: parseFloat(o.amount),
      status: o.status,
      customerName: o.customer
        ? `${o.customer.firstName} ${o.customer.lastName}`.trim()
        : "Unknown",
      customerEmail: o.customer?.email || "",
      createdAt: o.createdOnUTC
    }));

    // ===============================
    // TOP PRODUCTS (FIXED AMBIGUOUS QUANTITY)
    // ===============================
    const topProducts = await OrderRecord.findAll({
      include: [
        { model: Order, as: "order", where: { status: "paid" }, attributes: [] },
        {
          model: ProductVariant,
          as: "variant",
          attributes: ["sku"],
          include: [{ model: Product, as: "product", attributes: ["name"] }]
        }
      ],
      attributes: [
        [col("variant->product.id"), "productId"],
        [col("variant->product.name"), "productName"],
        [col("variant.sku"), "sku"],
        [fn("SUM", col("OrderRecord.quantity")), "totalQuantity"],
        [fn("SUM", col("OrderRecord.total")), "revenue"]
      ],
      group: [
        col("variant->product.id"),
        col("variant->product.name"),
        col("variant.sku")
      ],
      order: [[fn("SUM", col("OrderRecord.quantity")), "DESC"]],
      limit: 10,
      raw: true
    });

    topProductsData = topProducts.map(p => ({
      productId: p.productId,
      productName: p.productName,
      sku: p.sku,
      totalQuantity: parseInt(p.totalQuantity),
      totalRevenue: parseFloat(p.revenue)
    }));

    // ===============================
    // TODAY + MONTH KPIs
    // ===============================
    const [todayRes] = await Order.findAll({
      where: { status: "paid", createdOnUTC: { [Op.gte]: today } },
      attributes: [
        [fn("SUM", col("Order.amount")), "sales"],
        [fn("COUNT", col("Order.id")), "orders"]
      ],
      raw: true
    });

    todaySales = parseFloat(todayRes?.sales || 0);
    todayOrders = parseInt(todayRes?.orders || 0);

    const [monthRes] = await Order.findAll({
      where: { status: "paid", createdOnUTC: { [Op.gte]: thisMonthStart } },
      attributes: [
        [fn("SUM", col("Order.amount")), "sales"],
        [fn("COUNT", col("Order.id")), "orders"]
      ],
      raw: true
    });

    thisMonthSales = parseFloat(monthRes?.sales || 0);
    thisMonthOrders = parseInt(monthRes?.orders || 0);

    // ===============================
    // DAILY VISITORS (Last 30 days)
    // ===============================
    let dailyVisitorsData = [];
    let cleanupStatus = null;
    try {
      if (VisitorLog) {
        dailyVisitorsData = await getDailyVisitors(30);
        
        // Get cleanup status
        const { getCleanupStatus } = await import("../../jobs/visitorLogCleanup.job.js");
        cleanupStatus = await getCleanupStatus();
        
        // Get oldest log date (last log date before cleanup)
        const oldestLog = await VisitorLog.findOne({
          order: [['visitedAt', 'ASC']],
          attributes: ['visitedAt'],
          raw: true,
        });
        
        if (oldestLog?.visitedAt) {
          cleanupStatus.oldestLogDate = new Date(oldestLog.visitedAt).toISOString();
        }
      }
    } catch (visitorErr) {
      console.warn("⚠️ Could not fetch visitor data:", visitorErr.message);
      // Continue without visitor data - don't break dashboard
      dailyVisitorsData = [];
    }

    // ===============================
    // RESPONSE
    // ===============================
    return sendSuccess(res, {
      kpis: {
        totalSales: totalSales.toFixed(2),
        totalOrders,
        activeUsers,
        totalCustomers,
        returnRate: `${returnRate}%`,
        todaySales: todaySales.toFixed(2),
        todayOrders,
        thisMonthSales: thisMonthSales.toFixed(2),
        thisMonthOrders,
        pendingOrders
      },
      charts: {
        monthlySales: {
          labels: last6Months.map(m => m.month),
          data: last6Months.map(m => m.sales),
          orders: last6Months.map(m => m.orders)
        },
        categorySales: {
          labels: categorySalesData.map(c => c.categoryName),
          data: categorySalesData.map(c => c.sales),
          percentages: categorySalesData.map(c =>
            totalCategorySales > 0
              ? ((c.sales / totalCategorySales) * 100).toFixed(1)
              : "0"
          ),
          raw: categorySalesData
        },
        dailyVisitors: dailyVisitorsData,
        dailyVisitorsNotification: {
          message: "⚠️ Visitor data is automatically deleted after 24 hours (IST) to prevent database bloat.",
          type: "warning",
          cleanupTime: "2:00 AM IST daily",
          retentionPeriod: "24 hours",
          exportAvailable: true,
          exportMessage: "Export data before cleanup using the export button in dashboard."
        }
      },
      widgets: {
        recentOrders: recentOrdersData,
        topProducts: topProductsData
      },
      visitorCleanup: cleanupStatus || {
        lastCleanupDate: null,
        totalLogs: 0,
        oldestLogDate: null,
        nextCleanupTime: null,
      },
      lastUpdated: new Date().toISOString()
    });

  } catch (err) {
    console.error("❌ DASHBOARD ERROR:", err);
    return sendError(res, err.message || "Dashboard failed", 500, 4);
  }
};


