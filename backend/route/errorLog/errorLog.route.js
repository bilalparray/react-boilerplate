/**
 * @swagger
 * tags:
 *   - name: Admin Error Logs
 *     description: Error log management endpoints (Admin only)
 */

/**
 * Error Log Routes
 * Admin-only routes for viewing error logs
 * These routes are NOT exposed in the UI - only for direct API access
 */

import express from 'express';
import {
  getErrorLogs,
  getErrorLogById,
  resolveErrorLog,
  getErrorStats,
} from '../../controller/errorLog/errorLogController.js';
import { authenticateToken } from '../../middlewares/auth/auth.js';

const router = express.Router();

// All routes require authentication and Admin role
router.use(authenticateToken);

/**
 * @swagger
 * /api/v1/admin/error-logs:
 *   get:
 *     tags:
 *       - Admin Error Logs
 *     summary: Get error logs (Admin only)
 *     description: Returns error logs with filtering support
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [error, warning, info]
 *         description: Filter by error level
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: Filter by error source
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Error logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', getErrorLogs);

/**
 * @swagger
 * /api/v1/admin/error-logs/stats:
 *   get:
 *     tags:
 *       - Admin Error Logs
 *     summary: Get error statistics (Admin only)
 *     description: Returns error statistics and analytics
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Error statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/stats', getErrorStats);

/**
 * @swagger
 * /api/v1/admin/error-logs/{id}:
 *   get:
 *     tags:
 *       - Admin Error Logs
 *     summary: Get error log by ID (Admin only)
 *     description: Returns a specific error log by its ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Error log ID
 *     responses:
 *       200:
 *         description: Error log retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', getErrorLogById);

/**
 * @swagger
 * /api/v1/admin/error-logs/{id}/resolve:
 *   patch:
 *     tags:
 *       - Admin Error Logs
 *     summary: Resolve error log (Admin only)
 *     description: Marks an error log as resolved
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Error log ID
 *     responses:
 *       200:
 *         description: Error log resolved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/:id/resolve', resolveErrorLog);

export default router;

