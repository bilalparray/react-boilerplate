/**
 * Global Error Handler Middleware
 * Catches all unhandled errors and logs them
 */

import { logError } from '../Helper/errorLogger.helper.js';

/**
 * Global error handler middleware
 * Must be added after all routes
 */
export const errorHandler = (err, req, res, next) => {
  // Handle payload too large errors (413) - must set CORS headers
  if (err && (err.type === 'entity.too.large' || err.status === 413 || err.statusCode === 413)) {
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers, X-CSRF-Token, Cache-Control, Pragma, targetapitype, isdeveloperapk, appversion"
      );
    }

    logError({
      error: err,
      source: 'api',
      level: 'warning',
      req,
      statusCode: 413,
      additionalData: {
        originalUrl: req.originalUrl,
        contentLength: req.headers['content-length'],
        errorType: 'PAYLOAD_TOO_LARGE',
      },
    }).catch(logErr => console.error('Failed to log 413 error:', logErr));

    return res.status(413).json({
      responseStatusCode: 413,
      isError: true,
      errorData: {
        apiErrorType: 1,
        displayMessage: "Request payload too large. Maximum size: 2GB",
        additionalProps: {
          hint: "Please reduce the size of your request. For file uploads, ensure images are compressed or resized before uploading.",
          maxSize: "2GB",
          currentSize: req.headers['content-length'] 
            ? `${(parseInt(req.headers['content-length']) / 1024 / 1024).toFixed(2)}MB` 
            : "unknown",
          suggestion: "Try compressing images or splitting large requests into smaller parts."
        }
      }
    });
  }

  // Handle JSON parsing errors specifically
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }

    // Detect common JSON errors
    let hint = "Please check your request body for syntax errors.";
    if (err.message.includes("Unexpected token }") || err.message.includes("Unexpected token ]")) {
      hint = "Trailing comma detected! Remove any commas before closing braces } or brackets ]. Example: { \"role\": \"Admin\" } (no comma after Admin)";
    } else if (err.message.includes("Unexpected end")) {
      hint = "Incomplete JSON. Check for missing closing braces } or brackets ]";
    } else if (err.message.includes("Unexpected string")) {
      hint = "Check for unclosed strings or missing quotes around property names";
    }

    return res.status(400).json({
      responseStatusCode: 400,
      isError: true,
      errorData: {
        apiErrorType: 1,
        displayMessage: `Invalid JSON format: ${err.message}`,
        additionalProps: {
          hint: hint,
          commonIssues: [
            "Remove trailing commas: { \"role\": \"Admin\" } ❌ { \"role\": \"Admin\", }",
            "Ensure all strings are properly quoted",
            "Check for matching braces { } and brackets [ ]",
            "No comments in JSON (use // or /* */)"
          ],
          example: {
            reqData: {
              username: "john_doe",
              email: "john@example.com",
              password: "securePassword123",
              role: "endUser"
            }
          }
        }
      }
    });
  }

  // Handle CORS errors specifically
  if (err && err.message && err.message.includes("CORS")) {
    const origin = req.headers.origin;
    console.error("❌ CORS Error in error handler:", {
      origin,
      path: req.path,
      method: req.method,
      message: err.message,
    });

    // Ensure CORS headers are set even for errors
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }

    return res.status(403).json({
      responseStatusCode: 403,
      isError: true,
      errorData: {
        apiErrorType: 1,
        displayMessage: "CORS policy: Request blocked",
        additionalProps: {
          origin: origin || "No origin header",
          message: err.message,
        },
      },
    });
  }

  // Log the error
  logError({
    error: err,
    source: 'api',
    level: err.statusCode >= 500 ? 'critical' : 'error',
    req,
    statusCode: err.statusCode || 500,
    additionalData: {
      originalUrl: req.originalUrl,
      params: req.params,
    },
  }).catch(logErr => {
    // If logging fails, at least log to console
    console.error('Failed to log error:', logErr);
  });

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Set CORS headers for error responses
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' && statusCode >= 500
    ? 'Internal server error'
    : err.message || 'An error occurred';

  // Send error response
  res.status(statusCode).json({
    responseStatusCode: statusCode,
    isError: true,
    errorData: {
      displayMessage: message,
      apiErrorType: 1,
      ...(process.env.NODE_ENV !== 'production' && {
        stack: err.stack,
        details: err.details,
      }),
    },
  });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res, next) => {
  // Set CORS headers for 404 responses
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  // Log detailed 404 information for debugging
  const baseUrl = process.env.BASE_URL || '';
  console.warn(`⚠️  404 Not Found: ${req.method} ${req.originalUrl}`);
  console.warn(`   Base URL configured: "${baseUrl || '(empty)'}"`);
  console.warn(`   Expected register route: ${baseUrl || ''}/register`);

  logError({
    error: new Error(`Route not found: ${req.method} ${req.originalUrl}`),
    source: 'api',
    level: 'warning',
    req,
    statusCode: 404,
    additionalData: {
      baseUrl: baseUrl || '(empty)',
      expectedRegisterRoute: `${baseUrl || ''}/register`,
    }
  }).catch(err => console.error('Failed to log 404:', err));

  res.status(404).json({
    responseStatusCode: 404,
    isError: true,
    errorData: {
      displayMessage: 'Route not found',
      apiErrorType: 1,
      additionalProps: process.env.NODE_ENV !== 'production' ? {
        requestedPath: req.originalUrl,
        method: req.method,
        baseUrl: baseUrl || '(empty)',
        hint: `Expected register route: ${baseUrl || ''}/register`
      } : undefined
    },
  });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 * @param {Function} fn - Async route handler function
 * @returns {Function} - Wrapped function
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

