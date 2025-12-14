const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Invoice = sequelize.define(
    "Invoice",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      client_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      issue_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("draft", "sent", "paid", "overdue", "cancelled"),
        allowNull: false,
        defaultValue: "draft",
      },
      currency: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      total_ht: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total_tva: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total_ttc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "invoices",
      underscored: true,
    }
  );

  Invoice.associate = (models) => {
    Invoice.belongsTo(models.User, { foreignKey: "user_id" });
    Invoice.belongsTo(models.Client, { foreignKey: "client_id" });
    Invoice.hasMany(models.InvoiceItem, { foreignKey: "invoice_id" });
    Invoice.hasMany(models.TimeEntry, { foreignKey: "invoice_id" });
  };

  return Invoice;
};
