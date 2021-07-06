const createError = require("http-errors");
const models = require("../models");
const sequelize = require("../models").sequelize;
const { Op } = require("sequelize");
const { addToUserWalletSchema } = require("../validation/payments");
const axios = require("axios").default;

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
  },

  addToUserWallet: async (req, res, next) => {
    const { userId, earningId } = req.params;
    const amount = req.body.amount;
    let wallet, stats;
    try {
      await addToUserWalletSchema.validateAsync({ amount });

      const find = await models.Earning.findOne({
        where: { [Op.and]: [{ id: earningId }, { userId }] },
      });

      if (!find)
        throw new createError.NotFound(
          `earning ID ${earningId} or User ID ${userId} not found`
        );

      if (find.status === "paid")
        throw new createError.UnprocessableEntity(
          `Payout for this ${find.offerName} offer already paid`
        );

      stats = await models.Stat.findOne({
        where: { userId },
      });

      if (amount > stats.pending)
        throw new createError.Forbidden(
          `Wallet transfer amount cannot be greater than pending amount.`
        );

      await sequelize.transaction(async (t) => {
        wallet = await models.Wallet.findOne(
          {
            where: { userId },
          },
          { transaction: t }
        );

        const updateBalance = parseInt(wallet.balance) + amount;

        result = await models.Wallet.update(
          {
            balance: updateBalance,
          },
          { where: { userId } },
          { transaction: t }
        );

        await models.Earning.update(
          {
            status: "paid",
          },
          { where: { [Op.and]: [{ userId }, { id: earningId }] } },
          { transaction: t }
        );

        const updatePendingAmount = parseInt(stats.pending) - amount;

        await models.Stat.update(
          {
            pending: updatePendingAmount,
          },
          { where: { userId } },
          { transaction: t }
        );
      });

      res.status(200).json({
        status: "success",
        wallet,
        stats,
        updatedWallet: wallet.balance + amount,
        updatedStats: stats.pending - amount,
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  },

  view: async (req, res, next) => {
    const { aud } = req.payload;
    try {
      const result = await models.BankAccountDetail.findOne({
        where: { userId: aud },
      });
      res.status(201).json({ status: "success", result: result });
    } catch (error) {
      console.log("Error:", error);
      next(error);
    }
  },

  update: async (req, res, next) => {
    const body = req.body;
    const { aud } = req.payload;
    try {
      await models.BankAccountDetail.update(
        {
          ...body,
          userId: aud,
        },
        { where: { userId: aud } }
      );

      const result = await models.BankAccountDetail.findOne({
        where: { userId: aud },
      });

      res.status(201).json({
        status: "success",
        message: "Bank account details updated",
        result,
      });
    } catch (error) {
      next(error);
    }
  },

  remove: async (req, res, next) => {
    const { aud } = req.payload;
    try {
      await models.BankAccountDetail.destroy({
        where: { userId: aud },
      });
      res
        .status(201)
        .json({ status: "success", message: "bank account details removed" });
    } catch (error) {
      next(error);
    }
  },
};
