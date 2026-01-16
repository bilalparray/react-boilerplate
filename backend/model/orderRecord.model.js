import { DataTypes } from "sequelize";

const createOrderRecordModel = (sequelize) => {
  const Order = sequelize.models.Order;
  const ProductVariant = sequelize.models.ProductVariant;
  const Product = sequelize.models.Product;

  const OrderRecord = sequelize.define(
    "OrderRecord",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Orders", key: "id" },
        onDelete: "CASCADE",
      },
      productVariantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "ProductVariants", key: "id" },
        comment: 'References ProductVariant instead of Product',
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Products", key: "id" },
        comment: 'Denormalized for reporting - kept for backward compatibility',
      },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      createdAt: "createdOnUTC",
      updatedAt: "lastModifiedOnUTC",
      tableName: "OrderRecords",
    }
  );

  // Associations
  OrderRecord.belongsTo(Order, { foreignKey: 'orderId', as: 'order', onDelete: 'CASCADE' });
  OrderRecord.belongsTo(ProductVariant, { foreignKey: 'productVariantId', as: 'variant' });
  OrderRecord.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

  Order.hasMany(OrderRecord, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
  ProductVariant.hasMany(OrderRecord, { foreignKey: 'productVariantId', as: 'orderRecords' });
  Product.hasMany(OrderRecord, { foreignKey: 'productId', as: 'orderRecords' });

  return OrderRecord;
};

export default createOrderRecordModel;
