"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BankDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BankDetail.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
          model: "Users",
          key: "id"
        }
      },
      accoutHolderName: {
        type: DataTypes.STRING
      },
      bankName: {
        type: DataTypes.STRING
      },
      branchName: {
        type: DataTypes.STRING
      },
      bankAccountNumber: {
        type: DataTypes.INTEGER
      },
      ifscCode: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName: "BankDetail"
    }
  );
  return BankDetail;
};
