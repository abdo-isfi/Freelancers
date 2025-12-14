const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const TimeEntry = sequelize.define(
    "TimeEntry",
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
      project_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      task_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      duration_minutes: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      is_billed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_billable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      invoice_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
    },
    {
      tableName: "time_entries",
      underscored: true,
    }
  );

  TimeEntry.associate = (models) => {
    TimeEntry.belongsTo(models.User, { foreignKey: "user_id" });
    TimeEntry.belongsTo(models.Project, { foreignKey: "project_id" });
    TimeEntry.belongsTo(models.Task, { foreignKey: "task_id" });
    TimeEntry.belongsTo(models.Invoice, { foreignKey: "invoice_id" });
  };

  return TimeEntry;
};
