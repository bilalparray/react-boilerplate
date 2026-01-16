/**
 * @swagger
 * tags:
 *   - name: Error Logs
 *     description: Frontend error logging endpoints
 */

/**
 * Frontend Error Log Route
 * Public endpoint for frontend to log errors
 * No authentication required (but rate limiting recommended)
 */

import express from 'express';
import { logFrontendError } from '../../Helper/errorLogger.helper.js';
import { sendSuccess } from '../../Helper/response.helper.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/error-log:
 *   post:
 *     tags:
 *       - Error Logs
 *     summary: Log frontend error
 *     description: Public endpoint for frontend applications to log errors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Error message"
 *               errorMessage:
 *                 type: string
 *                 example: "Detailed error message"
 *               stackTrace:
 *                 type: string
 *                 example: "Error stack trace"
 *               level:
 *                 type: string
 *                 enum: [error, warning, info]
 *                 example: "error"
 *               statusCode:
 *                 type: integer
 *                 example: 500
 *               url:
 *                 type: string
 *                 example: "/page/url"
 *               component:
 *                 type: string
 *                 example: "ComponentName"
 *     responses:
 *       200:
 *         description: Error logged successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.post('/', async (req, res) => {
  try {
    // Log the error (non-blocking)
    await logFrontendError({
      error: req.body.error || req.body.errorMessage || 'Unknown error',
      errorMessage: req.body.errorMessage,
      stackTrace: req.body.stackTrace || req.body.stack,
      level: req.body.level || 'error',
      statusCode: req.body.statusCode,
      url: req.body.url,
      component: req.body.component,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString(),
      ...req.body,
    });

    // Always return success to frontend (don't fail if logging fails)
    return sendSuccess(res, { logged: true });
  } catch (error) {
    // Even if logging fails, return success to frontend
    // We don't want error logging to break the user experience
    console.error('Failed to log frontend error:', error);
    return sendSuccess(res, { logged: false });
  }
});

export default router;

