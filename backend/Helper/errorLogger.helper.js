/**
 * Error Logger Helper
 * Centralized error logging utility for backend
 */

let ErrorLog = null;

/**
 * Initialize the error logger with the ErrorLog model
 * @param {Object} errorLogModel - Sequelize ErrorLog model
 */
export const initializeErrorLogger = (errorLogModel) => {
  ErrorLog = errorLogModel;
};

/**
 * Sanitize sensitive data from objects
 * @param {Object} obj - Object to sanitize
 * @returns {Object} - Sanitized object
 */
const sanitizeData = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  const sensitiveKeys = [
    'password',
    'token',
    'secret',
    'apiKey',
    'authorization',
    'cookie',
    'creditCard',
    'cvv',
    'ssn',
    'pin',
    'otp',
  ];

  const sanitized = Array.isArray(obj) ? [...obj] : { ...obj };

  for (const key in sanitized) {
    const lowerKey = key.toLowerCase();
    
    // Check if key contains sensitive data
    if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  }

  return sanitized;
};

/**
 * Extract error details from error object
 * @param {Error} error - Error object
 * @returns {Object} - Error details
 */
const extractErrorDetails = (error) => {
  if (!error) return {};

  return {
    errorMessage: error.message || String(error),
    stackTrace: error.stack || null,
    errorType: error.constructor?.name || error.name || 'Error',
  };
};

/**
 * Log error to database
 * @param {Object} options - Error logging options
 * @param {Error|string} options.error - Error object or message
 * @param {string} options.source - Source of error (backend, frontend, api, database, external)
 * @param {string} options.level - Error level (error, warning, critical, info)
 * @param {Object} options.req - Express request object (optional)
 * @param {number} options.statusCode - HTTP status code (optional)
 * @param {Object} options.additionalData - Additional context data (optional)
 * @returns {Promise<Object>} - Created error log entry
 */
export const logError = async ({
  error,
  source = 'backend',
  level = 'error',
  req = null,
  statusCode = null,
  additionalData = null,
}) => {
  // Don't log if ErrorLog model is not initialized
  if (!ErrorLog) {
    console.error('⚠️ ErrorLogger not initialized. Error:', error);
    return null;
  }

  try {
    const errorDetails = extractErrorDetails(error);
    
    // Extract request information if available
    let endpoint = null;
    let method = null;
    let userId = null;
    let userAgent = null;
    let ipAddress = null;
    let requestBody = null;
    let requestHeaders = null;
    let queryParams = null;

    if (req) {
      endpoint = req.originalUrl || req.url || null;
      method = req.method || null;
      userId = req.user?.id || null;
      userAgent = req.get('user-agent') || null;
      ipAddress = req.ip || req.connection?.remoteAddress || null;
      
      // Sanitize request data
      if (req.body) {
        requestBody = sanitizeData(req.body);
      }
      if (req.headers) {
        requestHeaders = sanitizeData(req.headers);
      }
      if (req.query) {
        queryParams = sanitizeData(req.query);
      }
    }

    // Create error log entry
    const errorLog = await ErrorLog.create({
      source,
      level,
      errorMessage: errorDetails.errorMessage,
      stackTrace: errorDetails.stackTrace,
      errorType: errorDetails.errorType,
      endpoint,
      method,
      statusCode: statusCode || null,
      userId,
      userAgent,
      ipAddress,
      requestBody,
      requestHeaders,
      queryParams,
      environment: process.env.NODE_ENV || 'development',
      additionalData: additionalData ? sanitizeData(additionalData) : null,
    });

    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[${level.toUpperCase()}] ${source}:`, errorDetails.errorMessage);
      if (errorDetails.stackTrace) {
        console.error('Stack:', errorDetails.stackTrace);
      }
    }

    return errorLog;
  } catch (logError) {
    // Fallback to console if database logging fails
    console.error('❌ Failed to log error to database:', logError);
    console.error('Original error:', error);
    return null;
  }
};

/**
 * Log error from frontend
 * @param {Object} errorData - Error data from frontend
 * @returns {Promise<Object>} - Created error log entry
 */
export const logFrontendError = async (errorData) => {
  return await logError({
    error: errorData.error || errorData.errorMessage || 'Unknown frontend error',
    source: 'frontend',
    level: errorData.level || 'error',
    statusCode: errorData.statusCode || null,
    additionalData: {
      url: errorData.url,
      component: errorData.component,
      userAgent: errorData.userAgent,
      timestamp: errorData.timestamp,
      ...errorData,
    },
  });
};

/**
 * Mark error as resolved
 * @param {number} errorLogId - Error log ID
 * @param {number} userId - User ID who resolved it
 * @param {string} notes - Optional notes
 * @returns {Promise<Object>} - Updated error log
 */
export const resolveError = async (errorLogId, userId = null, notes = null) => {
  if (!ErrorLog) {
    console.error('⚠️ ErrorLogger not initialized');
    return null;
  }

  try {
    const errorLog = await ErrorLog.findByPk(errorLogId);
    if (!errorLog) {
      throw new Error('Error log not found');
    }

    await errorLog.update({
      resolved: true,
      resolvedAt: new Date(),
      resolvedBy: userId,
      notes: notes || errorLog.notes,
    });

    return errorLog;
  } catch (error) {
    console.error('❌ Failed to resolve error:', error);
    return null;
  }
};

/**
 * Cleanup old error logs
 * @param {number} daysToKeep - Number of days to keep logs (default: 30)
 * @returns {Promise<number>} - Number of deleted logs
 */
export const cleanupOldLogs = async (daysToKeep = 30) => {
  if (!ErrorLog) {
    console.error('⚠️ ErrorLogger not initialized');
    return 0;
  }

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const deletedCount = await ErrorLog.destroy({
      where: {
        createdOnUTC: {
          [require('sequelize').Op.lt]: cutoffDate,
        },
        resolved: true, // Only delete resolved errors
      },
    });

    console.log(`✅ Cleaned up ${deletedCount} old error logs (older than ${daysToKeep} days)`);
    return deletedCount;
  } catch (error) {
    console.error('❌ Failed to cleanup old logs:', error);
    return 0;
  }
};

