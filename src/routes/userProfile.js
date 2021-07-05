const router = require("express").Router();
const { getUserProfile } = require("../controller/userProfile");
const { verifyUserAccessToken } = require("../middlewares/jwt");

// GET
router.get("/getProfile", verifyUserAccessToken, getUserProfile);

module.exports = router;
