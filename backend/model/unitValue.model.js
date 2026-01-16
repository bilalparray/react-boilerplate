import { DataTypes } from 'sequelize';

const createUnitValueModel = (sequelize) => {
  const UnitValue = sequelize.define('UnitValue', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    unitType: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Optional unit type (e.g., "Weight", "Volume", "Length")',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: true, // e.g., "g", "kg", "ml", "L"
    },
    multiplier: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true,
      defaultValue: 1.0,
      comment: 'Conversion multiplier to base unit (e.g., kg = 1000g, so multiplier = 1000)',
    },
    isBaseUnit: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether this is the base unit for conversion',
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: 'Order for display in UI',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lastModifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    timestamps: true,
    createdAt: 'createdOnUTC',
    updatedAt: 'lastModifiedOnUTC',
    indexes: [
      { fields: ['unitType'] },
      { fields: ['name'], unique: true },
      { fields: ['isActive'] },
    ],
  });

  return UnitValue;
};

export default createUnitValueModel;

