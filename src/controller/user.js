const models = require("../models");

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
