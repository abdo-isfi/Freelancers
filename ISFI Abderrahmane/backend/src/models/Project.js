const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Project = sequelize.define(
    "Project",
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
      name: {
        type: DataTypes.STRING(191),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      billing_type: {
        type: DataTypes.ENUM("hourly", "day_rate", "fixed_price"),
        allowNull: false,
      },
      hourly_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      fixed_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      day_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("active", "paused", "finished"),
        allowNull: false,
        defaultValue: "active",
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      end_date_estimated: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      tableName: "projects",
      underscored: true,
    }
  );

  Project.associate = (models) => {
    Project.belongsTo(models.User, { foreignKey: "user_id" });
    Project.belongsTo(models.Client, { foreignKey: "client_id" });
    Project.hasMany(models.Task, { foreignKey: "project_id" });
    Project.hasMany(models.TimeEntry, { foreignKey: "project_id" });
    Project.hasMany(models.InvoiceItem, { foreignKey: "project_id" });
    Project.hasMany(models.Note, { foreignKey: "project_id" });
  };

  return Project;
};
