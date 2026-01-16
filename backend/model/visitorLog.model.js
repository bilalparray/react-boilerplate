import { DataTypes } from 'sequelize';

const createVisitorLogModel = (sequelize) => {
  const VisitorLog = sequelize.define('VisitorLog', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: 'IP address of the visitor (anonymized for privacy)',
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'User agent string (browser/device info)',
    },
    endpoint: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'API endpoint or page visited',
    },
    method: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: 'HTTP method (GET, POST, etc.)',
    },
    referrer: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Referrer URL (where visitor came from)',
    },
    sessionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Session identifier (optional)',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'User ID if authenticated',
    },
    statusCode: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'HTTP status code',
    },
    responseTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Response time in milliseconds',
    },
    environment: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'production',
      comment: 'Environment (development, staging, production)',
    },
  }, {
    timestamps: true,
    createdAt: 'visitedAt',
    updatedAt: false, // Visitor logs are write-only
    tableName: 'VisitorLogs',
    indexes: [
      { fields: ['visitedAt'] },
      { fields: ['endpoint'] },
      { fields: ['ipAddress'] },
      { fields: ['userId'] },
      { fields: ['method'] },
      // Composite index for daily visitor queries (date + endpoint)
      // Note: Simple composite index - DATE() function index created separately if needed
      { 
        fields: ['visitedAt', 'endpoint'],
        name: 'visitor_date_endpoint_idx'
      },
    ],
  });

  return VisitorLog;
};

export default createVisitorLogModel;

