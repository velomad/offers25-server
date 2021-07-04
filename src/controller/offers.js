const models = require("../models");
const sequelize = require("../models").sequelize;
const createError = require("http-errors");
const { upload, destroy } = require("../cloudinary");

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
    let image, imageUploadResponse;

    let infosData = [];
    let benefitsData = [];
    let stepsData = [];

    const obj = [
      {
        mapKey: "infos",
        pushKey: "infosData",
        dataKey: "info",
      },
      {
        mapKey: "benefits",
        pushKey: "benefitsData",
        dataKey: "benefit",
      },
      {
        mapKey: "steps",
        pushKey: "stepsData",
        dataKey: "step",
      },
    ];

    try {
      if (req.file) {
        image = req.file.path;
        imageUploadResponse = await upload(image);
      } else {
        throw new createError.NotFound("Image not found");
      }

      let result = await sequelize.transaction(async (t) => {
        // create the offer

        const offer = await models.Offer.create(
          {
            ...body,
            offerImageUrl: image ? imageUploadResponse.url : null,
          },
          { transaction: t }
        );

        obj.map((el) => {
          body[el.mapKey].map((value) => {
            eval(el.pushKey).push({
              offerDetailsId: offer.id,
              [el.dataKey]: value,
            });
          });
        });

        // create offerDetail
        const offerDetail = await models.OfferDetail.create(
          { offerId: offer.id },
          { transaction: t }
        );

        // create infos
        const infos = await models.Info.bulkCreate(infosData, {
          transaction: t,
        });
        // create benefits
        const benefits = await models.Benefit.bulkCreate(benefitsData, {
          transaction: t,
        });
        // create steps
        const steps = await models.Step.bulkCreate(stepsData, {
          transaction: t,
        });
      });

      res.status(201).json({ status: "success", result });
    } catch (error) {
      next(error);
    }
  },
};
