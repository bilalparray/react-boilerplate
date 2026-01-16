import { Order, OrderRecord, ProductVariant, Product, Payment, CustomerDetail } from "../../db/dbconnection.js";
import { sendSuccess, sendError } from "../../Helper/response.helper.js";
import { Op } from "sequelize";
import { Sequelize } from "sequelize";

/**
 * Sales Report by Date Range
 * GET /api/reports/sales?startDate=2024-01-01&endDate=2024-01-31&skip=0&top=10
 */
export const getSalesByDateRange = async (req, res) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: last 30 days
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
    const skip = parseInt(req.query.skip, 10) || 0;
    const top = parseInt(req.query.top, 10) || 50;

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return sendError(res, "Invalid date format. Use YYYY-MM-DD", 400);
    }

    if (startDate > endDate) {
      return sendError(res, "startDate must be before endDate", 400);
    }

    // Aggregate query - efficient, no full table load
    const { count: total, rows: orders } = await Order.findAndCountAll({
      where: {
        status: "paid",
        createdOnUTC: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        "id",
        "razorpayOrderId",
        "amount",
        "paid_amount",
        "currency",
        "status",
        "createdOnUTC"
      ],
      include: [
        {
          model: CustomerDetail,
          as: "customer",
          attributes: ["id", "firstName", "lastName", "email"]
        }
      ],
      offset: skip,
      limit: top,
      order: [["createdOnUTC", "DESC"]]
    });

    // Calculate totals using aggregate (efficient)
    const totals = await Order.findAll({
      where: {
        status: "paid",
        createdOnUTC: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("id")), "totalOrders"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "totalAmount"],
        [Sequelize.fn("SUM", Sequelize.col("paid_amount")), "totalPaid"]
      ],
      raw: true
    });

    const summary = totals[0] || { totalOrders: 0, totalAmount: 0, totalPaid: 0 };

    return sendSuccess(res, {
      dateRange: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      },
      summary: {
        totalOrders: parseInt(summary.totalOrders) || 0,
        totalAmount: parseFloat(summary.totalAmount) || 0,
        totalPaid: parseFloat(summary.totalPaid) || 0
      },
      pagination: {
        total,
        skip,
        top
      },
      data: orders
    });

  } catch (err) {
    console.error("❌ GET SALES BY DATE RANGE ERROR:", err);
    return sendError(res, err.message);
  }
};

/**
 * Daily Sales Totals
 * GET /api/reports/daily?startDate=2024-01-01&endDate=2024-01-31
 */
export const getDailySalesTotals = async (req, res) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return sendError(res, "Invalid date format. Use YYYY-MM-DD", 400);
    }

    // Group by date using SQL DATE function (efficient)
    const dailyTotals = await Order.findAll({
      where: {
        status: "paid",
        createdOnUTC: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("createdOnUTC")), "date"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "orderCount"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "totalAmount"],
        [Sequelize.fn("SUM", Sequelize.col("paid_amount")), "totalPaid"]
      ],
      group: [Sequelize.fn("DATE", Sequelize.col("createdOnUTC"))],
      order: [[Sequelize.fn("DATE", Sequelize.col("createdOnUTC")), "DESC"]],
      raw: true
    });

    // Format results
    const formatted = dailyTotals.map(row => ({
      date: row.date,
      orderCount: parseInt(row.orderCount) || 0,
      totalAmount: parseFloat(row.totalAmount) || 0,
      totalPaid: parseFloat(row.totalPaid) || 0
    }));

    return sendSuccess(res, {
      dateRange: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      },
      data: formatted
    });

  } catch (err) {
    console.error("❌ GET DAILY SALES TOTALS ERROR:", err);
    return sendError(res, err.message);
  }
};

/**
 * Product/Variant Level Sales Report
 * GET /api/reports/product-sales?productId=1&variantId=2&startDate=2024-01-01&endDate=2024-01-31&skip=0&top=10
 */
