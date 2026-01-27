import { Order, OrderRecord, ProductVariant, StockTransaction } from "../db/dbconnection.js";
import { Op } from "sequelize";

/**
 * Stock Management Helper
 * Provides atomic, idempotent stock operations for order lifecycle events
 */

/**
 * Check if stock has already been reduced for an order
 * @param {number} orderId - Order ID
 * @returns {Promise<boolean>} - True if stock was already reduced
 */
async function hasStockBeenReduced(orderId) {
  const transaction = await StockTransaction.findOne({
    where: {
      orderId,
      transactionType: 'reduce',
      isReversed: false,
    },
  });
  return !!transaction;
}

/**
 * Check if stock has already been restored for an order
 * @param {number} orderId - Order ID
 * @returns {Promise<boolean>} - True if stock was already restored
 */
async function hasStockBeenRestored(orderId) {
  const transaction = await StockTransaction.findOne({
    where: {
      orderId,
      transactionType: 'restore',
      isReversed: false,
    },
  });
  return !!transaction;
}

/**
 * Atomically reduce stock for all variants in an order
 * @param {number} orderId - Order ID
 * @param {string} orderStatus - Current order status
 * @param {object} metadata - Additional metadata (payment ID, event, etc.)
 * @param {object} transaction - Sequelize transaction (optional, for atomicity)
 * @returns {Promise<{success: boolean, message: string, transactions: Array}>}
 */
export async function reduceStockForOrder(orderId, orderStatus = 'paid', metadata = {}, transaction = null) {
  const t = transaction || await Order.sequelize.transaction();
  let shouldCommit = !transaction;

  try {
    // Idempotency check: Don't reduce stock twice
    if (await hasStockBeenReduced(orderId)) {
      console.log(`ℹ️ Stock already reduced for order ${orderId}, skipping`);
      if (shouldCommit) await t.rollback();
      return {
        success: true,
        message: 'Stock already reduced (idempotent)',
        transactions: [],
        skipped: true,
      };
    }

    // Fetch all order records with variant info
    const orderRecords = await OrderRecord.findAll({
      where: { orderId },
      include: [
        {
          model: ProductVariant,
          as: 'variant',
          required: true,
        },
      ],
      transaction: t,
    });

    if (orderRecords.length === 0) {
      throw new Error(`No order records found for order ${orderId}`);
    }

    const stockTransactions = [];
    const errors = [];

    // Process each variant atomically
    for (const record of orderRecords) {
      const variant = record.variant;
      if (!variant) {
        errors.push(`Variant not found for order record ${record.id}`);
        continue;
      }

      const quantityOrdered = Number(record.quantity) || 0;
      if (quantityOrdered <= 0) {
        console.warn(`⚠️ Invalid quantity for order record ${record.id}: ${quantityOrdered}`);
        continue;
      }

      const currentStock = Number(variant.stock) || 0;

      // Validate stock availability
      if (currentStock < quantityOrdered) {
        const error = `Insufficient stock for variant ${variant.id} (${variant.sku}). Current: ${currentStock}, Ordered: ${quantityOrdered}`;
        console.error(`❌ ${error}`);
        errors.push(error);
        
        // Still create transaction record for audit, but set stock to 0
        const newStock = 0;
        await variant.update({ stock: newStock }, { transaction: t });
        
        const stockTransaction = await StockTransaction.create({
          orderId,
          productVariantId: variant.id,
          quantity: -quantityOrdered, // Negative for reduction
          previousStock: currentStock,
          newStock,
          transactionType: 'reduce',
          orderStatus,
          metadata: {
            ...metadata,
            error: 'Insufficient stock',
            orderRecordId: record.id,
          },
        }, { transaction: t });

        stockTransactions.push(stockTransaction);
        continue;
      }

      // Atomically update stock
      const newStock = currentStock - quantityOrdered;
      await variant.update({ stock: newStock }, { transaction: t });

      // Create transaction record for audit
      const stockTransaction = await StockTransaction.create({
        orderId,
        productVariantId: variant.id,
        quantity: -quantityOrdered, // Negative for reduction
        previousStock: currentStock,
        newStock,
        transactionType: 'reduce',
        orderStatus,
        metadata: {
          ...metadata,
          orderRecordId: record.id,
        },
      }, { transaction: t });

      stockTransactions.push(stockTransaction);
      console.log(`✅ Reduced stock for variant ${variant.id} (${variant.sku}): ${currentStock} → ${newStock}`);
    }

    if (shouldCommit) await t.commit();

    return {
      success: errors.length === 0,
      message: errors.length > 0 
        ? `Stock reduced with ${errors.length} warning(s)` 
        : 'Stock reduced successfully',
      transactions: stockTransactions,
      errors: errors.length > 0 ? errors : undefined,
    };

  } catch (err) {
    console.error(`❌ Error reducing stock for order ${orderId}:`, err);
    if (shouldCommit) await t.rollback();
    throw err;
  }
}

/**
 * Atomically restore stock for all variants in an order
 * @param {number} orderId - Order ID
 * @param {string} orderStatus - Current order status
 * @param {object} metadata - Additional metadata (refund ID, cancellation reason, etc.)
 * @param {object} transaction - Sequelize transaction (optional, for atomicity)
 * @returns {Promise<{success: boolean, message: string, transactions: Array}>}
 */
