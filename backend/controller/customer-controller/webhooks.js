import { Order, CustomerDetail, Payment, WebhookLog } from "../../db/dbconnection.js";
import express from "express";
import crypto from "crypto";
// r.post("/", async (req, res) => {
//   const event = req.body.event;
//   const payload = req.body.payload;
//   // const expectedSignature = crypto
//   //   .createHmac("sha256", process.env.WEBHOOK_SECRET )
//   //   .update(bodyString)
//   //   .digest("hex");

//   // if (signature !== expectedSignature) {
//   //   console.log("❌ Invalid Razorpay Webhook Signature");
//   //   return res.status(400).json({ success: false, message: "Invalid signature" });
//   // }

//   console.log(`\n📦 Razorpay Event Received: ${event}`);

//   // ✅ temporarily trusting signature
//   const signatureValid = true;

//   if (!signatureValid) {
//     return res.status(400).json({ success: false, message: "Invalid signature" });
//   }

//   let eventData = { event };

//   try {
//     switch (event) {

//       /* ---------------------------------------
//        ✅ ORDER PAID (Order + Items + Customer)
//       ----------------------------------------*/
//       case "order.paid": {
//         const payment = payload.payment.entity;
//         const order = payload.order.entity;

//         eventData = {
//           event,
//           orderId: order.id,
//           paymentId: payment.id,
//           amount: payment.amount,
//           amountPaid: order.amount_paid,
//           amountDue: order.amount_due,
//           isPaymentcaptured: payment.captured,
//           PaymentStatus: payment.status,
//           OrderStatus:order.status,
//           receipt: order.receipt,
//           paymentUrl: payment.paymentUrl,
//           email: payment.email,
//           contact: payment.contact,
//           currency: payment.currency
//         };

//         console.log("✅ ORDER PAID", eventData);

//         // 🧠 Find internal order by receipt (internal orderId stored in receipt)
//         const dbOrder = await Order.findOne({ where: { razorpayOrderId: order.id } });
//         //const dbOrder2 = await Order.findOne({ where: { receipt: order.receipt } });
//         if (!dbOrder) {
//           console.log("⚠️ Order not found in DB");
//           break;
//         }

//         // ✅ Update order only if not already marked paid
//         if (dbOrder.paymentStatus !== "paid") {
//           await dbOrder.update({
//             paymentId: payment.id,
//             paymentStatus: order.status,
//             razorpayPaymentId: payment.id,
//             paymentMethod: payment.method,
//             paymentAmount: payment.amount / 100,
//             currency: payment.currency
//           });
//         }

//         break;
//       }

//       /* ---------------------------------------
//        ✅ PAYMENT AUTHORIZED (capture later)
//       ----------------------------------------*/
//       case "payment.authorized": {
//         const p = payload.payment.entity;
//         eventData = {
//           event,
//           paymentId: p.id,
//           orderId: p.order_id,
//           amount: p.amount,
//           status: p.status,
//           email: p.email,
//           contact: p.contact,
//           currency: p.currency
//         };

//         const dbOrder = await Order.findOne({ where: { razorpayOrderId: p.id } });

//         if (!dbOrder) {
//           console.log("⚠️ Order not found in DB");
//           break;
//         }

//         // ✅ Update order only if not already marked paid
//         if (dbOrder.paymentStatus !== "paid") {
//           await dbOrder.update({
//             paymentId: payment.id,
//             paymentStatus: p.status,
//             razorpayPaymentId: payment.id,
//             paymentMethod: payment.method,
//             paymentAmount: payment.amount / 100,
//             currency: payment.currency
//           });
//         }

//         console.log("✅ PAYMENT AUTHORIZED", eventData);
//         // Optional: mark pending authorization
//         break;
//       }

//       /* ---------------------------------------
//        ✅ PAYMENT CAPTURED
//       ----------------------------------------*/
//       case "payment.captured": {
//         const p = payload.payment.entity;
//         eventData = {
//           event,
//           paymentId: p.id,
//           orderId: p.order_id,
//           amount: p.amount,
//           status: p.status,
//           email: p.email,
//           contact: p.contact,
//           currency: p.currency
//         };