export const getProductSales = async (req, res) => {
  try {
    const productId = req.query.productId ? parseInt(req.query.productId, 10) : null;
    const variantId = req.query.variantId ? parseInt(req.query.variantId, 10) : null;
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
    const skip = parseInt(req.query.skip, 10) || 0;
    const top = parseInt(req.query.top, 10) || 50;

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return sendError(res, "Invalid date format. Use YYYY-MM-DD", 400);
    }

    // Build where clause for order records
    const orderRecordWhere = {};
    if (productId) {
      orderRecordWhere.productId = productId;
    }
    if (variantId) {
      orderRecordWhere.productVariantId = variantId;
    }

    // Get order IDs from paid orders in date range
    const paidOrders = await Order.findAll({
      where: {
        status: "paid",
        createdOnUTC: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: ["id"],
      raw: true
    });

    const orderIds = paidOrders.map(o => o.id);

    if (orderIds.length === 0) {
      return sendSuccess(res, {
        summary: {
          totalQuantity: 0,
          totalRevenue: 0,
          uniqueProducts: 0,
          uniqueVariants: 0
        },
        pagination: { total: 0, skip, top },
        data: []
      });
    }

    // Aggregate order records with product/variant info
    const { count: total, rows: orderRecords } = await OrderRecord.findAndCountAll({
      where: {
        orderId: { [Op.in]: orderIds },
        ...orderRecordWhere
      },
      attributes: [
        "productVariantId",
        "productId",
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "totalQuantity"],
        [Sequelize.fn("SUM", Sequelize.col("total")), "totalRevenue"],
        [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("orderId"))), "orderCount"]
      ],
      include: [
        {
          model: ProductVariant,
          as: "variant",
          attributes: ["id", "sku", "price"],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name"]
            }
          ],
          required: true
        }
      ],
      group: ["productVariantId", "productId", "variant.id", "variant->product.id"],
      offset: skip,
      limit: top,
      raw: false,
      subQuery: false
    });

    // Calculate summary totals (separate efficient query)
    const summaryData = await OrderRecord.findAll({
      where: {
        orderId: { [Op.in]: orderIds },
        ...orderRecordWhere
      },
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "totalQuantity"],
        [Sequelize.fn("SUM", Sequelize.col("total")), "totalRevenue"],
        [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("productId"))), "uniqueProducts"],
        [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("productVariantId"))), "uniqueVariants"]
      ],
      raw: true
    });

    const summary = summaryData[0] || {
      totalQuantity: 0,
      totalRevenue: 0,
      uniqueProducts: 0,
      uniqueVariants: 0
    };

    // Format results
    const formatted = orderRecords.map(record => ({
      productVariantId: record.productVariantId,
      productId: record.productId,
      variant: record.variant ? {
        id: record.variant.id,
        sku: record.variant.sku,
        price: record.variant.price,
        product: record.variant.product ? {
          id: record.variant.product.id,
          name: record.variant.product.name
        } : null
      } : null,
      totalQuantity: parseInt(record.dataValues.totalQuantity) || 0,
      totalRevenue: parseFloat(record.dataValues.totalRevenue) || 0,
      orderCount: parseInt(record.dataValues.orderCount) || 0
    }));

    return sendSuccess(res, {
      dateRange: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      },
      filters: {
        productId: productId || null,
        variantId: variantId || null
      },
      summary: {
        totalQuantity: parseInt(summary.totalQuantity) || 0,
        totalRevenue: parseFloat(summary.totalRevenue) || 0,
        uniqueProducts: parseInt(summary.uniqueProducts) || 0,
        uniqueVariants: parseInt(summary.uniqueVariants) || 0
      },
      pagination: {
        total,
        skip,
        top
      },
      data: formatted
    });

  } catch (err) {
    console.error("❌ GET PRODUCT SALES ERROR:", err);
    return sendError(res, err.message);
  }
};

/**
 * Payment Status Report
 * GET /api/reports/payments?status=captured&startDate=2024-01-01&endDate=2024-01-31&skip=0&top=10
 */
export const getPaymentReport = async (req, res) => {
  try {
    const status = req.query.status; // captured, failed, authorized, etc.
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
    const skip = parseInt(req.query.skip, 10) || 0;
    const top = parseInt(req.query.top, 10) || 50;

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return sendError(res, "Invalid date format. Use YYYY-MM-DD", 400);
    }

    const where = {
      createdOnUTC: {
        [Op.between]: [startDate, endDate]
      }
    };

    if (status) {
      where.status = status;
    }

    const { count: total, rows: payments } = await Payment.findAndCountAll({
      where,
      include: [
        {
          model: Order,
          as: "order",
          attributes: ["id", "razorpayOrderId", "amount", "status"]
        },
        {
          model: CustomerDetail,
          as: "customer",
          attributes: ["id", "firstName", "lastName", "email"]
        }
      ],
      offset: skip,
      limit: top,
      order: [["createdOnUTC", "DESC"]]
    });

    // Summary totals
    const summaryData = await Payment.findAll({
      where,
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("id")), "totalPayments"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "totalAmount"],
        [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("customerId"))), "uniqueCustomers"]
      ],
      raw: true
    });

    const summary = summaryData[0] || {
      totalPayments: 0,
      totalAmount: 0,
      uniqueCustomers: 0
    };

    return sendSuccess(res, {
      dateRange: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      },
      filters: {
        status: status || "all"
      },
      summary: {
        totalPayments: parseInt(summary.totalPayments) || 0,
        totalAmount: parseFloat(summary.totalAmount) || 0,
        uniqueCustomers: parseInt(summary.uniqueCustomers) || 0
      },
      pagination: {
        total,
        skip,
        top
      },
      data: payments
    });

  } catch (err) {
    console.error("❌ GET PAYMENT REPORT ERROR:", err);
    return sendError(res, err.message);
  }
};

