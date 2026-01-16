/**
 * @swagger
 * tags:
 *   - name: Reports
 *     description: Sales and analytics reports endpoints (Admin only)
 */

import { Router } from "express";
import {
  getSalesByDateRange,
  getDailySalesTotals,
  getProductSales,
  getPaymentReport
} from "../../controller/reports/reportsController.js";
import authenticate from "../../middlewares/auth/auth.js";

const router = Router();

/**
 * @swagger
 * /api/v1/reports/sales:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Get sales by date range (Admin only)
 *     description: Returns sales data filtered by date range
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Sales report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/sales", authenticate, getSalesByDateRange);

/**
 * @swagger
 * /api/v1/reports/daily:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Get daily sales totals (Admin only)
 *     description: Returns daily sales totals
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Daily sales report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/daily", authenticate, getDailySalesTotals);

/**
 * @swagger
 * /api/v1/reports/product-sales:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Get product sales report (Admin only)
 *     description: Returns sales data grouped by product
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Product sales report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/product-sales", authenticate, getProductSales);

/**
 * @swagger
 * /api/v1/reports/payments:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Get payment report (Admin only)
 *     description: Returns payment transaction data
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Payment report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/payments", authenticate, getPaymentReport);

export default router;