//         console.log("✅ PAYMENT CAPTURED", eventData);

//         await Order.update(
//           {
//             paymentStatus: p.status,
//             razorpayPaymentId: p.id,
//             paymentAmount: p.amount / 100
//           },
//           { where: { razorpayOrderId: p.order_id } }
//         );

//         break;
//       }

//       /* ---------------------------------------
//        ❌ PAYMENT FAILED
//       ----------------------------------------*/
//       case "payment.failed": {
//         const p = payload.payment.entity;
//         eventData = {
//           event,
//           paymentId: p.id,
//           orderId: p.order_id,
//           reason: p.error_description,
//           status: p.status,
//           email: p.email,
//           contact: p.contact,
//           currency: p.currency
//         };

//         console.log("❌ PAYMENT FAILED", eventData);

//         await Order.update(
//           { paymentStatus: p.status },
//           { where: { razorpayOrderId: p.order_id } }
//         );

//         break;
//       }

//       /* ---------------------------------------
//        ⚠️ INVOICE PARTIALLY PAID
//       ----------------------------------------*/
//       case "invoice.partially_paid": {
//         const inv = payload.invoice.entity;

//         eventData = {
//           event,
//           invoiceId: inv.id,
//           orderId: inv.order_id,
//           paidAmount: inv.amount_paid,
//           due: inv.amount_due,
//           customerEmail: inv.customer_details.email,
//           customerName: inv.customer_details.name,
//           InvoiceStatus: inv.status
//         };

//         console.log("⚠️ INVOICE PARTIALLY PAID", eventData);

//         await Order.update(
//           { paymentStatus: inv.status,
//             paid_amount: inv.amount_paid,
//             amount_due: inv.amount_due,
//            },
//           { where: { razorpayOrderId: inv.order_id } }
//         );
//         break;
//       }

//       /* ---------------------------------------
//        ✅ INVOICE PAID
//       ----------------------------------------*/
//       case "invoice.paid": {
//         const inv = payload.invoice.entity;

//         eventData = {
//           event,
//           invoiceId: inv.id,
//           orderId: inv.order_id,
//           paidAmount: inv.amount_paid,
//           customerEmail: inv.customer_details.email,
//           customerName: inv.customer_details.name,
//           InvoiceStatus: inv.status
//         };

//         console.log("✅ INVOICE PAID", eventData);

//         await Order.update(
//           { paymentStatus: inv.status },
//           { where: { razorpayOrderId: inv.order_id } }
//         );
//         break;
//       }

//       /* ---------------------------------------
//        ❌ INVOICE EXPIRED
//       ----------------------------------------*/
//       case "invoice.expired": {
//         const inv = payload.invoice.entity;
//         eventData = { event, invoiceId: inv.id, InvoiceStatus: inv.status };

//         await Order.update(
//           { paymentStatus: inv.status },
//           { where: { razorpayOrderId: inv.order_id } }
//         );
//         console.log("⌛ INVOICE EXPIRED", eventData);
//         break;
//       }

//       /* ---------------------------------------
//        ✅ PAYMENT LINK PAID
//       ----------------------------------------*/
//       case "payment_link.paid": {
//         const pl = payload.payment_link.entity;
//       const p = payload.payment.entity;
//       eventData = {
//         event,
//         paymentLinkId: pl.id,
//         paymentId: p.id,
//         amount: pl.amount,
//         amountPaid: pl.amount_paid,
//         orderId: pl.order_id,
//         status: pl.status,
//         customerEmail: pl.customer.email,
//         customerContact: pl.customer.contact,
//         paymentUrl: pl.short_url
//       };

//        await Order.update(
//           { paymentStatus: inv.status },
//           { where: { razorpayOrderId: pl.order_id } }
//         );
//         console.log("✅ PAYMENT LINK PAID", eventData);
//         break;
//       }

