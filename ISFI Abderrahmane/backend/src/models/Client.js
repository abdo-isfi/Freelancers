const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Client = sequelize.define(
    "Client",
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
      name: {
        type: DataTypes.STRING(191),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("company", "individual"),
        allowNull: false,
        defaultValue: "company",
      },
      contact_name: {
        type: DataTypes.STRING(191),
        allowNull: true,
      },
      contact_email: {
        type: DataTypes.STRING(191),
        allowNull: true,
      },
      contact_phone: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      billing_address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_archived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "clients",
      underscored: true,
    }
  );

  Client.associate = (models) => {
    Client.belongsTo(models.User, { foreignKey: "user_id" });
    Client.hasMany(models.Project, { foreignKey: "client_id" });
    Client.hasMany(models.Invoice, { foreignKey: "client_id" });
    Client.hasMany(models.Note, { foreignKey: "client_id" });
  };

  return Client;
};
