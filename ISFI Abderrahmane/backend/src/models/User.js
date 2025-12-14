const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(191),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password_hash: {
        type: DataTypes.STRING(191),
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      currency: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "EUR",
      },
      company_name: {
        type: DataTypes.STRING(191),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      tax_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      tableName: "users",
      underscored: true,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Client, { foreignKey: "user_id" });
    User.hasMany(models.Project, { foreignKey: "user_id" });
    User.hasMany(models.TimeEntry, { foreignKey: "user_id" });
    User.hasMany(models.Invoice, { foreignKey: "user_id" });
    User.hasMany(models.Note, { foreignKey: "user_id" });
    User.hasMany(models.RefreshToken, { foreignKey: "user_id" });
  };

  return User;
};
