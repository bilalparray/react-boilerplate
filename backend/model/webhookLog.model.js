import { DataTypes } from 'sequelize';

const createWebhookLogModel = (sequelize) => {
  const WebhookLog = sequelize.define('WebhookLog', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    event: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Razorpay event type (payment.captured, order.paid, etc.)',
    },
    rawBody: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Raw request body (for signature verification)',
    },
    headers: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Request headers (especially x-razorpay-signature)',
    },
    receivedSignature: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Signature received from Razorpay',
    },
    computedSignature: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'HMAC signature computed server-side',
    },
    isSignatureValid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM('processed', 'ignored', 'invalid', 'error'),
      allowNull: false,
      defaultValue: 'invalid',
      // Note: comment removed to avoid Sequelize ALTER bug with ENUM+comment
    },
    razorpayOrderId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Extracted order ID from payload',
    },
    razorpayPaymentId: {
      type: DataTypes.STRING,
      allowNull: true,
      // Note: unique constraint handled via index below to avoid Sequelize ALTER bug
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Error message if processing failed',
    },
    processingTimeMs: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Time taken to process webhook (milliseconds)',
    },
  }, {
    timestamps: true,
    createdAt: 'createdOnUTC',
    updatedAt: 'lastModifiedOnUTC',
    indexes: [
      { fields: ['event'] },
      { fields: ['status'] },
      { fields: ['isSignatureValid'] },
      { fields: ['razorpayOrderId'] },
      { fields: ['razorpayPaymentId'], unique: true },
      { fields: ['createdOnUTC'] },
    ],
  });

  return WebhookLog;
};

export default createWebhookLogModel;

