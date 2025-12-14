const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Note = sequelize.define(
    "Note",
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
        allowNull: true,
      },
      project_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING(191),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      color: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: 'yellow',
      },
      is_pinned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "notes",
      underscored: true,
    }
  );

  Note.associate = (models) => {
    Note.belongsTo(models.User, { foreignKey: "user_id" });
    Note.belongsTo(models.Client, { foreignKey: "client_id" });
    Note.belongsTo(models.Project, { foreignKey: "project_id" });
  };

  return Note;
};
