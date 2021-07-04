const { Op } = require("sequelize");
const createError = require("http-errors");
const models = require("../models");
const { codeGen } = require("../utils/uniqueCodeGenerator");

module.exports = {
  register: async (req, res, next) => {
    const body = req.body;

    try {
      const find = await models.User.findOne({
        where: {
          [Op.or]: [
            {
              email: body.email,
            },
            {
              phoneNumber: body.phoneNumber,
            },
          ],
        },
      });

      if (find)
        throw new createError.Conflict(
          "Phone Number or Email-Id already in use."
        );

      const uniqueCode = await codeGen(models.User);

      const result = await models.User.create({
        ...body,
        uniqueCode,
      });

      res.status(200).json({
        status: "success",
        result,
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
