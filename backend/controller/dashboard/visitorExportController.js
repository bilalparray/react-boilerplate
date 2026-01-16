/**
 * Visitor Data Export Controller
 * Allows admin to export all visitor log data before cleanup
 */

import { VisitorLog } from '../../db/dbconnection.js';
import { sendSuccess, sendError } from '../../Helper/response.helper.js';
import { Op } from 'sequelize';

/**
 * Export all visitor log data as JSON
 * GET /api/v1/dashboard/export-visitors
 * Query params:
 *   - format: 'json' (default) or 'csv'
 *   - startDate: optional (YYYY-MM-DD)
 *   - endDate: optional (YYYY-MM-DD)
 */
export const exportVisitorData = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return sendError(res, 'Unauthorized. Admin access required.', 403);
    }

    if (!VisitorLog) {
      return sendError(res, 'Visitor log system not available', 500);
    }

    const { format = 'json', startDate, endDate } = req.query;

    // Build where clause
    const where = {};
    if (startDate || endDate) {
      where.visitedAt = {};
      if (startDate) {
        where.visitedAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        where.visitedAt[Op.lte] = new Date(endDate + 'T23:59:59.999Z');
      }
    }

    // Fetch all visitor logs
    const visitorLogs = await VisitorLog.findAll({
      where,
      order: [['visitedAt', 'DESC']],
      raw: true,
    });

    if (format === 'csv') {
      // Generate CSV
      const headers = [
        'ID',
        'IP Address',
        'User Agent',
        'Endpoint',
        'Method',
        'Referrer',
        'User ID',
        'Status Code',
        'Response Time (ms)',
        'Environment',
        'Visited At (UTC)',
        'Visited At (IST)',
      ];

      const rows = visitorLogs.map(log => {
        const visitedAtUTC = new Date(log.visitedAt);
        const visitedAtIST = new Date(visitedAtUTC.getTime() + (5.5 * 60 * 60 * 1000));
        
        return [
          log.id || '',
          log.ipAddress || '',
          `"${(log.userAgent || '').replace(/"/g, '""')}"`, // Escape quotes in CSV
          log.endpoint || '',
          log.method || '',
          log.referrer || '',
          log.userId || '',
          log.statusCode || '',
          log.responseTime || '',
          log.environment || '',
          visitedAtUTC.toISOString(),
          visitedAtIST.toISOString(),
        ].join(',');
      });

      const csv = [headers.join(','), ...rows].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="visitor-logs-${new Date().toISOString().split('T')[0]}.csv"`);
      return res.send(csv);
    } else {
      // Generate JSON
      const exportData = {
        exportDate: new Date().toISOString(),
        exportDateIST: new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000)).toISOString(),
        totalRecords: visitorLogs.length,
        dateRange: {
          startDate: startDate || 'all',
          endDate: endDate || 'all',
        },
        data: visitorLogs.map(log => ({
          ...log,
          visitedAtUTC: log.visitedAt,
          visitedAtIST: new Date(new Date(log.visitedAt).getTime() + (5.5 * 60 * 60 * 1000)).toISOString(),
        })),
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="visitor-logs-${new Date().toISOString().split('T')[0]}.json"`);
      return res.json(exportData);
    }
  } catch (err) {
    console.error('❌ EXPORT VISITOR DATA ERROR:', err);
    return sendError(res, err.message || 'Export failed', 500);
  }
};

/**
 * Get cleanup status and last log date
 * GET /api/v1/dashboard/visitor-cleanup-status
 */
export const getCleanupStatus = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return sendError(res, 'Unauthorized. Admin access required.', 403);
    }

    if (!VisitorLog) {
      return sendSuccess(res, {
        lastCleanupDate: null,
        totalLogs: 0,
        oldestLogDate: null,
        nextCleanupTime: null,
      });
    }

    // Get oldest log date
    const oldestLog = await VisitorLog.findOne({
      order: [['visitedAt', 'ASC']],
      attributes: ['visitedAt'],
      raw: true,
    });

    // Get newest log date
    const newestLog = await VisitorLog.findOne({
      order: [['visitedAt', 'DESC']],
      attributes: ['visitedAt'],
      raw: true,
    });

    // Get total count
    const totalLogs = await VisitorLog.count();

    // Calculate next cleanup time (2:00 AM IST)
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + istOffset);
    const nextCleanup = new Date(istNow);
    nextCleanup.setUTCHours(20, 30, 0, 0); // 2:00 AM IST = 20:30 UTC
    if (nextCleanup <= istNow) {
      nextCleanup.setUTCDate(nextCleanup.getUTCDate() + 1); // Next day
    }
    const nextCleanupUTC = new Date(nextCleanup.getTime() - istOffset);

    return sendSuccess(res, {
      lastCleanupDate: null, // Can be stored in a config table if needed
      totalLogs,
      oldestLogDate: oldestLog?.visitedAt ? new Date(oldestLog.visitedAt).toISOString() : null,
      newestLogDate: newestLog?.visitedAt ? new Date(newestLog.visitedAt).toISOString() : null,
      nextCleanupTime: nextCleanupUTC.toISOString(),
      nextCleanupTimeIST: nextCleanup.toISOString(),
      cleanupInterval: '24 hours (IST)',
    });
  } catch (err) {
    console.error('❌ GET CLEANUP STATUS ERROR:', err);
    return sendError(res, err.message || 'Failed to get cleanup status', 500);
  }
};

