const router = require("express").Router();
const { getUserProfile, network, search } = require("../controller/user");
const { verifyUserAccessToken } = require("../middlewares/jwt");

// GET
router.get("/getProfile", verifyUserAccessToken, getUserProfile);
router.get("/search", search);
router.get("/network/:uniqueCode", verifyUserAccessToken, network);

module.exports = router;
