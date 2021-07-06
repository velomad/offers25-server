const router = require("express").Router();
const { getUserProfile, network } = require("../controller/user");
const { verifyUserAccessToken } = require("../middlewares/jwt");

// GET
router.get("/getProfile", verifyUserAccessToken, getUserProfile);
router.get("/network/:uniqueCode", verifyUserAccessToken, network);

module.exports = router;
