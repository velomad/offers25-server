const models = require("../models");
const uniqueCodeGenerator = require("../utils/uniqueCodeGenerator");

module.exports = {
  register: async (req, res, next) => {
    try {
      res.status(200).json({
        uniqueCodeGenerator: uniqueCodeGenerator(),
      });
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  },
};
