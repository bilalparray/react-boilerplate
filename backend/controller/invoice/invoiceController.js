import { Order, OrderRecord, CustomerDetail, CustomerAddressDetail, ProductVariant, Product, UnitValue, Payment } from "../../db/dbconnection.js";
import { sendSuccess, sendError } from "../../Helper/response.helper.js";
import { Op } from "sequelize";

/**
 * Get Invoice by Order ID
 * GET /api/invoice/order/:orderId
 * Returns complete invoice data for an order
 */
export const getInvoiceByOrderId = async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);

    if (!orderId || isNaN(orderId)) {
      return sendError(res, "Invalid order ID", 400);
    }

    // Fetch order with all related data
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: CustomerDetail,
          as: "customer",
          include: [
            {
              model: CustomerAddressDetail,
              as: "addresses",
              where: { addressType: "Home" },
              required: false
            }
          ]
        },
        {
          model: OrderRecord,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "description"]
            },
            {
              model: ProductVariant,
              as: "variant",
              include: [
                {
                  model: Product,
                  as: "product",
                  attributes: ["id", "name", "description"]
                },
                {
                  model: UnitValue,
                  as: "unitValue",
                  attributes: ["id", "name", "symbol"]
                }
              ]
            }
          ]
        },
        {
          model: Payment,
          as: "payments",
          where: { isProcessed: true },
          required: false,
          limit: 1,
          order: [["createdOnUTC", "DESC"]]
        }
      ]
    });

    if (!order) {
      return sendError(res, "Order not found", 404);
    }

    // Calculate invoice totals
    const items = order.items || [];
    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
    const taxAmount = 0; // Add tax calculation if needed
    const shippingAmount = 0; // Add shipping if needed
    const totalAmount = parseFloat(order.amount || 0);
    const paidAmount = parseFloat(order.paid_amount || 0);
    const dueAmount = parseFloat(order.due_amount || 0);

    // Format invoice data
    const invoice = {
      invoiceNumber: `INV-${order.id}-${order.razorpayOrderId || ""}`,
      orderNumber: order.razorpayOrderId || `ORD-${order.id}`,
      invoiceDate: order.createdOnUTC,
      dueDate: order.createdOnUTC, // Can be calculated based on payment terms
      
      // Customer Information
      customer: order.customer ? {
        id: order.customer.id,
        name: `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim(),
        email: order.customer.email,
        contact: order.customer.contact,
        address: order.customer.addresses && order.customer.addresses.length > 0 
          ? order.customer.addresses[0] 
          : null
      } : null,

      // Order Items - transform to include unitSymbol from unitValue
      items: items.map(item => {
        // Ensure variant has unitSymbol from unitValue if not already set
        if (item.variant && item.variant.unitValue && !item.variant.unitSymbol) {
          item.variant.unitSymbol = item.variant.unitValue.symbol || item.variant.unitValue.name || '';
          item.variant.unitName = item.variant.unitValue.name || '';
        }
        
        return {
          id: item.id,
          productName: item.product?.name || item.variant?.product?.name || "Unknown Product",
          variantSku: item.variant?.sku || "",
          variantDetails: item.variant ? {
            quantity: item.variant.quantity,
            unitSymbol: item.variant.unitSymbol || item.variant.unitValue?.symbol || "",
            unitName: item.variant.unitName || item.variant.unitValue?.name || ""
          } : null,
          quantity: item.quantity,
          unitPrice: parseFloat(item.price || 0),
          total: parseFloat(item.total || 0)
        };
      }),

      // Totals
      totals: {
        subtotal: subtotal.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        shippingAmount: shippingAmount.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        paidAmount: paidAmount.toFixed(2),
        dueAmount: dueAmount.toFixed(2)
      },

      // Payment Information
      payment: order.payments && order.payments.length > 0 ? {
        razorpayPaymentId: order.payments[0].razorpayPaymentId,
        status: order.payments[0].status,
        method: order.payments[0].method,
        paidAt: order.payments[0].processedAt || order.payments[0].createdOnUTC
      } : null,

      // Order Status
      status: order.status,
      currency: order.currency || "INR",
      
      // Metadata
      orderId: order.id,
      razorpayOrderId: order.razorpayOrderId,
      receipt: order.receipt
    };

    return sendSuccess(res, invoice);

  } catch (err) {
    console.error("❌ GET INVOICE BY ORDER ID ERROR:", err);
    return sendError(res, err.message || "Failed to fetch invoice", 500);
  }
};

/**
 * Get All Invoices (Paginated)
 * GET /api/invoice?skip=0&top=10&status=paid&startDate=2024-01-01&endDate=2024-01-31
 */
export const getAllInvoices = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip, 10) || 0;
    const top = parseInt(req.query.top, 10) || 20;
    const status = req.query.status; // paid, created, failed, etc.
    const startDate = req.query.startDate ? new Date(req.query.startDate + 'T00:00:00.000Z') : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate + 'T23:59:59.999Z') : null;

    const where = {};
    
    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.createdOnUTC = {
        [Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      where.createdOnUTC = {
        [Op.gte]: startDate
      };
    } else if (endDate) {
      where.createdOnUTC = {
        [Op.lte]: endDate
      };
    }

    const { count: total, rows: orders } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: CustomerDetail,
          as: "customer",
          attributes: ["id", "firstName", "lastName", "email"]
        }
      ],
      order: [["createdOnUTC", "DESC"]],
      offset: skip,
      limit: top
    });

    const invoices = orders.map(order => ({
      invoiceId: order.id,
      invoiceNumber: `INV-${order.id}-${order.razorpayOrderId || ""}`,
      orderNumber: order.razorpayOrderId || `ORD-${order.id}`,
      customerName: order.customer 
        ? `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim() 
        : "Unknown",
      customerEmail: order.customer?.email || "",
      amount: parseFloat(order.amount || 0),
      paidAmount: parseFloat(order.paid_amount || 0),
      dueAmount: parseFloat(order.due_amount || 0),
      status: order.status,
      currency: order.currency || "INR",
      invoiceDate: order.createdOnUTC,
      createdAt: order.createdOnUTC
    }));

    // Return array directly (consistent with orders endpoint)
    return sendSuccess(res, invoices);

  } catch (err) {
    console.error("❌ GET ALL INVOICES ERROR:", err);
    return sendError(res, err.message || "Failed to fetch invoices", 500);
  }
};

/**
 * Get Invoice by Invoice Number
 * GET /api/invoice/:invoiceNumber
 */
export const getInvoiceByNumber = async (req, res) => {
  try {
    const invoiceNumber = req.params.invoiceNumber;

    // Extract order ID from invoice number (format: INV-{orderId}-{razorpayOrderId})
    const match = invoiceNumber.match(/^INV-(\d+)-/);
    if (!match) {
      return sendError(res, "Invalid invoice number format", 400);
    }

    const orderId = parseInt(match[1], 10);
    return await getInvoiceByOrderId({ params: { orderId } }, res);

  } catch (err) {
    console.error("❌ GET INVOICE BY NUMBER ERROR:", err);
    return sendError(res, err.message || "Failed to fetch invoice", 500);
  }
};

