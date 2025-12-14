const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Task = sequelize.define(
    "Task",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      project_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(191),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("todo", "in_progress", "completed"),
        allowNull: false,
        defaultValue: "todo",
      },
      priority: {
        type: DataTypes.ENUM("low", "medium", "high"),
        allowNull: false,
        defaultValue: "medium",
      },
      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      estimated_hours: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
    },
    {
      tableName: "tasks",
      underscored: true,
    }
  );

  Task.associate = (models) => {
    Task.belongsTo(models.Project, { foreignKey: "project_id" });
    Task.hasMany(models.TimeEntry, { foreignKey: "task_id" });
  };

  return Task;
};
