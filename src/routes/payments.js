const router = require("express").Router();
const { create } = require("../controller/payments");
const { verifyUserAccessToken } = require("../middlewares/jwt");

// POST
router.post("/create", verifyUserAccessToken, create);

module.exports = router;
