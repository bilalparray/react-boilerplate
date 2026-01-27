/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Order management and payment processing endpoints
 */

import { Router } from "express";
import {
  createOrder,
  verifyPayment,
  getAllOrders,
  getOrderById,
  getOrdersByCustomerId,
  getRazorpayKey,
  updateOrderStatus,
  validateStock
} from "../../controller/Order/orderController.js";
import authenticate from "../../middlewares/auth/auth.js";

const router = Router();

/**
 * @swagger
 * /api/v1/order/razorpay-key:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get Razorpay public key
 *     description: Returns the Razorpay public key for payment integration
 *     security: []
 *     responses:
 *       200:
 *         description: Razorpay key retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/razorpay-key", getRazorpayKey);

/**
 * @swagger
 * /api/v1/order:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Create a new order
 *     description: Creates a new order with payment details
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reqData
 *             properties:
 *               reqData:
 *                 type: object
 *                 required:
 *                   - customerId
 *                   - items
 *                   - totalAmount
 *                 properties:
 *                   customerId:
 *                     type: integer
 *                     example: 1
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         productId:
 *                           type: integer
 *                         quantity:
 *                           type: integer
 *                         price:
 *                           type: number
 *                   totalAmount:
 *                     type: number
 *                     example: 999.99
 *                   paymentMethod:
 *                     type: string
 *                     example: "razorpay"
 *     responses:
 *       200:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post("/", createOrder);

/**
 * @swagger
 * /api/v1/order/verify:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Verify payment
 *     description: Verifies Razorpay payment signature and updates order status
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reqData
 *             properties:
 *               reqData:
 *                 type: object
 *                 required:
 *                   - orderId
 *                   - paymentId
 *                   - signature
 *                 properties:
 *                   orderId:
 *                     type: string
 *                     example: "order_123456"
 *                   paymentId:
 *                     type: string
 *                     example: "pay_123456"
 *                   signature:
 *                     type: string
 *                     example: "signature_hash"
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post("/verify", verifyPayment);

/**
 * @swagger
 * /api/v1/order/validate-stock:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Validate stock availability
 *     description: Checks stock availability for items before adding to cart or creating order
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reqData
 *             properties:
 *               reqData:
 *                 type: object
 *                 required:
 *                   - items
 *                 properties:
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required:
 *                         - productVariantId
 *                         - quantity
 *                       properties:
 *                         productVariantId:
 *                           type: integer
 *                         quantity:
 *                           type: integer
 *     responses:
 *       200:
 *         description: Stock validation completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post("/validate-stock", validateStock);

/**
 * @swagger
 * /api/v1/order:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders
 *     description: Returns all orders (may require authentication)
 *     security: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/", getAllOrders);

/**
 * @swagger
 * /api/v1/order/customer/{customerId}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get orders by customer ID
 *     description: Returns all orders for a specific customer
 *     security: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/customer/:customerId", getOrdersByCustomerId);

/**
 * @swagger
 * /api/v1/order/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get order by ID
 *     description: Returns a specific order by its ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", getOrderById);

/**
 * @swagger
 * /api/v1/order/{id}/status:
 *   put:
 *     tags:
 *       - Orders
 *     summary: Update order status (Admin only)
 *     description: Updates the status of an order
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reqData
 *             properties:
 *               reqData:
 *                 type: object
 *                 required:
 *                   - status
 *                 properties:
 *                   status:
 *                     type: string
 *                     enum: [pending, processing, shipped, delivered, cancelled]
 *                     example: "shipped"
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put("/:id/status", authenticate, updateOrderStatus);

export default router;
