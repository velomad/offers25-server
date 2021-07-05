const { Op } = require("sequelize");
const createError = require("http-errors");
const models = require("../models");
const { codeGen } = require("../utils/uniqueCodeGenerator");
const uniqueCodeGenerator = require("../utils/uniqueCodeGenerator");
const { signAccessToken } = require("../middlewares/jwt");

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

      if (result && body.referCode) {
        await models.User.update(
          { isRefered: "1" },
          { where: { uniqueCode: body.referCode } }
        );

        // also push notify with the user name of the one who used refer code while signup
      }

      res.status(200).json({
        status: "success",
        result,
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    const body = req.body;
    try {
      const result = await models.User.findOne({
        where: {
          phoneNumber: body.phoneNumber ? body.phoneNumber : null,
        },
      });

      if (!result) {
        throw createError.Unauthorized("Phone number not found");
      }

      const token = await signAccessToken(
        JSON.stringify(result.id),
        process.env.USER_ACCESS_TOKEN_SECRET
      );

      res.status(200).json({ status: "success", token });
    } catch (error) {
      next(error);
    }
  },
  validateUser: async (req, res, next) => {
    const phoneNumber = req.body.phoneNumber;
    try {
      const found = await models.User.findOne({
        where: {
          phoneNumber: phoneNumber,
        },
      });
      if (!found) throw new createError.NotFound("Phone number not exist.");

      res
        .status(201)
        .json({ status: "success", message: "Authentication Successfull" });
    } catch (error) {
      console.log("Error:", error);
      next(error);
    }
  },
};
