const models = require("../models");

module.exports = {
  addEarning: async (req, res, next) => {
    const body = req.body;
    const { aud } = req.payload;
    try {
      const result = await models.Earning.create({
        ...body,
        userId: aud,
      });
    } catch (error) {
      next(error);
    }
  },
  showEarnings: async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  },
  revertEarning: async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  },
};
