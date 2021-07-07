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

  withdrawFromWallet: async (req, res, next) => {
    const { amount } = req.body;
    const { aud } = req.payload;
    let userAccountDetails, userWallet, withdraw, makePayout;
    try {
      // get the user account details

      await sequelize.transaction(async (t) => {
        userAccountDetails = await models.BankAccountDetail.findOne(
          {
            include: [{ model: models.User, as: "user" }],
            where: { userId: aud },
          },
          { transaction: t }
        );

        userWallet = await models.Wallet.findOne(
          {
            where: { userId: aud },
          },
          { transaction: t }
        );
        if (userWallet.balance < 500)
          throw new createError.NotAcceptable(
            `Balance should be more than ₹ 500`
          );

        withdraw = await models.Withdrawal.create(
          {
            userId: aud,
            amount,
          },
          { transaction: t }
        );

        const { accountNumber, ifscCode } = userAccountDetails;
        const { name, email, phoneNumber, uniqueCode } =
          userAccountDetails.user;

        const data = JSON.stringify({
          account_number: 2323230024948434,
          amount: 10000,
          currency: "INR",
          mode: "NEFT",
          purpose: "payout",
          fund_account: {
            account_type: "bank_account",
            bank_account: {
              name: name,
              ifsc: ifscCode,
              account_number: accountNumber,
            },
            contact: {
              name: name,
              email: email,
              contact: phoneNumber,
              type: "customer",
              reference_id: JSON.stringify(uniqueCode),
            },
          },
          queue_if_low_balance: true,
          reference_id: JSON.stringify(withdraw.id),
          narration: "Offer payout",
        });

        makePayout = await axios.post(
          "https://api.razorpay.com/v1/payouts",
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Basic cnpwX3Rlc3RfV2JSVHc0bEZSUDdrUm46djV0TFhDU3o0dUtnWDc1anR6aGRuejNC",
            },
          }
        );

        const updatedWalletBalance = parseInt(userWallet.balance) - amount;

        await models.Wallet.update(
          {
            balance: updatedWalletBalance,
          },
          { where: { userId: aud } },
          { transaction: t }
        );
      });

      res.status(201).json({
        status: "success",
        message: "Wallet amount transfered successfully.",
        withdraw,
        userWallet,
      });
    } catch (error) {
      next(error);
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
