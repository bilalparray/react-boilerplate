/**
 * Error Log Controller
 * Admin-only endpoints for viewing error logs
 * Note: These endpoints are NOT exposed in the UI, only for direct API access
 */

import { ErrorLog } from '../../db/dbconnection.js';
import { sendSuccess, sendError } from '../../Helper/response.helper.js';
import { Op } from 'sequelize';

/**
 * Get error logs with filtering and pagination
 * GET /api/v1/admin/error-logs
 */
export const getErrorLogs = async (req, res) => {
  try {
    // Only allow Admin users
    if (req.user?.role !== 'Admin') {
      return sendError(res, 'Unauthorized - Admin access required', 403);
    }

    const {
      page = 1,
      limit = 50,
      source,
      level,
      resolved,
      startDate,
      endDate,
      search,
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    // Apply filters
    if (source) where.source = source;
    if (level) where.level = level;
    if (resolved !== undefined) where.resolved = resolved === 'true';

    // Date range filter
    if (startDate || endDate) {
      where.createdOnUTC = {};
      if (startDate) {
        where.createdOnUTC[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        where.createdOnUTC[Op.lte] = new Date(endDate);
      }
    }

    // Search filter (searches in errorMessage and errorType)
    if (search) {
      where[Op.or] = [
        { errorMessage: { [Op.iLike]: `%${search}%` } },
        { errorType: { [Op.iLike]: `%${search}%` } },
        { endpoint: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Get logs with pagination
    const { count, rows } = await ErrorLog.findAndCountAll({
      where,
      order: [['createdOnUTC', 'DESC']],
      limit: parseInt(limit),
      offset,
      attributes: {
        exclude: ['requestBody', 'requestHeaders'], // Exclude large fields by default
      },
    });

    return sendSuccess(res, {
      logs: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    return sendError(res, error.message || 'Failed to fetch error logs', 500);
  }
};

/**
 * Get single error log with full details
 * GET /api/v1/admin/error-logs/:id
 */
export const getErrorLogById = async (req, res) => {
  try {
    if (req.user?.role !== 'Admin') {
      return sendError(res, 'Unauthorized - Admin access required', 403);
    }

    const { id } = req.params;
    const errorLog = await ErrorLog.findByPk(id);

    if (!errorLog) {
      return sendError(res, 'Error log not found', 404);
    }

    return sendSuccess(res, { log: errorLog });
  } catch (error) {
    return sendError(res, error.message || 'Failed to fetch error log', 500);
  }
};

/**
 * Mark error as resolved
 * PATCH /api/v1/admin/error-logs/:id/resolve
 */
export const resolveErrorLog = async (req, res) => {
  try {
    if (req.user?.role !== 'Admin') {
      return sendError(res, 'Unauthorized - Admin access required', 403);
    }

    const { id } = req.params;
    const { notes } = req.body;

    const errorLog = await ErrorLog.findByPk(id);
    if (!errorLog) {
      return sendError(res, 'Error log not found', 404);
    }

    await errorLog.update({
      resolved: true,
      resolvedAt: new Date(),
      resolvedBy: req.user.id,
      notes: notes || errorLog.notes,
    });

    return sendSuccess(res, { log: errorLog });
  } catch (error) {
    return sendError(res, error.message || 'Failed to resolve error log', 500);
  }
};

/**
 * Get error statistics
 * GET /api/v1/admin/error-logs/stats
 */
export const getErrorStats = async (req, res) => {
  try {
    if (req.user?.role !== 'Admin') {
      return sendError(res, 'Unauthorized - Admin access required', 403);
    }

    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const stats = await ErrorLog.findAll({
      where: {
        createdOnUTC: { [Op.gte]: startDate },
      },
      attributes: [
        [ErrorLog.sequelize.fn('COUNT', ErrorLog.sequelize.col('id')), 'count'],
        'source',
        'level',
      ],
      group: ['source', 'level'],
      raw: true,
    });

    const totalErrors = await ErrorLog.count({
      where: {
        createdOnUTC: { [Op.gte]: startDate },
      },
    });

    const unresolvedErrors = await ErrorLog.count({
      where: {
        createdOnUTC: { [Op.gte]: startDate },
        resolved: false,
      },
    });

    return sendSuccess(res, {
      totalErrors,
      unresolvedErrors,
      resolvedErrors: totalErrors - unresolvedErrors,
      breakdown: stats,
      period: `${days} days`,
    });
  } catch (error) {
    return sendError(res, error.message || 'Failed to fetch error stats', 500);
  }
};

