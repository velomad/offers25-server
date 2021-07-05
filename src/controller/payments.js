const models = require("../models");
const sequelize = require("../models").sequelize;
const axios = require("axios").default;

module.exports = {
  create: async (req, res, next) => {
    const body = req.body;
    const { aud } = req.payload;
    try {
      const result = await models.BankAccountDetail.create({
        ...body,
        userId: aud,
      });
      res.status(201).json({ status: "success", result: result });
    } catch (error) {
      console.log("Error:", error);
      next(error);
    }
  },

  view: async (req, res, next) => {
    const { aud } = req.payload;
    try {
      const result = await models.BankAccountDetail.findOne({
        where: { userId: aud },
      });
      res.status(201).json({ status: "success", result: result });
    } catch (error) {
      console.log("Error:", error);
      next(error);
    }
  },

  update: async (req, res, next) => {
    const body = req.body;
    const { aud } = req.payload;
    try {
      const result = await models.BankAccountDetail.update(
        {
          ...body,
          userId: aud,
        },
        { where: { userId: aud } }
      );
      res.status(201).json({ status: "success", result: result });
    } catch (error) {
      console.log("Error:", error);
      next(error);
    }
  },

  remove: async (req, res, next) => {
    const { aud } = req.payload;
    try {
      const result = await models.BankAccountDetail.destroy({
        where: { userId: aud },
      });
      res.status(201).json({ status: "success", result: result });
    } catch (error) {
      console.log("Error:", error);
      next(error);
    }
  },
};
