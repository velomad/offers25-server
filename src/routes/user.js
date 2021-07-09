const router = require("express").Router();
const {
  getUserProfile,
  network,
  search,
  getAllUsers,
  getUser,
  userNetwork,
} = require("../controller/user");
const { verifyUserAccessToken } = require("../middlewares/jwt");

// GET
router.get("/getProfile", verifyUserAccessToken, getUserProfile);
router.get("/search", search);
router.get("/allUsers", getAllUsers);
router.get("/details/:userId", getUser);
router.get("/network", verifyUserAccessToken, network);

module.exports = router;
