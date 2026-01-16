/**
 * @swagger
 * tags:
 *   - name: Dashboard
 *     description: Dashboard and analytics endpoints (Admin only)
 */

import { Router } from "express";
import { getDashboardData } from "../../controller/dashboard/dashboardController.js";
import { exportVisitorData, getCleanupStatus } from "../../controller/dashboard/visitorExportController.js";
import authenticate from "../../middlewares/auth/auth.js";

const router = Router();

/**
 * @swagger
 * /api/v1/dashboard:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get dashboard data (Admin only)
 *     description: Returns dashboard statistics and analytics data
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/", authenticate, getDashboardData);

/**
 * @swagger
 * /api/v1/dashboard/export-visitors:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Export visitor data (Admin only)
 *     description: Exports visitor tracking data to a file
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Visitor data exported successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/export-visitors", authenticate, exportVisitorData);

/**
 * @swagger
 * /api/v1/dashboard/visitor-cleanup-status:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get visitor cleanup status (Admin only)
 *     description: Returns the status of visitor data cleanup operations
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cleanup status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/visitor-cleanup-status", authenticate, getCleanupStatus);

export default router;

