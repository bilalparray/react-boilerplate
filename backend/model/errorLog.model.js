import { DataTypes } from 'sequelize';

const createErrorLogModel = (sequelize) => {
  const ErrorLog = sequelize.define('ErrorLog', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    source: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'backend',
      validate: {
        isIn: [['backend', 'frontend', 'api', 'database', 'external', 'webhook', 'job']],
      },
      comment: 'Source of the error (backend, frontend, api, database, external, webhook, job)',
    },
    level: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'error',
      validate: {
        isIn: [['error', 'warn', 'warning', 'critical', 'info']],
      },
      comment: 'Error severity level (error, warn, warning, critical, info)',
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Main error message',
    },
    stackTrace: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Full stack trace if available',
    },
    errorType: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Error type/class name (e.g., ValidationError, DatabaseError)',
    },
    endpoint: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'API endpoint where error occurred',
    },
    method: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: 'HTTP method (GET, POST, etc.)',
    },
    statusCode: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'HTTP status code returned',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'User ID if authenticated',
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'User agent string',
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: 'IP address of the client',
    },
    requestBody: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Request body (sanitized - no sensitive data)',
    },
    requestHeaders: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Request headers (sanitized - no sensitive data)',
    },
    queryParams: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Query parameters',
    },
    environment: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Environment (development, staging, production)',
    },
    additionalData: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Any additional context data',
    },
    resolved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether the error has been resolved',
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When the error was marked as resolved',
    },
    resolvedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'User ID who resolved the error',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Admin notes about the error',
    },
  }, {
    timestamps: true,
    createdAt: 'createdOnUTC',
    updatedAt: 'lastModifiedOnUTC',
    indexes: [
      { fields: ['source'] },
      { fields: ['level'] },
      { fields: ['errorType'] },
      { fields: ['endpoint'] },
      { fields: ['statusCode'] },
      { fields: ['userId'] },
      { fields: ['resolved'] },
      { fields: ['createdOnUTC'] },
      { fields: ['environment'] },
      // Composite index for common queries
      { fields: ['source', 'level', 'createdOnUTC'] },
      { fields: ['resolved', 'createdOnUTC'] },
    ],
  });

  return ErrorLog;
};

export default createErrorLogModel;

