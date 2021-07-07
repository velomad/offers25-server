const models = require("../models");
const { Op } = require("sequelize");

module.exports = {
  getUserProfile: async (req, res, next) => {
    const { aud } = req.payload;
    try {
      const result = await models.User.findOne({
        id: aud,
        attributes: { exclude: ["levelId"] },
        include: [
          {
            model: models.Level,
            as: "level",
          },
        ],
      });

      res.status(200).json({ status: "success", result });
    } catch (error) {
      next(error);
    }
  },

  search: async (req, res, next) => {
    const { query } = req.query;
    try {
      const result = await models.User.findAll({
        where: {
          [Op.or]: [
            { uniqueCode: { [Op.like]: "%" + query + "%" } },
            { name: { [Op.like]: "%" + query + "%" } },
            { email: { [Op.like]: "%" + query + "%" } },
          ],
        },
        limit: 10,
      });

      res.status(200).json({
        status: "success",
        results: result.length,
        suggestions: result,
      });
    } catch (error) {
      next(error);
    }
  },

  network: async (req, res, next) => {
    const uniqueCode = req.params.uniqueCode;
    try {
      const result = await models.Network.findAll({
        where: { uniqueCode },
        include: [
          {
            model: models.User,
            as: "user",
            include: [
              {
                model: models.Stat,
                as: "stats",
              },
              {
                model: models.Network,
                as: "network",
              },
            ],
          },
        ],
      });

      res.status(200).json({ status: "success", result });
    } catch (error) {
      next(error);
    }
  },
};
