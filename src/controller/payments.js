const models = require("../models");
const sequelize = require("../models").sequelize;
const axios = require('axios').default;

module.exports = {
    create: async (req, res, next) => {
        const body = req.body;
        const { aud } = req.payload;
        try {
            const result = await models.BankAccountDetail.create({
                ...body,
                userId: aud,
            });
            res.status(201).json({ status: "success", result: result });
        } catch (error) {
            console.log("Error:", error);
            next(error);
        }
    }
};