//       /* ---------------------------------------
//        ⚠️ PAYMENT LINK PARTIALLY PAID
//       ----------------------------------------*/
//       case "payment_link.partially_paid": {
//         const pl = payload.payment_link.entity;
//       const p = payload.payment.entity;
//       const o = payload.order;
//       eventData = {
//         event,
//         paymentLinkId: pl.id,
//         paymentId: p.id,
//         amount: pl.amount,
//         amountDue: o.amount_due,
//         isAmountCaptured: p.captured,
//         amountPaid: pl.amount_paid,
//         orderId: pl.order_id,
//         status: pl.status,
//         customerEmail: pl.customer.email,
//         customerContact: pl.customer.contact,
//         paymentUrl: pl.short_url
//       };

//       await Order.update(
//           { 
//             paymentStatus: p1.status,
//             amount_paid: p1.amount_paid,
//             amount_due: o.amount_due
//           },
//           { where: { razorpayOrderId: pl.order_id } }
//         );
//         console.log("⚠️ PAYMENT LINK PARTIALLY PAID", eventData);
//         break;
//       }

//       /* ---------------------------------------
//        ❌ PAYMENT LINK CANCELLED
//       ----------------------------------------*/
//       case "payment_link.cancelled": {
//         const pl = payload.payment_link.entity;
//       eventData = {
//         event,
//         paymentLinkId: pl.id,
//         status: pl.status,
//         cancelledAt: pl.cancelled_at,
//         createdAt: pl.created_at,
//         customerEmail: pl.customer.email,
//         customerContact: pl.customer.contact,
//       };
//       //Todo:Handle payment link using customer data 
//         console.log("❌ PAYMENT LINK CANCELLED", eventData);
//         break;
//       }

//       /* ---------------------------------------
//        ❌ PAYMENT LINK EXPIRED
//       ----------------------------------------*/
//       case "payment_link.expired": {
//                 const pl = payload.payment_link.entity;
//       eventData = {
//         event,
//         paymentLinkId: pl.id,
//         status: pl.status,
//         expiredAt: pl.expired_at,
//         customerEmail: pl.customer.email,
//         customerContact: pl.customer.contact,
//       };      

//         console.log("⌛ PAYMENT LINK EXPIRED", eventData);
//         break;
//       }

//       /* ---------------------------------------
//        ⚠️ REFUND CREATED
//       ----------------------------------------*/
//       case "refund.created": 
//       case "refund.processed":
//       {
//       const rp = payload.refund.entity;
//       const p = payload.payment.entity;
//       eventData = {
//         event,
//         refundId: rp.id,
//         paymentId: rp.payment_id,
//         amount: rp.amount,
//         orderId: p.order_id,
//         isAmountCaptured: p.captured,
//         amountRefunded: p.amount_refunded,
//         refundStatus: p.refund_status,
//         customerEmail: p.email,
//         customerContact: p.contact,
//         fee:p.fee,
//         tax:p.tax
//       };

//       await Order.update(
//           { 
//             paymentStatus: p.refund_status,
//             amount_paid: p.amount_refunded
//           },
//           { where: { razorpayOrderId: p.order_id } }
//         );
//         // const customerDetails = await CustomerDetail.findOne({ where: { email: p.email } });
//         // await Refund.create({
//         //     razorpayRefundId: rp.id,
//         //     paymentId: rp.payment_id,
//         //     razorpayOrderId: p.order_id,
//         //     customerDetailId: customerDetails.id,
//         //     refundAmount: rp.amount / 100,
//         //     refundStatus: p.refund_status,
//         //     refundReason: rp.reason || null
//         //   });
//         console.log("⚠️ Partial Refund Suceessfully", eventData);
//         break;
//       }

//       /* ---------------------------------------
//        🌐 UNKNOWN EVENT
//       ----------------------------------------*/
//       default:
//         eventData = { event, message: "Unhandled event" };
//         console.log("ℹ️ Unhandled event:", event);
//     }

//     return res.status(200).json({ success: true, ...eventData });

//   } catch (err) {
//     console.error("❌ Webhook Error:", err);
//     return res.status(500).json({ success: false, error: err.message });
//   }
// });





const r = express.Router();

