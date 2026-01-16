/**
 * @swagger
 * tags:
 *   - name: Invoices
 *     description: Invoice management endpoints (Admin only)
 */

import { Router } from "express";
import {
  getInvoiceByOrderId,
  getAllInvoices,
  getInvoiceByNumber
} from "../../controller/invoice/invoiceController.js";
import authenticate from "../../middlewares/auth/auth.js";

const router = Router();

/**
 * @swagger
 * /api/v1/invoice:
 *   get:
 *     tags:
 *       - Invoices
 *     summary: Get all invoices (Admin only)
 *     description: Returns all invoices
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Invoices retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/", authenticate, getAllInvoices);

/**
 * @swagger
 * /api/v1/invoice/order/{orderId}:
 *   get:
 *     tags:
 *       - Invoices
 *     summary: Get invoice by order ID (Admin only)
 *     description: Returns invoice for a specific order
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Invoice retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/order/:orderId", authenticate, getInvoiceByOrderId);

/**
 * @swagger
 * /api/v1/invoice/{invoiceNumber}:
 *   get:
 *     tags:
 *       - Invoices
 *     summary: Get invoice by invoice number (Admin only)
 *     description: Returns invoice by its invoice number
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Invoice number
 *     responses:
 *       200:
 *         description: Invoice retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:invoiceNumber", authenticate, getInvoiceByNumber);

export default router;

