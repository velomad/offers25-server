"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING(13),
        allowNull: false,
      },
      uniqueCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      isRefered: {
        type: DataTypes.ENUM,
        values: ["0", "1"],
        defaultValue: "0",
      },
      levelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
          model: "Levels",
          key: "id",
        },
        defaultValue: "0",
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
