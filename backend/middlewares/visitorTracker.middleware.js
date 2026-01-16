/**
 * Visitor Tracking Middleware
 * Tracks all API requests for analytics (non-blocking, doesn't affect performance)
 */

import { VisitorLog } from "../db/dbconnection.js";

// Helper to anonymize IP address (privacy-friendly)
const anonymizeIP = (ip) => {
  if (!ip) return null;
  
  // IPv4: Keep first 3 octets, set last to 0
  // Example: 192.168.1.100 -> 192.168.1.0
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
  }
  
  // IPv6: Keep first 3 groups, mask rest
  // Example: 2001:0db8:85a3:0000:0000:8a2e:0370:7334 -> 2001:0db8:85a3::
  if (ip.includes(':')) {
    const parts = ip.split(':');
    if (parts.length >= 4) {
      return `${parts[0]}:${parts[1]}:${parts[2]}::`;
    }
  }
  
  return ip;
};

// Helper to extract device type from user agent
const getDeviceType = (userAgent) => {
  if (!userAgent) return 'unknown';
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'mobile';
  }
  if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'tablet';
  }
  return 'desktop';
};

/**
 * Visitor tracking middleware
 * Logs visitor information asynchronously (non-blocking)
 */
export const trackVisitor = (req, res, next) => {
  // Don't track if VisitorLog model is not available
  if (!VisitorLog) {
    return next();
  }

  // Skip tracking for certain paths (optional - reduce noise)
  const skipPaths = [
    '/docs',           // Swagger docs
    '/api/v1/docs',    // Swagger docs with base URL
    '/health',         // Health checks
    '/favicon.ico',    // Favicon requests
  ];
  
  const path = req.path || req.url;
  if (skipPaths.some(skip => path.includes(skip))) {
    return next();
  }

  // Start timing for response time
  const startTime = Date.now();

  // Store original end function
  const originalEnd = res.end;

  // Override end to capture response time
  res.end = function(...args) {
    // Calculate response time
    const responseTime = Date.now() - startTime;
    
    // Log visitor asynchronously (non-blocking)
    logVisitor(req, res, responseTime).catch(err => {
      // Silently fail - don't break the request
      console.warn('⚠️ Visitor tracking failed (non-critical):', err.message);
    });

    // Call original end
    originalEnd.apply(this, args);
  };

  next();
};

/**
 * Log visitor information (async, non-blocking)
 */
const logVisitor = async (req, res, responseTime) => {
  try {
    if (!VisitorLog) return;

    // Extract visitor information
    const ipAddress = req.ip || 
                     req.connection?.remoteAddress || 
                     req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                     req.socket?.remoteAddress ||
                     null;

    const userAgent = req.get('user-agent') || null;
    const referrer = req.get('referer') || req.get('referrer') || null;
    const endpoint = req.originalUrl || req.url || null;
    const method = req.method || null;
    const statusCode = res.statusCode || null;
    const userId = req.user?.id || null;

    // Anonymize IP for privacy
    const anonymizedIP = anonymizeIP(ipAddress);

    // Create visitor log entry (non-blocking)
    await VisitorLog.create({
      ipAddress: anonymizedIP,
      userAgent,
      endpoint,
      method,
      referrer,
      userId,
      statusCode,
      responseTime,
      environment: process.env.NODE_ENV || 'development',
    });

  } catch (error) {
    // Silently fail - visitor tracking should never break the application
    // Only log in development
    if (process.env.NODE_ENV !== 'production') {
      console.warn('⚠️ Visitor tracking error (non-critical):', error.message);
    }
  }
};

/**
 * Get daily visitor statistics
 * Used by dashboard to show visitor counts
 */
export const getDailyVisitors = async (days = 30) => {
  try {
    if (!VisitorLog) {
      return [];
    }

    const { Op, fn, col, literal } = await import('sequelize');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get unique visitors per day (by IP)
    const dailyStats = await VisitorLog.findAll({
      where: {
        visitedAt: {
          [Op.gte]: startDate,
        },
      },
      attributes: [
        [fn('DATE', col('visitedAt')), 'date'],
        [fn('COUNT', fn('DISTINCT', col('ipAddress'))), 'visitors'],
        [fn('COUNT', col('id')), 'pageViews'],
        [fn('AVG', col('responseTime')), 'avgResponseTime'],
      ],
      group: [fn('DATE', col('visitedAt'))],
      order: [[fn('DATE', col('visitedAt')), 'DESC']],
      raw: true,
    });

    // Format results
    return dailyStats.map(stat => ({
      date: stat.date ? new Date(stat.date).toISOString().split('T')[0] : null,
      visitors: parseInt(stat.visitors) || 0,
      pageViews: parseInt(stat.pageViews) || 0,
      avgTime: stat.avgResponseTime 
        ? `${Math.round(parseFloat(stat.avgResponseTime))}ms` 
        : '0ms',
    }));

  } catch (error) {
    console.error('❌ Error getting daily visitors:', error);
    return [];
  }
};

