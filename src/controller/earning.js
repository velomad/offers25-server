const models = require("../models");
const sequelize = require("../models").sequelize;

module.exports = {
  addUserEarning: async (req, res, next) => {
    const body = req.body;
    const userId = req.params.userId;
    let result;

    try {
      await sequelize.transaction(async (t) => {
        result = await models.Earning.create(
          {
            ...body,
            userId,
          },
          { transaction: t }
        );

        // update the stats table

        const stats = await models.Stat.findOne(
          { where: { userId } },
          { transaction: t }
        );

        const updatePendingAmount =
          parseInt(stats.pending) + parseInt(body.amount);

        await models.Stat.update(
          {
            pending: updatePendingAmount,
          },
          { where: { userId } },
          { transaction: t }
        );
      });

      res.status(201).json({ status: "success", result });
    } catch (error) {
      next(error);
    }
  },

  userEarnings: async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  },

  allUsersEarnings: async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  },

  revertUserEarning: async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  },
};