r.post("/", async (req, res) => {
  const startTime = Date.now();
  let webhookLog = null;

  try {
    // Get raw body (must be raw for signature verification)
    const rawBody = Buffer.isBuffer(req.body)
      ? req.body.toString("utf8")
      : typeof req.body === "string"
        ? req.body
        : JSON.stringify(req.body);

    if (!rawBody || rawBody.length === 0) {
      return res.status(400).json({ success: false, error: "Empty webhook body" });
    }

    // Get signature from headers
    const receivedSignature = req.headers["x-razorpay-signature"] || 
                             req.headers["X-Razorpay-Signature"];

    if (!receivedSignature) {
      return res.status(400).json({ success: false, error: "Missing x-razorpay-signature header" });
    }

    // Compute expected signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("❌ RAZORPAY_WEBHOOK_SECRET not configured");
      return res.status(500).json({ success: false, error: "Webhook secret not configured" });
    }

    const computedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    // Verify signature
    const isSignatureValid = receivedSignature === computedSignature;

    // Parse payload
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (err) {
      return res.status(400).json({ success: false, error: "Invalid JSON payload" });
    }

    const { event, payload: eventPayload } = payload;

    if (!event || !eventPayload) {
      return res.status(400).json({ success: false, error: "Invalid webhook payload structure" });
    }

    // Extract IDs from payload
    const razorpayOrderId = eventPayload.order?.entity?.id || 
                           eventPayload.payment?.entity?.order_id || 
                           null;
    const razorpayPaymentId = eventPayload.payment?.entity?.id || null;

    // Create webhook log entry (if WebhookLog model exists)
    try {
      if (WebhookLog) {
        webhookLog = await WebhookLog.create({
          event,
          rawBody,
          headers: req.headers,
          receivedSignature,
          computedSignature,
          isSignatureValid,
          status: isSignatureValid ? "processed" : "invalid",
          razorpayOrderId,
          razorpayPaymentId,
          errorMessage: isSignatureValid ? null : "Invalid signature",
          processingTimeMs: Date.now() - startTime
        });
      }
    } catch (logErr) {
      console.warn("⚠️ Failed to create webhook log:", logErr.message);
    }

    // Reject if signature invalid
    if (!isSignatureValid) {
      console.error("❌ Invalid webhook signature", {
        event,
        received: receivedSignature.substring(0, 20) + "...",
        computed: computedSignature.substring(0, 20) + "..."
      });
      return res.status(400).json({ success: false, error: "Invalid webhook signature" });
    }

    // Process event based on type
    let processingResult = { processed: false, message: "Event ignored" };

    switch (event) {
      case "payment.captured":
      case "order.paid":
        processingResult = await handlePaymentCaptured(eventPayload, event);
        break;

      case "payment.failed":
        processingResult = await handlePaymentFailed(eventPayload);
        break;

      case "payment.authorized":
        processingResult = await handlePaymentAuthorized(eventPayload);
        break;

      default:
        console.log(`ℹ️ Unhandled webhook event: ${event}`);
        processingResult = { processed: false, message: `Unhandled event: ${event}` };
    }

    // Update webhook log
    if (webhookLog) {
      try {
        await webhookLog.update({
          status: processingResult.processed ? "processed" : "ignored",
          errorMessage: processingResult.error || null,
          processingTimeMs: Date.now() - startTime
        });
      } catch (logErr) {
        console.warn("⚠️ Failed to update webhook log:", logErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      event,
      processed: processingResult.processed,
      message: processingResult.message
    });

  } catch (err) {
    console.error("❌ WEBHOOK ERROR:", err);

    // Update webhook log if created
    if (webhookLog) {
      try {
        await webhookLog.update({
          status: "error",
          errorMessage: err.message,
          processingTimeMs: Date.now() - startTime
        });
      } catch (logErr) {
        console.error("Failed to update webhook log:", logErr);
      }
    }

    return res.status(500).json({ success: false, error: err.message || "Webhook processing failed" });
  }
});

/**
 * Handle payment.captured / order.paid events
 */
