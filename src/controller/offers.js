const models = require("../models");
const sequelize = require("../models").sequelize;

module.exports = {
  allOffers: async (req, res, next) => {
    try {
      const result = await models.Offer.findAll({
        attributes: { exclude: ["offerTypeId"] },
        include: [
          {
            model: models.OfferType,
            required: true,
            as: "offerType",
          },
          {
            model: models.OfferDetail,
            required: true,
            as: "details",
          },
        ],
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    const body = req.body;

    console.log(body);

    try {
      // let result = await sequelize.transaction(async (t) => {
      //   // create the offer
      //   const offer = await models.Offer.create(body);
      //   // create offerDetail
      //   return await Model.create({}, { transaction: t });
      // });
    } catch (error) {
      next(error);
      console.log(error);
    }
  },
};
