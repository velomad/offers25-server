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
};