export async function restoreStockForOrder(orderId, orderStatus = 'cancelled', metadata = {}, transaction = null) {
  const t = transaction || await Order.sequelize.transaction();
  let shouldCommit = !transaction;

  try {
    // Idempotency check: Don't restore stock twice
    if (await hasStockBeenRestored(orderId)) {
      console.log(`ℹ️ Stock already restored for order ${orderId}, skipping`);
      if (shouldCommit) await t.rollback();
      return {
        success: true,
        message: 'Stock already restored (idempotent)',
        transactions: [],
        skipped: true,
      };
    }

    // Check if stock was ever reduced for this order (must check before transaction)
    // We check outside transaction first for idempotency
    const hasReduction = await hasStockBeenReduced(orderId);
    
    if (!hasReduction) {
      console.log(`ℹ️ No stock reduction found for order ${orderId}, nothing to restore`);
      if (shouldCommit) await t.rollback();
      return {
        success: true,
        message: 'No stock reduction found, nothing to restore',
        transactions: [],
        skipped: true,
      };
    }

    // Get reduction transactions for linking
    const reductionTransactions = await StockTransaction.findAll({
      where: {
        orderId,
        transactionType: 'reduce',
        isReversed: false,
      },
      transaction: t,
    });


    // Fetch all order records with variant info
    const orderRecords = await OrderRecord.findAll({
      where: { orderId },
      include: [
        {
          model: ProductVariant,
          as: 'variant',
          required: true,
          lock: transaction ? transaction.LOCK.UPDATE : undefined,
        },
      ],
      transaction: t,
    });

    if (orderRecords.length === 0) {
      throw new Error(`No order records found for order ${orderId}`);
    }

    const stockTransactions = [];

    // Restore stock for each variant
    for (const record of orderRecords) {
      const variant = record.variant;
      if (!variant) {
        console.warn(`⚠️ Variant not found for order record ${record.id}`);
        continue;
      }

      const quantityToRestore = Number(record.quantity) || 0;
      if (quantityToRestore <= 0) {
        console.warn(`⚠️ Invalid quantity for order record ${record.id}: ${quantityToRestore}`);
        continue;
      }

      const currentStock = Number(variant.stock) || 0;
      const newStock = currentStock + quantityToRestore;

      // Atomically update stock
      await variant.update({ stock: newStock }, { transaction: t });

      // Find the original reduction transaction to link
      const originalReduction = reductionTransactions.find(
        t => t.productVariantId === variant.id
      );

      // Mark original reduction as reversed
      if (originalReduction) {
        await originalReduction.update({ isReversed: true }, { transaction: t });
      }

      // Create transaction record for audit
      const stockTransaction = await StockTransaction.create({
        orderId,
        productVariantId: variant.id,
        quantity: quantityToRestore, // Positive for restoration
        previousStock: currentStock,
        newStock,
        transactionType: 'restore',
        orderStatus,
        reversedByTransactionId: originalReduction?.id || null,
        metadata: {
          ...metadata,
          orderRecordId: record.id,
          originalReductionId: originalReduction?.id || null,
        },
      }, { transaction: t });

      stockTransactions.push(stockTransaction);
      console.log(`✅ Restored stock for variant ${variant.id} (${variant.sku}): ${currentStock} → ${newStock}`);
    }

    if (shouldCommit) await t.commit();

    return {
      success: true,
      message: 'Stock restored successfully',
      transactions: stockTransactions,
    };

  } catch (err) {
    console.error(`❌ Error restoring stock for order ${orderId}:`, err);
    if (shouldCommit) await t.rollback();
    throw err;
  }
}

/**
 * Handle stock changes based on order status transition
 * @param {number} orderId - Order ID
 * @param {string} oldStatus - Previous order status
 * @param {string} newStatus - New order status
 * @param {object} metadata - Additional metadata
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function handleOrderStatusTransition(orderId, oldStatus, newStatus, metadata = {}) {
  try {
    // Define valid transitions and their stock operations
    const transitions = {
      // Pending/Created -> Paid: Reduce stock
      'created->paid': { action: 'reduce', status: 'paid' },
      'pending->paid': { action: 'reduce', status: 'paid' },
      
      // Paid -> Cancelled/Refunded: Restore stock
      'paid->cancelled': { action: 'restore', status: 'cancelled' },
      'paid->refunded': { action: 'restore', status: 'refunded' },
      'paid->partially_refunded': { action: 'restore', status: 'partially_refunded' },
      
      // Paid -> Failed: Restore stock (if payment failed after being paid)
      'paid->failed': { action: 'restore', status: 'failed' },
    };

    const transitionKey = `${oldStatus}->${newStatus}`.toLowerCase();
    const transition = transitions[transitionKey];

    if (!transition) {
      // No stock operation needed for this transition
      return {
        success: true,
        message: `No stock operation needed for transition ${transitionKey}`,
        skipped: true,
      };
    }

    if (transition.action === 'reduce') {
      return await reduceStockForOrder(orderId, transition.status, metadata);
    } else if (transition.action === 'restore') {
      return await restoreStockForOrder(orderId, transition.status, metadata);
    }

    return {
      success: true,
      message: 'Transition handled',
    };

  } catch (err) {
    console.error(`❌ Error handling order status transition:`, err);
    throw err;
  }
}

/**
 * Get stock transaction history for an order
 * @param {number} orderId - Order ID
 * @returns {Promise<Array>} - Array of stock transactions
 */
export async function getStockTransactionHistory(orderId) {
  return await StockTransaction.findAll({
    where: { orderId },
    include: [
      {
        model: ProductVariant,
        as: 'variant',
        attributes: ['id', 'sku', 'productId'],
      },
    ],
    order: [['createdOnUTC', 'ASC']],
  });
}