async function handlePaymentCaptured(eventPayload, event) {
  try {
    const paymentEntity = eventPayload.payment?.entity;
    const orderEntity = eventPayload.order?.entity;

    if (!paymentEntity || !orderEntity) {
      return { processed: false, message: "Missing payment or order entity" };
    }

    const razorpayPaymentId = paymentEntity.id;
    const razorpayOrderId = orderEntity.id;
    const amountPaise = paymentEntity.amount;
    const paymentStatus = paymentEntity.status;

    // Find order
    const order = await Order.findOne({
      where: { razorpayOrderId }
    });

    if (!order) {
      console.warn(`⚠️ Order not found for razorpayOrderId: ${razorpayOrderId}`);
      return { processed: false, message: "Order not found" };
    }

    // Check idempotency - prevent duplicate processing (if Payment model exists)
    let existingPayment = null;
    if (Payment) {
      existingPayment = await Payment.findOne({
        where: { razorpayPaymentId }
      });

      if (existingPayment && existingPayment.isProcessed) {
        console.log(`ℹ️ Payment ${razorpayPaymentId} already processed`);
        return { processed: false, message: "Payment already processed (idempotency)" };
      }
    }

    // Validate amount
    const expectedAmountPaise = Math.round(Number(order.amount) * 100);
    const isAmountValid = amountPaise === expectedAmountPaise;

    // Create or update payment record (if Payment model exists)
    let payment = null;
    if (Payment) {
      if (existingPayment) {
        payment = existingPayment;
        await payment.update({
          status: paymentStatus === "captured" ? "captured" : "authorized",
          amountPaise,
          isAmountValid,
          isProcessed: true,
          processedAt: new Date(),
          metadata: {
            razorpayPayment: paymentEntity,
            razorpayOrder: orderEntity,
            event
          }
        });
      } else {
        payment = await Payment.create({
          razorpayPaymentId,
          razorpayOrderId,
          orderId: order.id,
          customerId: order.customerId,
          amount: order.amount,
          amountPaise,
          currency: paymentEntity.currency || "INR",
          status: paymentStatus === "captured" ? "captured" : "authorized",
          method: paymentEntity.method || null,
          isAmountValid,
          isProcessed: true,
          processedAt: new Date(),
          metadata: {
            razorpayPayment: paymentEntity,
            razorpayOrder: orderEntity,
            event
          }
        });
      }
    }

    // Update order status
    let orderStatus = "paid";
    if (!isAmountValid) {
      orderStatus = "flagged";
      console.warn(`⚠️ Amount mismatch for order ${order.id}. Expected: ${expectedAmountPaise} paise, Got: ${amountPaise} paise`);
    }

    // Only update if not already paid (idempotency)
    if (order.status !== "paid" && order.status !== "flagged") {
      await order.update({
        paymentId: razorpayPaymentId,
        status: orderStatus,
        paid_amount: amountPaise / 100,
        due_amount: Math.max(0, order.amount - (amountPaise / 100)),
        lastModifiedBy: null // System update
      });
    }

    return {
      processed: true,
      message: `Payment ${paymentStatus === "captured" ? "captured" : "authorized"} successfully`,
      paymentId: payment?.id || null,
      orderId: order.id,
      isAmountValid
    };

  } catch (err) {
    console.error("❌ Error handling payment captured:", err);
    return { processed: false, error: err.message };
  }
}

/**
 * Handle payment.failed event
 */
async function handlePaymentFailed(eventPayload) {
  try {
    const paymentEntity = eventPayload.payment?.entity;
    if (!paymentEntity) {
      return { processed: false, message: "Missing payment entity" };
    }

    const razorpayOrderId = paymentEntity.order_id;
    const order = await Order.findOne({
      where: { razorpayOrderId }
    });

    if (order && order.status !== "failed") {
      await order.update({
        status: "failed",
        lastModifiedBy: null
      });
    }

    return { processed: true, message: "Payment failure recorded" };
  } catch (err) {
    console.error("❌ Error handling payment failed:", err);
    return { processed: false, error: err.message };
  }
}

/**
 * Handle payment.authorized event
 */
async function handlePaymentAuthorized(eventPayload) {
  try {
    const paymentEntity = eventPayload.payment?.entity;
    if (!paymentEntity) {
      return { processed: false, message: "Missing payment entity" };
    }

    // Payment authorized but not yet captured
    console.log(`ℹ️ Payment authorized: ${paymentEntity.id}`);
    
    return { processed: true, message: "Payment authorization logged" };
  } catch (err) {
    console.error("❌ Error handling payment authorized:", err);
    return { processed: false, error: err.message };
  }
}

export default r;
