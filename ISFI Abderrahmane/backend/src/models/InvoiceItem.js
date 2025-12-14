const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const InvoiceItem = sequelize.define(
    "InvoiceItem",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      invoice_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 1,
      },
      unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      project_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
    },
    {
      tableName: "invoice_items",
      underscored: true,
    }
  );

  InvoiceItem.associate = (models) => {
    InvoiceItem.belongsTo(models.Invoice, { foreignKey: "invoice_id" });
    InvoiceItem.belongsTo(models.Project, { foreignKey: "project_id" });
  };

  return InvoiceItem;
};
